import { NextResponse } from "next/server"
import { validateEmailRequest } from "../_lib"
import { sendAdminNewSubmissionEmail } from "@/app/_lib/email"

export async function POST(request: Request) {
    const result = await validateEmailRequest(request)
    if ("error" in result) return result.error

    const { applicantName, applicationId, adminUrl } = result.data
    if (!applicantName || !applicationId || !adminUrl) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
        await sendAdminNewSubmissionEmail({ applicantName, applicationId, adminUrl })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("[email/admin-new-submission] Failed:", error)
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
}
