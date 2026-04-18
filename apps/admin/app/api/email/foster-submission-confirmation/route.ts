import { NextResponse } from "next/server"
import { validateEmailRequest } from "../_lib"
import { sendFosterSubmissionConfirmationEmail } from "@/app/_lib/email"

export async function POST(request: Request) {
    const result = await validateEmailRequest(request)
    if ("error" in result) return result.error

    const { to, firstName, applicationUrl } = result.data
    if (!to || !firstName || !applicationUrl) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
        await sendFosterSubmissionConfirmationEmail({ to, firstName, applicationUrl })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("[email/foster-submission-confirmation] Failed:", error)
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
}
