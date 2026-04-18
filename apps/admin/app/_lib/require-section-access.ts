import { redirect } from "next/navigation"
import {
    canEditAllAdoptions,
    canEditContent,
    canEditFosters,
    canEditMyAdoptions,
    canEditUsers,
    canViewAllAdoptions,
    canViewFosters,
    canViewMyAdoptions,
    getPermissionContext,
    getSessionOrRedirect,
    hasPermission,
    type PermissionContext,
} from "@/app/lib/auth-utils"
import type { PermissionName } from "@repo/database"

export async function requirePermission(requirement: PermissionName | PermissionName[]) {
    const session = await getSessionOrRedirect()
    const ctx = await getPermissionContext(session.user.id)
    if (!hasPermission(ctx, requirement)) {
        redirect("/")
    }
    return { session, ctx }
}

export async function requireAdoptionsAccess() {
    const session = await getSessionOrRedirect()
    const ctx = await getPermissionContext(session.user.id)
    if (!canViewMyAdoptions(ctx)) {
        redirect("/")
    }
    return { session, ctx }
}

export async function requireFostersAccess() {
    const session = await getSessionOrRedirect()
    const ctx = await getPermissionContext(session.user.id)
    if (!canViewFosters(ctx)) {
        redirect("/")
    }
    return { session, ctx }
}

export {
    canEditAllAdoptions,
    canEditContent,
    canEditFosters,
    canEditMyAdoptions,
    canEditUsers,
    canViewAllAdoptions,
    canViewFosters,
    canViewMyAdoptions,
    hasPermission,
}

export type { PermissionContext }
