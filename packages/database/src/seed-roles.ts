import "dotenv/config"
import { drizzle } from "drizzle-orm/mysql2"
import { eq } from "drizzle-orm"
import {
    permission,
    PERMISSION_DESCRIPTIONS,
    PERMISSION_NAMES,
    role,
    ROLE_NAMES,
} from "./schema/roles"

const db = drizzle(process.env.DATABASE_URL!)

async function seedRoles() {
    for (const name of ROLE_NAMES) {
        const isSuperAdmin = name === "Super Admin"
        await db
            .insert(role)
            .values({ id: crypto.randomUUID(), name, system: isSuperAdmin })
            .onDuplicateKeyUpdate({ set: { name, system: isSuperAdmin } })
    }

    for (const name of PERMISSION_NAMES) {
        await db
            .insert(permission)
            .values({
                id: crypto.randomUUID(),
                name,
                description: PERMISSION_DESCRIPTIONS[name],
            })
            .onDuplicateKeyUpdate({ set: { description: PERMISSION_DESCRIPTIONS[name] } })
    }

    // Force-remove legacy Super Admin role flag on any other role (defensive)
    await db.update(role).set({ system: false }).where(eq(role.system, true))
    await db.update(role).set({ system: true }).where(eq(role.name, "Super Admin"))

    console.log(`Seeded ${ROLE_NAMES.length} roles and ${PERMISSION_NAMES.length} permissions`)
    process.exit(0)
}

seedRoles().catch((err) => {
    console.error("Seed roles failed:", err)
    process.exit(1)
})
