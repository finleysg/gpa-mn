import "dotenv/config"
import { drizzle } from "drizzle-orm/mysql2"
import { inArray } from "drizzle-orm"
import { invitationRole, role, rolePermission, userRole } from "./schema/roles"

const LEGACY_ROLE_NAMES = ["Content Admin", "User Admin"]

const db = drizzle(process.env.DATABASE_URL!)

async function cleanupLegacyRoles() {
    const legacyRoles = await db
        .select({ id: role.id, name: role.name })
        .from(role)
        .where(inArray(role.name, LEGACY_ROLE_NAMES))

    if (legacyRoles.length === 0) {
        console.log("No legacy roles found; nothing to clean up.")
        process.exit(0)
    }

    const ids = legacyRoles.map((r) => r.id)

    await db.delete(userRole).where(inArray(userRole.roleId, ids))
    await db.delete(invitationRole).where(inArray(invitationRole.roleId, ids))
    await db.delete(rolePermission).where(inArray(rolePermission.roleId, ids))
    await db.delete(role).where(inArray(role.id, ids))

    console.log(
        `Removed ${legacyRoles.length} legacy roles: ${legacyRoles
            .map((r) => r.name)
            .join(
                ", ",
            )}. Related user_role, invitation_role, and role_permission rows also cleaned.`,
    )
    process.exit(0)
}

cleanupLegacyRoles().catch((err) => {
    console.error("Cleanup legacy roles failed:", err)
    process.exit(1)
})
