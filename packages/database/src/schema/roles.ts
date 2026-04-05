import { mysqlTable, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core"
import { user } from "./auth"

export const ROLE_NAMES = [
    "Super Admin",
    "User Admin",
    "Content Admin",
    "Adoption Matcher",
    "Adoption Coordinator",
    "Adoption Rep",
    "Adoption Observer",
    "Foster Coordinator",
    "Foster",
] as const

export type RoleName = (typeof ROLE_NAMES)[number]

export const role = mysqlTable("role", {
    id: varchar({ length: 36 }).primaryKey(),
    name: varchar({ length: 50 }).notNull().unique(),
    description: text(),
    createdAt: timestamp().notNull().defaultNow(),
})

export const userRole = mysqlTable(
    "user_role",
    {
        id: varchar({ length: 36 }).primaryKey(),
        userId: varchar({ length: 36 })
            .notNull()
            .references(() => user.id),
        roleId: varchar({ length: 36 })
            .notNull()
            .references(() => role.id),
        assignedAt: timestamp().notNull().defaultNow(),
        assignedBy: varchar({ length: 36 }).references(() => user.id),
    },
    (t) => [unique().on(t.userId, t.roleId)],
)

export const invitation = mysqlTable("invitation", {
    id: varchar({ length: 36 }).primaryKey(),
    email: varchar({ length: 255 }).notNull(),
    token: varchar({ length: 255 }).notNull().unique(),
    expiresAt: timestamp().notNull(),
    invitedBy: varchar({ length: 36 })
        .notNull()
        .references(() => user.id),
    status: varchar({ length: 20 }).notNull().default("pending"),
    acceptedAt: timestamp(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
})

export const invitationRole = mysqlTable(
    "invitation_role",
    {
        id: varchar({ length: 36 }).primaryKey(),
        invitationId: varchar({ length: 36 })
            .notNull()
            .references(() => invitation.id),
        roleId: varchar({ length: 36 })
            .notNull()
            .references(() => role.id),
    },
    (t) => [unique().on(t.invitationId, t.roleId)],
)
