import {
    boolean,
    date,
    int,
    mysqlEnum,
    mysqlTable,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core"

export const events = mysqlTable("events", {
    id: int().primaryKey().autoincrement(),
    title: varchar({ length: 255 }).notNull(),
    startDate: date({ mode: "string" }).notNull(),
    endDate: date({ mode: "string" }),
    recurrence: mysqlEnum(["once", "weekly", "monthly_by_date", "monthly_by_weekday"])
        .notNull()
        .default("once"),
    time: varchar({ length: 255 }).notNull(),
    location: varchar({ length: 255 }).notNull(),
    type: mysqlEnum(["Annual", "Fundraiser", "Monthly", "Weekly", "Seasonal", "Special"]).notNull(),
    description: text().notNull(),
    longDescription: text().notNull(),
    archived: boolean().notNull().default(false),
    showUpcoming: boolean().notNull().default(true),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
})
