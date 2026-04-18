import { NextRequest, NextResponse } from "next/server"
import { getApplicationByToken } from "@repo/database"

const COOKIE_NAME = "application_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get("token")
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? request.url

    if (!token) {
        return NextResponse.redirect(new URL("/adopt/apply", base))
    }

    const result = await getApplicationByToken(token)
    if (!result || new Date(result.token.expiresAt) < new Date()) {
        return NextResponse.redirect(new URL("/adopt/apply", base))
    }

    const { application } = result
    const destination =
        application.status !== "draft" ? "/adopt/apply/status" : "/adopt/apply/wizard"

    const response = NextResponse.redirect(new URL(destination, base))
    response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/adopt/apply",
        maxAge: COOKIE_MAX_AGE,
    })

    return response
}
