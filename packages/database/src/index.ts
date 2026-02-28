import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema/index.js';

export const db = drizzle(process.env.DATABASE_URL!, { schema, mode: 'default' });

export * from './schema/index.js';
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
