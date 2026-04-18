import { cookies } from "next/headers"

const COOKIE_NAME = "foster_application_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function setFosterApplicationCookie(token: string) {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/foster/apply",
        maxAge: COOKIE_MAX_AGE,
    })
}

export async function getFosterApplicationCookie(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get(COOKIE_NAME)?.value ?? null
}

export async function clearFosterApplicationCookie() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}
