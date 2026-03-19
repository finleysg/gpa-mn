import { index, int, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const photos = mysqlTable(
  'photos',
  {
    id: int().primaryKey().autoincrement(),
    photoType: mysqlEnum(['event', 'content']).notNull(),
    parentId: int().notNull(),
    variant: mysqlEnum(['desktop', 'mobile', 'default']).notNull().default('default'),
    s3Key: varchar({ length: 512 }).notNull(),
    originalFilename: varchar({ length: 255 }).notNull(),
    contentType: varchar({ length: 100 }).notNull(),
    sortOrder: int().notNull().default(0),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
  },
  (table) => [index('photoType_parentId_variant_idx').on(table.photoType, table.parentId, table.variant)],
);
