import "dotenv/config"
import { eq, or, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/mysql2"
import { account, session, user } from "./schema/auth"
import { applicationComments, applicationMilestones, applications } from "./schema/applications"
import {
    fosterApplicationComments,
    fosterApplicationMilestones,
} from "./schema/foster-applications"
import { rolePermission, userRole } from "./schema/roles"

type Args = {
    email?: string
    force: boolean
    purgeHistory: boolean
}

function parseArgs(argv: string[]): Args {
    const args: Args = { force: false, purgeHistory: false }
    for (const a of argv) {
        if (a === "--force") args.force = true
        else if (a === "--purge-history") args.purgeHistory = true
        else if (a.startsWith("--email=")) args.email = a.slice("--email=".length)
        else if (!a.startsWith("--") && !args.email) args.email = a
    }
    return args
}

function usage(): never {
    console.error(
        [
            "Usage: pnpm --filter @repo/database db:delete-user <email> [--force] [--purge-history]",
            "",
            "  <email>            email of the user to delete",
            "  --force            actually delete (default is dry-run)",
            "  --purge-history    also delete the user's comments and milestones",
            "                     (required if the user has authored any of those)",
        ].join("\n"),
    )
    process.exit(1)
}

async function main() {
    const args = parseArgs(process.argv.slice(2))
    if (!args.email) usage()

    const db = drizzle(process.env.DATABASE_URL!)

    const [target] = await db.select().from(user).where(eq(user.email, args.email!))
    if (!target) {
        console.error(`No user found with email ${args.email}`)
        process.exit(1)
    }

    console.log(`Found user: ${target.email}  id=${target.id}  name=${target.name}`)

    // Count everything that references this user.
    const counts = {
        sessions: await count(db, session, eq(session.userId, target.id)),
        accounts: await count(db, account, eq(account.userId, target.id)),
        userRoles: await count(db, userRole, eq(userRole.userId, target.id)),
        appsAsRep: await count(db, applications, eq(applications.adoptionRep, target.id)),
        appComments: await count(
            db,
            applicationComments,
            eq(applicationComments.userId, target.id),
        ),
        appMilestones: await count(
            db,
            applicationMilestones,
            eq(applicationMilestones.userId, target.id),
        ),
        fosterComments: await count(
            db,
            fosterApplicationComments,
            eq(fosterApplicationComments.userId, target.id),
        ),
        fosterMilestones: await count(
            db,
            fosterApplicationMilestones,
            eq(fosterApplicationMilestones.userId, target.id),
        ),
        userRoleAssignedBy: await count(db, userRole, eq(userRole.assignedBy, target.id)),
        rolePermAssignedBy: await count(
            db,
            rolePermission,
            eq(rolePermission.assignedBy, target.id),
        ),
    }

    console.log("\nReferences to this user:")
    for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(22)} ${v}`)

    const hasHistory =
        counts.appComments +
            counts.appMilestones +
            counts.fosterComments +
            counts.fosterMilestones >
        0

    if (hasHistory && !args.purgeHistory) {
        console.error("\nUser has authored history (comments / milestones).")
        console.error("Re-run with --purge-history to delete it, or reassign before deleting.")
        process.exit(1)
    }

    if (!args.force) {
        console.log("\nDry run. Re-run with --force to actually delete.")
        process.exit(0)
    }

    // Order matters because of NOT NULL FKs.
    // 1. Null out nullable FKs (so we don't have to delete those rows).
    // 2. Delete rows that have NOT NULL FKs back to user (session, account, userRole, and
    //    optionally history rows when --purge-history).
    // 3. Delete the user.
    await db.transaction(async (tx) => {
        // Nullable FKs — keep the rows, just drop the reference.
        await tx
            .update(applications)
            .set({ adoptionRep: null })
            .where(eq(applications.adoptionRep, target.id))
        await tx
            .update(userRole)
            .set({ assignedBy: null })
            .where(eq(userRole.assignedBy, target.id))
        await tx
            .update(rolePermission)
            .set({ assignedBy: null })
            .where(eq(rolePermission.assignedBy, target.id))

        // NOT NULL FKs that we always cascade-delete.
        await tx.delete(session).where(eq(session.userId, target.id))
        await tx.delete(account).where(eq(account.userId, target.id))
        await tx.delete(userRole).where(eq(userRole.userId, target.id))

        if (args.purgeHistory) {
            await tx.delete(applicationComments).where(eq(applicationComments.userId, target.id))
            await tx
                .delete(applicationMilestones)
                .where(eq(applicationMilestones.userId, target.id))
            await tx
                .delete(fosterApplicationComments)
                .where(eq(fosterApplicationComments.userId, target.id))
            await tx
                .delete(fosterApplicationMilestones)
                .where(eq(fosterApplicationMilestones.userId, target.id))
        }

        await tx.delete(user).where(eq(user.id, target.id))
    })

    console.log(`\nDeleted user ${target.email}.`)
    process.exit(0)
}

async function count(
    db: ReturnType<typeof drizzle>,
    table: Parameters<typeof db.select>[0] extends never
        ? never
        : Parameters<ReturnType<typeof db.select>["from"]>[0],
    where: Parameters<ReturnType<ReturnType<typeof db.select>["from"]>["where"]>[0],
): Promise<number> {
    const [row] = await db
        .select({ n: sql<number>`count(*)` })
        .from(table)
        .where(where)
    return Number(row?.n ?? 0)
}

main().catch((err) => {
    console.error("delete-user failed:", err)
    process.exit(1)
})
