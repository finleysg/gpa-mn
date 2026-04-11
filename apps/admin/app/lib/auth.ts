import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db, user, session, account, verification } from "@repo/database"
import { sendPasswordResetEmail, sendChangeEmailVerification } from "@/app/_lib/email"

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
    trustedOrigins: [
        "http://localhost:*",
        "http://gpamn-admin.localhost:*",
        "http://gpamn-admin.localhost",
    ],
    database: drizzleAdapter(db, {
        provider: "mysql",
        schema: { user, session, account, verification },
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        sendResetPassword: async ({ user, url }) => {
            await sendPasswordResetEmail({ to: user.email, url })
        },
    },
    user: {
        changeEmail: {
            enabled: true,
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await sendChangeEmailVerification({ to: user.email, url })
        },
    },
    plugins: [nextCookies()],
})
