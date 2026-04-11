import { boolean, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core"

export const user = mysqlTable("user", {
    id: varchar({ length: 36 }).primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    emailVerified: boolean().notNull().default(false),
    image: text(),
    phone: varchar({ length: 32 }),
    notifyOnSubmission: boolean().notNull().default(true),
    notifyOnAssignment: boolean().notNull().default(true),
    deactivatedAt: timestamp(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
})

export const session = mysqlTable("session", {
    id: varchar({ length: 36 }).primaryKey(),
    expiresAt: timestamp().notNull(),
    token: varchar({ length: 255 }).notNull().unique(),
    ipAddress: text(),
    userAgent: text(),
    userId: varchar({ length: 36 })
        .notNull()
        .references(() => user.id),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
})

export const account = mysqlTable("account", {
    id: varchar({ length: 36 }).primaryKey(),
    accountId: varchar({ length: 255 }).notNull(),
    providerId: varchar({ length: 255 }).notNull(),
    userId: varchar({ length: 36 })
        .notNull()
        .references(() => user.id),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
})

export const verification = mysqlTable("verification", {
    id: varchar({ length: 36 }).primaryKey(),
    identifier: varchar({ length: 255 }).notNull(),
    value: varchar({ length: 255 }).notNull(),
    expiresAt: timestamp().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
})
