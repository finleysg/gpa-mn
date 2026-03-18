import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const events = mysqlTable('events', {
  id: int().primaryKey().autoincrement(),
  title: varchar({ length: 255 }).notNull(),
  date: varchar({ length: 255 }).notNull(),
  time: varchar({ length: 255 }).notNull(),
  location: varchar({ length: 255 }).notNull(),
  type: mysqlEnum(['Annual', 'Fundraiser', 'Monthly', 'Weekly', 'Seasonal', 'Special']).notNull(),
  description: text().notNull(),
  longDescription: text().notNull(),
  sortOrder: int().notNull().default(0),
  archived: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
});
