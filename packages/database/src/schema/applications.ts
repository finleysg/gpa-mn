import {
    boolean,
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

export const APPLICATION_STATUSES = [
    "draft",
    "submitted",
    "in_review",
    "approved",
    "adopted",
    "denied",
    "on_hold",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const SECTION_KEYS = [
    "applicant_info",
    "household",
    "pre_adoption",
    "home",
    "current_pets",
    "your_greyhound",
    "vet_reference",
    "personal_references",
    "final_questions",
] as const

export type SectionKey = (typeof SECTION_KEYS)[number]

export const SECTION_CATEGORIES = [
    "applicant_info",
    "household",
    "pre_adoption",
    "home",
    "current_pets",
    "your_greyhound",
    "vet_reference",
    "personal_references",
    "final_questions",
    "general",
] as const

export type SectionCategory = (typeof SECTION_CATEGORIES)[number]

export const MILESTONES = [
    "screened",
    "interviewed",
    "approved",
    "matched",
    "match_presented",
    "adopted",
] as const

export type Milestone = (typeof MILESTONES)[number]

export const applications = mysqlTable("applications", {
    id: int().primaryKey().autoincrement(),
    email: varchar({ length: 255 }).notNull(),
    firstName: varchar({ length: 255 }).notNull(),
    lastName: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 50 }),
    status: mysqlEnum("status", APPLICATION_STATUSES).notNull().default("draft"),
    adoptionRep: varchar({ length: 36 }).references(() => user.id),
    houndId: varchar({ length: 50 }),
    houndName: varchar({ length: 255 }),
    submittedAt: timestamp(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
})

export const applicationMilestones = mysqlTable(
    "applicationMilestones",
    {
        id: int().primaryKey().autoincrement(),
        applicationId: int()
            .notNull()
            .references(() => applications.id),
        milestone: mysqlEnum("milestone", MILESTONES).notNull(),
        completedAt: timestamp().notNull(),
        notes: text(),
        userId: varchar({ length: 36 })
            .notNull()
            .references(() => user.id),
        createdAt: timestamp().notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("applicationId_milestone_idx").on(table.applicationId, table.milestone),
    ],
)

export const applicationSections = mysqlTable(
    "applicationSections",
    {
        id: int().primaryKey().autoincrement(),
        applicationId: int()
            .notNull()
            .references(() => applications.id),
        sectionKey: mysqlEnum("sectionKey", SECTION_KEYS).notNull(),
        version: int().notNull().default(1),
        data: json().notNull(),
        createdAt: timestamp().notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("applicationId_sectionKey_version_idx").on(
            table.applicationId,
            table.sectionKey,
            table.version,
        ),
    ],
)

export const applicationComments = mysqlTable("applicationComments", {
    id: int().primaryKey().autoincrement(),
    applicationId: int()
        .notNull()
        .references(() => applications.id),
    userId: varchar({ length: 36 })
        .notNull()
        .references(() => user.id),
    sectionCategory: mysqlEnum("sectionCategory", SECTION_CATEGORIES),
    body: text().notNull(),
    isSystemEvent: boolean().notNull().default(false),
    createdAt: timestamp().notNull().defaultNow(),
})

export const applicationTokens = mysqlTable("applicationTokens", {
    id: int().primaryKey().autoincrement(),
    applicationId: int()
        .notNull()
        .references(() => applications.id),
    token: varchar({ length: 64 }).notNull().unique(),
    expiresAt: timestamp().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
})
