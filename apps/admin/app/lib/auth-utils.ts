import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "./auth"
import { getUserPermissions, getUserRoles, hasAdminLogin } from "@repo/database"
import type { PermissionName, RoleName } from "@repo/database"

export const SUPER_ADMIN_ROLE: RoleName = "Super Admin"

export interface PermissionContext {
    userId: string
    isSuperAdmin: boolean
    permissions: PermissionName[]
}

export async function getSessionOrRedirect() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        redirect("/login")
    }

    if ((session.user as Record<string, unknown>).deactivatedAt) {
        await auth.api.signOut({ headers: await headers() })
        redirect("/login")
    }

    const canLogin = await hasAdminLogin(session.user.id)
    if (!canLogin) {
        await auth.api.signOut({ headers: await headers() })
        redirect("/login")
    }

    return session
}

export async function getUserRolesFromSession(userId: string): Promise<RoleName[]> {
    const roles = await getUserRoles(userId)
    return roles.map((r) => r.name as RoleName)
}

export async function getPermissionContext(userId: string): Promise<PermissionContext> {
    const [roles, permissions] = await Promise.all([
        getUserRoles(userId),
        getUserPermissions(userId),
    ])
    const isSuperAdmin = roles.some((r) => r.name === SUPER_ADMIN_ROLE)
    return { userId, isSuperAdmin, permissions }
}

export function hasPermission(
    ctx: PermissionContext,
    requirement: PermissionName | PermissionName[],
): boolean {
    if (ctx.isSuperAdmin) return true
    const required = Array.isArray(requirement) ? requirement : [requirement]
    return required.some((p) => ownedOrImplied(ctx.permissions, p))
}

function ownedOrImplied(owned: PermissionName[], needed: PermissionName): boolean {
    if (owned.includes(needed)) return true
    // Edit implies View; broader (non-"My") implies narrower
    switch (needed) {
        case "Adoption View":
            return (
                owned.includes("Adoption Edit") ||
                owned.includes("My Adoption View") ||
                owned.includes("My Adoption Edit")
            )
        case "My Adoption View":
            return (
                owned.includes("Adoption View") ||
                owned.includes("Adoption Edit") ||
                owned.includes("My Adoption Edit")
            )
        case "Adoption Edit":
            return false
        case "My Adoption Edit":
            return owned.includes("Adoption Edit")
        case "Foster View":
            return owned.includes("Foster Edit")
        case "Foster Edit":
            return false
        default:
            return false
    }
}

export function canViewAllAdoptions(ctx: PermissionContext): boolean {
    return hasPermission(ctx, ["Adoption View", "Adoption Edit"])
}

export function canEditAllAdoptions(ctx: PermissionContext): boolean {
    return hasPermission(ctx, "Adoption Edit")
}

export function canViewMyAdoptions(ctx: PermissionContext): boolean {
    return hasPermission(ctx, [
        "Adoption View",
        "Adoption Edit",
        "My Adoption View",
        "My Adoption Edit",
    ])
}

export function canEditMyAdoptions(ctx: PermissionContext): boolean {
    return hasPermission(ctx, ["Adoption Edit", "My Adoption Edit"])
}

export function canViewFosters(ctx: PermissionContext): boolean {
    return hasPermission(ctx, ["Foster View", "Foster Edit"])
}

export function canEditFosters(ctx: PermissionContext): boolean {
    return hasPermission(ctx, "Foster Edit")
}

export function canEditContent(ctx: PermissionContext): boolean {
    return hasPermission(ctx, "Content Edit")
}

export function canEditUsers(ctx: PermissionContext): boolean {
    return hasPermission(ctx, "User Edit")
}
