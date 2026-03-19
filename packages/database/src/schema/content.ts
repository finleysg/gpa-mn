import { int, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { boolean } from 'drizzle-orm/mysql-core';

export const contentItems = mysqlTable(
  'contentItems',
  {
    id: int().primaryKey().autoincrement(),
    contentType: mysqlEnum(['sectionHeader', 'pageHeader', 'adoptionStep', 'volunteerRole', 'donationOption', 'aboutPage', 'beforeYouApply', 'postAdoptionSupport', 'lostHoundSuggestion', 'whyGreyhound']).notNull(),
    slug: varchar({ length: 255 }).notNull(),
    sortOrder: int().notNull().default(0),
    archived: boolean().notNull().default(false),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [uniqueIndex('contentType_slug_idx').on(table.contentType, table.slug)],
);

export const contentVersions = mysqlTable(
  'contentVersions',
  {
    id: int().primaryKey().autoincrement(),
    contentItemId: int()
      .notNull()
      .references(() => contentItems.id),
    version: int().notNull(),
    data: json().notNull(),
    createdBy: varchar({ length: 255 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    changeNote: text(),
  },
  (table) => [uniqueIndex('contentItemId_version_idx').on(table.contentItemId, table.version)],
);
