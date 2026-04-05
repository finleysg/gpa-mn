import { createElement } from "react"
import { sendEmail, sendEmailToRole } from "./client.js"
import { MagicLinkEmail } from "./templates/magic-link.js"
import { SubmissionConfirmationEmail } from "./templates/submission-confirmation.js"
import { AdminNewSubmissionEmail } from "./templates/admin-new-submission.js"
import { AdminStatusChangeEmail } from "./templates/admin-status-change.js"
import { AdminNewCommentEmail } from "./templates/admin-new-comment.js"

export { sendEmail, sendEmailToRole } from "./client.js"
export { MagicLinkEmail } from "./templates/magic-link.js"
export { SubmissionConfirmationEmail } from "./templates/submission-confirmation.js"
export { AdminNewSubmissionEmail } from "./templates/admin-new-submission.js"
export { AdminStatusChangeEmail } from "./templates/admin-status-change.js"
export { AdminNewCommentEmail } from "./templates/admin-new-comment.js"

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
        react: createElement(MagicLinkEmail, { firstName, url }),
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
        react: createElement(SubmissionConfirmationEmail, { firstName, applicationUrl }),
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
    await sendEmailToRole({
        role: "Adoption Coordinator",
        subject: `New adoption application from ${applicantName}`,
        react: createElement(AdminNewSubmissionEmail, { applicantName, applicationId, adminUrl }),
    })
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
    await sendEmail({
        to,
        subject: "Your GPA-MN adoption application status has been updated",
        react: createElement(AdminStatusChangeEmail, { firstName, newStatus, applicationUrl }),
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
        react: createElement(AdminNewCommentEmail, {
            recipientName: "Team",
            commenterName,
            applicationId,
            adminUrl,
        }),
    })
}
