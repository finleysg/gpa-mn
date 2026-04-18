import { boolean, mysqlTable, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core"
import { user } from "./auth"

export const ROLE_NAMES = [
    "Super Admin",
    "Adoption Matcher",
    "Adoption Coordinator",
    "Adoption Rep",
    "Foster Coordinator",
    "Foster",
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Board Member",
] as const

export type RoleName = (typeof ROLE_NAMES)[number]

export const PERMISSION_NAMES = [
    "Content Edit",
    "User Edit",
    "Adoption View",
    "My Adoption View",
    "Adoption Edit",
    "My Adoption Edit",
    "Foster View",
    "Foster Edit",
] as const

export type PermissionName = (typeof PERMISSION_NAMES)[number]

export const PERMISSION_DESCRIPTIONS: Record<PermissionName, string> = {
    "Content Edit": "View and edit all web content",
    "User Edit": "View and edit users and roles",
    "Adoption View": "View all adoption applications",
    "My Adoption View": "View adoption applications assigned to me",
    "Adoption Edit": "Edit and comment in all adoption applications (implies view)",
    "My Adoption Edit": "Edit and comment in my adoption applications (implies view)",
    "Foster View": "View foster applications",
    "Foster Edit": "Edit and comment in foster applications (implies view)",
}

export const role = mysqlTable("role", {
    id: varchar({ length: 36 }).primaryKey(),
    name: varchar({ length: 50 }).notNull().unique(),
    description: text(),
    websiteVisible: boolean().notNull().default(false),
    system: boolean().notNull().default(false),
    createdAt: timestamp().notNull().defaultNow(),
})

export const permission = mysqlTable("permission", {
    id: varchar({ length: 36 }).primaryKey(),
    name: varchar({ length: 50 }).notNull().unique(),
    description: text(),
    createdAt: timestamp().notNull().defaultNow(),
})

export const rolePermission = mysqlTable(
    "role_permission",
    {
        id: varchar({ length: 36 }).primaryKey(),
        roleId: varchar({ length: 36 })
            .notNull()
            .references(() => role.id),
        permissionId: varchar({ length: 36 })
            .notNull()
            .references(() => permission.id),
        assignedAt: timestamp().notNull().defaultNow(),
        assignedBy: varchar({ length: 36 }).references(() => user.id),
    },
    (t) => [unique().on(t.roleId, t.permissionId)],
)

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
