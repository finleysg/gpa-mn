import { NextResponse } from "next/server"
import { validateEmailRequest } from "../_lib"
import { CONTACT_CATEGORIES, sendContactEmail, type ContactCategory } from "@/app/_lib/email"

export async function POST(request: Request) {
    const result = await validateEmailRequest(request)
    if ("error" in result) return result.error

    const { category, name, email, subject, message } = result.data

    if (!category || !name || !email || !subject || !message) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!(category in CONTACT_CATEGORIES)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    try {
        await sendContactEmail({
            category: category as ContactCategory,
            name,
            email,
            subject,
            message,
        })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("[email/contact] Failed:", error)
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
}
