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
import { requireSectionAccess } from "@/app/_lib/require-section-access"

type ActionResult = { success: true } | { errors: string[] }

export async function changeStatusAction(
    applicationId: number,
    status: ApplicationStatus,
): Promise<ActionResult> {
    const { session } = await requireSectionAccess("applications")
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
    await requireSectionAccess("applications")
    try {
        await updateApplicationEnrichment(applicationId, { adoptionRep: repUserId })
        revalidatePath(`/applications/${applicationId}`)
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
    await requireSectionAccess("applications")
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
    const { session } = await requireSectionAccess("applications")
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
    await requireSectionAccess("applications")
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
    const { session } = await requireSectionAccess("applications")
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
