import "dotenv/config"
import { drizzle } from "drizzle-orm/mysql2"
import { role, ROLE_NAMES } from "./schema/roles"

const db = drizzle(process.env.DATABASE_URL!)

async function seedRoles() {
    for (const name of ROLE_NAMES) {
        await db
            .insert(role)
            .values({ id: crypto.randomUUID(), name })
            .onDuplicateKeyUpdate({ set: { name } })
    }

    console.log(`Seeded ${ROLE_NAMES.length} roles`)
    process.exit(0)
}

seedRoles().catch((err) => {
    console.error("Seed roles failed:", err)
    process.exit(1)
})
