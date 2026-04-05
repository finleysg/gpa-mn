import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "localhost",
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
})

export async function sendInviteEmail({
    to,
    inviterName,
    token,
}: {
    to: string
    inviterName: string
    token: string
}) {
    const siteUrl =
        process.env.ADMIN_BASE_URL ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        "http://admin.localhost:1355"
    const acceptUrl = `${siteUrl}/accept-invite?token=${token}`

    await transporter.sendMail({
        from: '"GPA-MN Admin" <noreply@gpa-mn.org>',
        to,
        subject: "You've been invited to GPA-MN Admin",
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>You've been invited to GPA-MN Admin</h2>
                <p>${inviterName} has invited you to join the GPA-MN admin panel.</p>
                <p>
                    <a href="${acceptUrl}" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        Create your account
                    </a>
                </p>
                <p style="color: #71717a; font-size: 14px;">This invitation expires in 7 days.</p>
            </div>
        `,
    })
}
