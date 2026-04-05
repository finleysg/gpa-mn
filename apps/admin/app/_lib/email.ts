import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "localhost",
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
})

export async function sendPasswordResetEmail({ to, url }: { to: string; url: string }) {
    await transporter.sendMail({
        from: '"GPA-MN Admin" <noreply@gpa-mn.org>',
        to,
        subject: "Reset your password",
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Reset your password</h2>
                <p>We received a request to reset your GPA‑MN Admin password.</p>
                <p>
                    <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        Reset password
                    </a>
                </p>
                <p style="color: #71717a; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        `,
    })
}

export async function sendChangeEmailVerification({ to, url }: { to: string; url: string }) {
    await transporter.sendMail({
        from: '"GPA-MN Admin" <noreply@gpa-mn.org>',
        to,
        subject: "Verify your new email address",
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Verify your new email</h2>
                <p>Click the button below to confirm this email address for your GPA‑MN Admin account.</p>
                <p>
                    <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        Verify email
                    </a>
                </p>
                <p style="color: #71717a; font-size: 14px;">If you didn't request this change, you can safely ignore this email.</p>
            </div>
        `,
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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://admin.localhost:1355"
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
