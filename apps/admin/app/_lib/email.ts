import { Resend } from "resend"
import nodemailer from "nodemailer"
import { getUsersByRole, getUsersForSubmissionNotification } from "@repo/database"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const transporter = resend
    ? null
    : nodemailer.createTransport({
          host: process.env.SMTP_HOST ?? "localhost",
          port: Number(process.env.SMTP_PORT ?? 1025),
          secure: false,
      })

const FROM_ADDRESS = "GPA-MN <noreply@zoomdoggy.com>"

// --- Helpers ---

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

function buttonHtml(text: string, href: string): string {
    return `<p style="text-align:center;margin:24px 0">
        <a href="${href}" style="display:inline-block;padding:12px 24px;background-color:#18181b;color:#ffffff;text-decoration:none;border-radius:6px;font-size:16px">
            ${escapeHtml(text)}
        </a>
    </p>`
}

function emailLayout(content: string): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:20px 0">
    <div style="background-color:#ffffff;margin:0 auto;padding:40px 20px;max-width:600px;border-radius:8px">
        ${content}
    </div>
</body>
</html>`
}

// --- Core send functions ---

async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string | string[]
    subject: string
    html: string
}) {
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
    } else if (transporter) {
        await transporter.sendMail({
            from: FROM_ADDRESS,
            to: recipients,
            subject,
            html,
        })
    } else {
        console.log(`[email] Would send to ${recipients.join(", ")}: ${subject}`)
    }
}

async function sendEmailToRole({
    role,
    subject,
    html,
}: {
    role: string
    subject: string
    html: string
}) {
    const users = await getUsersByRole(role)
    const emails = users.map((u) => u.email).filter(Boolean) as string[]

    if (emails.length === 0) {
        console.warn(`[email] No users with role "${role}" to notify`)
        return
    }

    await sendEmail({ to: emails, subject, html })
}

// --- Admin auth emails ---

export async function sendPasswordResetEmail({ to, url }: { to: string; url: string }) {
    await sendEmail({
        to,
        subject: "Reset your password",
        html: emailLayout(`
            <h2 style="font-size:24px;font-weight:bold;color:#18181b;margin-bottom:16px">Reset your password</h2>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">We received a request to reset your GPA&#8209;MN Admin password.</p>
            ${buttonHtml("Reset password", url)}
            <p style="font-size:14px;color:#71717a">If you didn't request this, you can safely ignore this email.</p>
        `),
    })
}

export async function sendChangeEmailVerification({ to, url }: { to: string; url: string }) {
    await sendEmail({
        to,
        subject: "Verify your new email address",
        html: emailLayout(`
            <h2 style="font-size:24px;font-weight:bold;color:#18181b;margin-bottom:16px">Verify your new email</h2>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">Click the button below to confirm this email address for your GPA&#8209;MN Admin account.</p>
            ${buttonHtml("Verify email", url)}
            <p style="font-size:14px;color:#71717a">If you didn't request this change, you can safely ignore this email.</p>
        `),
    })
}

export async function sendInviteEmail({
    to,
    inviterName,
    token,
}: {
    to: string
    inviterName: string
    token: string
}) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const acceptUrl = `${siteUrl}/accept-invite?token=${token}`

    await sendEmail({
        to,
        subject: "You've been invited to GPA-MN Admin",
        html: emailLayout(`
            <h2 style="font-size:24px;font-weight:bold;color:#18181b;margin-bottom:16px">You've been invited to GPA-MN Admin</h2>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">${escapeHtml(inviterName)} has invited you to join the GPA-MN admin panel.</p>
            ${buttonHtml("Create your account", acceptUrl)}
            <p style="font-size:14px;color:#71717a">This invitation expires in 7 days.</p>
        `),
    })
}

// --- Application emails ---

export async function sendMagicLinkEmail({
    to,
    firstName,
    url,
}: {
    to: string
    firstName: string
    url: string
}) {
    await sendEmail({
        to,
        subject: "Your GPA-MN adoption application link",
        html: emailLayout(`
            <h2 style="font-size:24px;font-weight:bold;color:#18181b;margin-bottom:16px">Your Adoption Application</h2>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">Hi ${escapeHtml(firstName)},</p>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">Use the button below to access your GPA-MN greyhound adoption application. You can save your progress and return at any time using this link.</p>
            ${buttonHtml("Open Application", url)}
            <hr style="border-color:#e4e4e7;margin:24px 0">
            <p style="font-size:14px;color:#71717a">This link is unique to your application. Please do not share it with others.</p>
        `),
    })
}

export async function sendSubmissionConfirmationEmail({
    to,
    firstName,
    applicationUrl,
}: {
    to: string
    firstName: string
    applicationUrl: string
}) {
    await sendEmail({
        to,
        subject: "Your GPA-MN adoption application has been received",
        html: emailLayout(`
            <h2 style="font-size:24px;font-weight:bold;color:#18181b;margin-bottom:16px">Application Received</h2>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">Hi ${escapeHtml(firstName)},</p>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">Thank you for submitting your adoption application to GPA-MN! We have received your application and it is now under review.</p>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">Here's what to expect next:</p>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">
                &bull; An adoption coordinator will review your application<br>
                &bull; You may be contacted for a phone interview<br>
                &bull; A home visit may be scheduled<br>
                &bull; We will notify you of any status updates by email
            </p>
            ${buttonHtml("View Your Application", applicationUrl)}
            <hr style="border-color:#e4e4e7;margin:24px 0">
            <p style="font-size:14px;color:#71717a">If you have questions, please contact us at adopt@gpa-mn.org.</p>
        `),
    })
}

export async function sendAdminNewSubmissionEmail({
    applicantName,
    applicationId,
    adminUrl,
}: {
    applicantName: string
    applicationId: number
    adminUrl: string
}) {
    const users = await getUsersForSubmissionNotification()
    const emails = users.map((u) => u.email).filter(Boolean) as string[]

    if (emails.length === 0) {
        console.warn("[email] No users opted in to submission notifications")
        return
    }

    await sendEmail({
        to: emails,
        subject: `New adoption application from ${applicantName}`,
        html: emailLayout(`
            <h2 style="font-size:24px;font-weight:bold;color:#18181b;margin-bottom:16px">New Adoption Application</h2>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">A new adoption application has been submitted and is ready for review.</p>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">
                <strong>Applicant:</strong> ${escapeHtml(applicantName)}<br>
                <strong>Application ID:</strong> ${applicationId}
            </p>
            ${buttonHtml("Review Application", adminUrl)}
            <hr style="border-color:#e4e4e7;margin:24px 0">
            <p style="font-size:14px;color:#71717a">You received this email because you have submission notifications enabled in your account settings.</p>
        `),
    })
}

const STATUS_DESCRIPTIONS: Record<string, string> = {
    in_review: "Your application is now being reviewed by our adoption team.",
    approved:
        "Congratulations! Your application has been approved. We will be in touch about next steps.",
    adopted: "Congratulations on your new greyhound! Welcome to the GPA-MN family.",
    denied: "After careful review, we are unable to approve your application at this time. Please contact us if you have questions.",
    on_hold: "Your application has been placed on hold. We will contact you with more information.",
}

export async function sendStatusChangeEmail({
    to,
    firstName,
    newStatus,
    applicationUrl,
}: {
    to: string
    firstName: string
    newStatus: string
    applicationUrl: string
}) {
    const description =
        STATUS_DESCRIPTIONS[newStatus] ??
        `Your application status has been updated to: ${newStatus}.`

    await sendEmail({
        to,
        subject: "Your GPA-MN adoption application status has been updated",
        html: emailLayout(`
            <h2 style="font-size:24px;font-weight:bold;color:#18181b;margin-bottom:16px">Application Status Update</h2>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">Hi ${escapeHtml(firstName)},</p>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">${escapeHtml(description)}</p>
            ${buttonHtml("View Your Application", applicationUrl)}
            <hr style="border-color:#e4e4e7;margin:24px 0">
            <p style="font-size:14px;color:#71717a">If you have questions, please contact us at adopt@gpa-mn.org.</p>
        `),
    })
}

export async function sendAdminAssignmentEmail({
    to,
    repName,
    applicantName,
    applicationId,
    adminUrl,
}: {
    to: string
    repName: string
    applicantName: string
    applicationId: number
    adminUrl: string
}) {
    await sendEmail({
        to,
        subject: `You've been assigned to adoption application #${applicationId}`,
        html: emailLayout(`
            <h2 style="font-size:24px;font-weight:bold;color:#18181b;margin-bottom:16px">Application Assignment</h2>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">Hi ${escapeHtml(repName)},</p>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">You have been assigned as the adoption rep for the following application:</p>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">
                <strong>Applicant:</strong> ${escapeHtml(applicantName)}<br>
                <strong>Application ID:</strong> ${applicationId}
            </p>
            ${buttonHtml("View Application", adminUrl)}
            <hr style="border-color:#e4e4e7;margin:24px 0">
            <p style="font-size:14px;color:#71717a">You received this email because you have assignment notifications enabled in your account settings.</p>
        `),
    })
}

export async function sendAdminNewCommentEmail({
    commenterName,
    applicationId,
    adminUrl,
}: {
    commenterName: string
    applicationId: number
    adminUrl: string
}) {
    await sendEmailToRole({
        role: "Adoption Coordinator",
        subject: `New comment on adoption application #${applicationId}`,
        html: emailLayout(`
            <h2 style="font-size:24px;font-weight:bold;color:#18181b;margin-bottom:16px">New Comment</h2>
            <p style="font-size:16px;line-height:26px;color:#3f3f46">${escapeHtml(commenterName)} added a comment on adoption application #${applicationId}.</p>
            ${buttonHtml("View Application", adminUrl)}
            <hr style="border-color:#e4e4e7;margin:24px 0">
            <p style="font-size:14px;color:#71717a">You received this email because you are an adoption coordinator at GPA-MN.</p>
        `),
    })
}
