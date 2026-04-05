import "dotenv/config"
import { defineConfig } from "drizzle-kit"

function parseConnectionUrl(connectionUrl: string) {
    // mysql://user:password@host:port/database
    const match = connectionUrl.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/)
    if (!match) throw new Error(`Invalid DATABASE_URL: ${connectionUrl}`)
    const [, user, password, host, port, database] = match
    return {
        host: host!,
        port: Number(port),
        user: user!,
        password: password!,
        database: database!,
    }
}

export default defineConfig({
    out: "./drizzle",
    schema: [
        "./src/schema/auth.ts",
        "./src/schema/events.ts",
        "./src/schema/content.ts",
        "./src/schema/photos.ts",
        "./src/schema/roles.ts",
    ],
    dialect: "mysql",
    dbCredentials: parseConnectionUrl(process.env.DATABASE_URL!),
    verbose: true,
    strict: true,
})
