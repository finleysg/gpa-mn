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
import { getPermissionContext, getSessionOrRedirect, hasPermission } from "@/app/lib/auth-utils"

type ActionResult = { success: true } | { errors: string[] }

async function requireFosterEditor() {
    const session = await getSessionOrRedirect()
    const ctx = await getPermissionContext(session.user.id)
    if (!hasPermission(ctx, "Foster Edit")) {
        throw new Error("Unauthorized")
    }
    return { session, ctx }
}

export async function changeStatusAction(
    fosterApplicationId: number,
    status: FosterApplicationStatus,
): Promise<ActionResult> {
    const { session } = await requireFosterEditor()
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
    const { session } = await requireFosterEditor()
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
    await requireFosterEditor()
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
    const { session } = await requireFosterEditor()
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
