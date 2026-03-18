import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema/index';

export const db = drizzle(process.env.DATABASE_URL!, { schema, mode: 'default' });

export * from './schema/index';
export * from './queries/events';
export * from './queries/content';
export * from './queries/photos';
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
