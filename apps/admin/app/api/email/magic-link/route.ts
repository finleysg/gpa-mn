import { NextResponse } from "next/server"
import { validateEmailRequest } from "../_lib"
import { sendMagicLinkEmail } from "@/app/_lib/email"

export async function POST(request: Request) {
    const result = await validateEmailRequest(request)
    if ("error" in result) return result.error

    const { to, firstName, url } = result.data
    if (!to || !firstName || !url) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
        await sendMagicLinkEmail({ to, firstName, url })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("[email/magic-link] Failed:", error)
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
}
