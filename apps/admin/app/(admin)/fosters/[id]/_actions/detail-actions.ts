"use server"

import {
    updateFosterApplicationStatus,
    upsertFosterMilestone,
    deleteFosterMilestone,
    addFosterComment,
} from "@repo/database"
import type {
    FosterApplicationStatus,
    FosterMilestone,
    FosterSectionCategory,
} from "@repo/database"
import { revalidatePath } from "next/cache"
import { requireSectionAccess } from "@/app/_lib/require-section-access"

type ActionResult = { success: true } | { errors: string[] }

export async function changeStatusAction(
    fosterApplicationId: number,
    status: FosterApplicationStatus,
): Promise<ActionResult> {
    const { session } = await requireSectionAccess("fosters")
    try {
        await updateFosterApplicationStatus(fosterApplicationId, status, session.user.id)
        revalidatePath(`/fosters/${fosterApplicationId}`)
        return { success: true }
    } catch {
        return { errors: ["Failed to update status"] }
    }
}

export async function setMilestoneAction(
    fosterApplicationId: number,
    milestone: FosterMilestone,
    completedAt: string,
): Promise<ActionResult> {
    const { session } = await requireSectionAccess("fosters")
    try {
        await upsertFosterMilestone({
            fosterApplicationId,
            milestone,
            completedAt: new Date(completedAt),
            userId: session.user.id,
        })
        revalidatePath(`/fosters/${fosterApplicationId}`)
        return { success: true }
    } catch {
        return { errors: ["Failed to set milestone"] }
    }
}

export async function clearMilestoneAction(
    fosterApplicationId: number,
    milestone: FosterMilestone,
): Promise<ActionResult> {
    await requireSectionAccess("fosters")
    try {
        await deleteFosterMilestone(fosterApplicationId, milestone)
        revalidatePath(`/fosters/${fosterApplicationId}`)
        return { success: true }
    } catch {
        return { errors: ["Failed to clear milestone"] }
    }
}

export async function addCommentAction(
    fosterApplicationId: number,
    body: string,
    sectionCategory?: FosterSectionCategory,
): Promise<ActionResult> {
    const { session } = await requireSectionAccess("fosters")
    if (!body.trim()) {
        return { errors: ["Comment body is required"] }
    }
    try {
        await addFosterComment({
            fosterApplicationId,
            userId: session.user.id,
            body: body.trim(),
            sectionCategory,
        })
        revalidatePath(`/fosters/${fosterApplicationId}`)
        return { success: true }
    } catch {
        return { errors: ["Failed to add comment"] }
    }
}
