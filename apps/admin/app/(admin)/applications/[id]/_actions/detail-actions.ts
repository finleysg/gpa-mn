"use server"

import {
    updateApplicationStatus,
    updateApplicationEnrichment,
    upsertMilestone,
    deleteMilestone,
    addComment,
} from "@repo/database"
import type { ApplicationStatus, Milestone, SectionCategory } from "@repo/database"
import { revalidatePath } from "next/cache"
import { getSessionOrRedirect } from "@/app/lib/auth-utils"

export async function changeStatusAction(applicationId: number, status: ApplicationStatus) {
    const session = await getSessionOrRedirect()
    await updateApplicationStatus(applicationId, status, session.user.id)
    revalidatePath(`/applications/${applicationId}`)
    return { success: true as const }
}

export async function updateAdoptionRepAction(applicationId: number, repUserId: string | null) {
    await getSessionOrRedirect()
    await updateApplicationEnrichment(applicationId, { adoptionRep: repUserId })
    revalidatePath(`/applications/${applicationId}`)
    return { success: true as const }
}

export async function updateHoundAction(
    applicationId: number,
    houndId: string | null,
    houndName: string | null,
) {
    await getSessionOrRedirect()
    await updateApplicationEnrichment(applicationId, { houndId, houndName })
    revalidatePath(`/applications/${applicationId}`)
    return { success: true as const }
}

export async function setMilestoneAction(
    applicationId: number,
    milestone: Milestone,
    completedAt: string,
) {
    const session = await getSessionOrRedirect()
    await upsertMilestone({
        applicationId,
        milestone,
        completedAt: new Date(completedAt),
        userId: session.user.id,
    })
    revalidatePath(`/applications/${applicationId}`)
    return { success: true as const }
}

export async function clearMilestoneAction(applicationId: number, milestone: Milestone) {
    await getSessionOrRedirect()
    await deleteMilestone(applicationId, milestone)
    revalidatePath(`/applications/${applicationId}`)
    return { success: true as const }
}

export async function addCommentAction(
    applicationId: number,
    body: string,
    sectionCategory?: SectionCategory,
) {
    const session = await getSessionOrRedirect()
    if (!body.trim()) {
        return { errors: ["Comment body is required"] }
    }
    await addComment({
        applicationId,
        userId: session.user.id,
        body: body.trim(),
        sectionCategory,
    })
    revalidatePath(`/applications/${applicationId}`)
    return { success: true as const }
}
