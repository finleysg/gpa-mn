import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db, user, session, account, verification } from '@repo/database';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
  trustedOrigins: ['http://localhost:*', 'http://admin.localhost:*', 'http://admin.localhost'],
  database: drizzleAdapter(db, { provider: 'mysql', schema: { user, session, account, verification } }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
