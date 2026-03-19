import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from './schema/index';

let _db: MySql2Database<typeof schema> | undefined;

export const db = new Proxy({} as MySql2Database<typeof schema>, {
  get(_target, prop, receiver) {
    if (!_db) {
      _db = drizzle(process.env.DATABASE_URL!, { schema, mode: 'default' });
    }
    return Reflect.get(_db, prop, receiver);
  },
});

export * from './schema/index';
export * from './queries/events';
export * from './queries/content';
export * from './queries/photos';
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
