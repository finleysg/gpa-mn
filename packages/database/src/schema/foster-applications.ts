import {
    boolean,
    foreignKey,
    int,
    json,
    mysqlEnum,
    mysqlTable,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core"
import { user } from "./auth"

export const FOSTER_APPLICATION_STATUSES = [
    "draft",
    "submitted",
    "in_review",
    "approved",
    "denied",
    "on_hold",
] as const

export type FosterApplicationStatus = (typeof FOSTER_APPLICATION_STATUSES)[number]

export const FOSTER_SECTION_KEYS = [
    "applicant_info",
    "household",
    "pre_foster",
    "home",
    "current_pets",
    "foster_preferences",
    "vet_reference",
    "personal_references",
    "foster_agreements",
    "final_questions",
] as const

export type FosterSectionKey = (typeof FOSTER_SECTION_KEYS)[number]

export const FOSTER_SECTION_CATEGORIES = [
    "applicant_info",
    "household",
    "pre_foster",
    "home",
    "current_pets",
    "foster_preferences",
    "vet_reference",
    "personal_references",
    "foster_agreements",
    "final_questions",
    "general",
] as const

export type FosterSectionCategory = (typeof FOSTER_SECTION_CATEGORIES)[number]

export const FOSTER_MILESTONES = [
    "screened",
    "interviewed",
    "reference_check",
    "home_visit",
    "approved",
] as const

export type FosterMilestone = (typeof FOSTER_MILESTONES)[number]

export const fosterApplications = mysqlTable("fosterApplications", {
    id: int().primaryKey().autoincrement(),
    email: varchar({ length: 255 }).notNull(),
    firstName: varchar({ length: 255 }).notNull(),
    lastName: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 50 }),
    status: mysqlEnum("status", FOSTER_APPLICATION_STATUSES).notNull().default("draft"),
    submittedAt: timestamp(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
})

export const fosterApplicationMilestones = mysqlTable(
    "fosterApplicationMilestones",
    {
        id: int().primaryKey().autoincrement(),
        fosterApplicationId: int().notNull(),
        milestone: mysqlEnum("milestone", FOSTER_MILESTONES).notNull(),
        completedAt: timestamp().notNull(),
        notes: text(),
        userId: varchar({ length: 36 })
            .notNull()
            .references(() => user.id),
        createdAt: timestamp().notNull().defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fa_milestones_app_fk",
            columns: [table.fosterApplicationId],
            foreignColumns: [fosterApplications.id],
        }),
        uniqueIndex("fosterApplicationId_milestone_idx").on(
            table.fosterApplicationId,
            table.milestone,
        ),
    ],
)

export const fosterApplicationSections = mysqlTable(
    "fosterApplicationSections",
    {
        id: int().primaryKey().autoincrement(),
        fosterApplicationId: int().notNull(),
        sectionKey: mysqlEnum("sectionKey", FOSTER_SECTION_KEYS).notNull(),
        version: int().notNull().default(1),
        data: json().notNull(),
        createdAt: timestamp().notNull().defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fa_sections_app_fk",
            columns: [table.fosterApplicationId],
            foreignColumns: [fosterApplications.id],
        }),
        uniqueIndex("fosterApplicationId_sectionKey_version_idx").on(
            table.fosterApplicationId,
            table.sectionKey,
            table.version,
        ),
    ],
)

export const fosterApplicationComments = mysqlTable(
    "fosterApplicationComments",
    {
        id: int().primaryKey().autoincrement(),
        fosterApplicationId: int().notNull(),
        userId: varchar({ length: 36 })
            .notNull()
            .references(() => user.id),
        sectionCategory: mysqlEnum("sectionCategory", FOSTER_SECTION_CATEGORIES),
        body: text().notNull(),
        isSystemEvent: boolean().notNull().default(false),
        createdAt: timestamp().notNull().defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fa_comments_app_fk",
            columns: [table.fosterApplicationId],
            foreignColumns: [fosterApplications.id],
        }),
    ],
)

export const fosterApplicationTokens = mysqlTable(
    "fosterApplicationTokens",
    {
        id: int().primaryKey().autoincrement(),
        fosterApplicationId: int().notNull(),
        token: varchar({ length: 64 }).notNull().unique(),
        expiresAt: timestamp().notNull(),
        createdAt: timestamp().notNull().defaultNow(),
    },
    (table) => [
        foreignKey({
            name: "fa_tokens_app_fk",
            columns: [table.fosterApplicationId],
            foreignColumns: [fosterApplications.id],
        }),
    ],
)
