import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/mysql2';
import * as authSchema from './schema/auth';

const db = drizzle(process.env.DATABASE_URL!);

const auth = betterAuth({
  baseURL: 'http://localhost',
  database: drizzleAdapter(db, { provider: 'mysql', schema: authSchema }),
  emailAndPassword: { enabled: true },
});

async function seedUser() {
  const password = process.env.TEST_USER_PASSWORD;
  if (!password) {
    console.error('TEST_USER_PASSWORD env var is required');
    process.exit(1);
  }

  const result = await auth.api.signUpEmail({
    body: {
      name: 'Admin',
      email: 'admin@gpa-mn.org',
      password,
    },
  });

  if (!result) {
    console.error('Failed to create user');
    process.exit(1);
  }

  console.log('Created admin user: admin@gpa-mn.org');
  process.exit(0);
}

seedUser().catch((err) => {
  console.error('Seed user failed:', err);
  process.exit(1);
});
