import { Resend } from "resend"
import { render } from "@react-email/render"
import { getUsersByRole } from "@repo/database"
import type { ReactElement } from "react"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_ADDRESS = "GPA-MN <noreply@zoomdoggy.com>"

export async function sendEmail({
    to,
    subject,
    react,
}: {
    to: string | string[]
    subject: string
    react: ReactElement
}) {
    const html = await render(react)
    const recipients = Array.isArray(to) ? to : [to]

    if (resend) {
        const { error } = await resend.emails.send({
            from: FROM_ADDRESS,
            to: recipients,
            subject,
            html,
        })
        if (error) {
            throw new Error(`Failed to send email: ${error.message}`)
        }
    } else {
        console.log(`[email] Would send to ${recipients.join(", ")}: ${subject}`)
    }
}

export async function sendEmailToRole({
    role,
    subject,
    react,
}: {
    role: string
    subject: string
    react: ReactElement
}) {
    const users = await getUsersByRole(role)
    const emails = users.map((u) => u.email).filter(Boolean) as string[]

    if (emails.length === 0) {
        console.log(`[email] No users with role "${role}" to notify`)
        return
    }

    await sendEmail({ to: emails, subject, react })
}
