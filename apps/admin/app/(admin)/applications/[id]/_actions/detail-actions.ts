"use server"

import {
    updateApplicationStatus,
    updateApplicationEnrichment,
    upsertMilestone,
    deleteMilestone,
    addComment,
    getApplication,
    getUser,
} from "@repo/database"
import type { ApplicationStatus, Milestone, SectionCategory } from "@repo/database"
import { revalidatePath } from "next/cache"
import {
    canEditAllAdoptions,
    canEditMyAdoptions,
    getPermissionContext,
    getSessionOrRedirect,
    hasPermission,
    type PermissionContext,
} from "@/app/lib/auth-utils"
import { sendAdminAssignmentEmail } from "@/app/_lib/email"

type ActionResult = { success: true } | { errors: string[] }

async function requireAdoptionEditor(applicationId: number) {
    const session = await getSessionOrRedirect()
    const ctx = await getPermissionContext(session.user.id)

    if (canEditAllAdoptions(ctx)) {
        return { session, ctx, scope: "all" as const }
    }

    if (canEditMyAdoptions(ctx)) {
        const application = await getApplication(applicationId)
        if (!application) {
            throw new Error("Application not found")
        }
        if (application.adoptionRep !== session.user.id) {
            throw new Error("Unauthorized")
        }
        return { session, ctx, scope: "mine" as const }
    }

    throw new Error("Unauthorized")
}

async function requireFullAdoptionEditor() {
    const session = await getSessionOrRedirect()
    const ctx: PermissionContext = await getPermissionContext(session.user.id)
    if (!hasPermission(ctx, "Adoption Edit")) {
        throw new Error("Unauthorized")
    }
    return { session, ctx }
}

export async function changeStatusAction(
    applicationId: number,
    status: ApplicationStatus,
): Promise<ActionResult> {
    const { session } = await requireAdoptionEditor(applicationId)
    try {
        await updateApplicationStatus(applicationId, status, session.user.id)
        revalidatePath(`/applications/${applicationId}`)
        return { success: true }
    } catch {
        return { errors: ["Failed to update status"] }
    }
}

export async function updateAdoptionRepAction(
    applicationId: number,
    repUserId: string | null,
): Promise<ActionResult> {
    await requireFullAdoptionEditor()
    try {
        await updateApplicationEnrichment(applicationId, { adoptionRep: repUserId })
        revalidatePath(`/applications/${applicationId}`)

        if (repUserId) {
            Promise.all([getUser(repUserId), getApplication(applicationId)])
                .then(([rep, application]) => {
                    if (rep?.notifyOnAssignment && application) {
                        const adminUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:6100"
                        return sendAdminAssignmentEmail({
                            to: rep.email,
                            repName: rep.name,
                            applicantName: `${application.firstName} ${application.lastName}`,
                            applicationId,
                            adminUrl: `${adminUrl}/applications/${applicationId}`,
                        })
                    }
                })
                .catch(() => {
                    // Email failures shouldn't affect the action
                })
        }

        return { success: true }
    } catch {
        return { errors: ["Failed to update adoption rep"] }
    }
}

export async function updateHoundAction(
    applicationId: number,
    houndId: string | null,
    houndName: string | null,
): Promise<ActionResult> {
    await requireAdoptionEditor(applicationId)
    try {
        await updateApplicationEnrichment(applicationId, { houndId, houndName })
        revalidatePath(`/applications/${applicationId}`)
        return { success: true }
    } catch {
        return { errors: ["Failed to update hound"] }
    }
}

export async function setMilestoneAction(
    applicationId: number,
    milestone: Milestone,
    completedAt: string,
): Promise<ActionResult> {
    const { session } = await requireAdoptionEditor(applicationId)
    try {
        await upsertMilestone({
            applicationId,
            milestone,
            completedAt: new Date(completedAt),
            userId: session.user.id,
        })
        revalidatePath(`/applications/${applicationId}`)
        return { success: true }
    } catch {
        return { errors: ["Failed to set milestone"] }
    }
}

export async function clearMilestoneAction(
    applicationId: number,
    milestone: Milestone,
): Promise<ActionResult> {
    await requireAdoptionEditor(applicationId)
    try {
        await deleteMilestone(applicationId, milestone)
        revalidatePath(`/applications/${applicationId}`)
        return { success: true }
    } catch {
        return { errors: ["Failed to clear milestone"] }
    }
}

export async function addCommentAction(
    applicationId: number,
    body: string,
    sectionCategory?: SectionCategory,
): Promise<ActionResult> {
    const { session } = await requireAdoptionEditor(applicationId)
    if (!body.trim()) {
        return { errors: ["Comment body is required"] }
    }
    try {
        await addComment({
            applicationId,
            userId: session.user.id,
            body: body.trim(),
            sectionCategory,
        })
        revalidatePath(`/applications/${applicationId}`)
        return { success: true }
    } catch {
        return { errors: ["Failed to add comment"] }
    }
}
