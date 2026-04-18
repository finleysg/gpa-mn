"use server"

import { revalidatePath } from "next/cache"
import {
    countRoleUsers,
    createRole,
    deleteRole,
    getRole,
    setRolePermissions,
    updateRole,
    updateRoleWebsiteVisible,
} from "@repo/database"
import { getPermissionContext, getSessionOrRedirect, hasPermission } from "@/app/lib/auth-utils"
import { revalidateWeb } from "@/app/_lib/revalidate-web"

async function requireUserAdmin() {
    const session = await getSessionOrRedirect()
    const ctx = await getPermissionContext(session.user.id)
    if (!hasPermission(ctx, "User Edit")) {
        throw new Error("Unauthorized")
    }
    return session
}

export type ToggleWebsiteVisibleState = {
    error?: string
}

export async function toggleWebsiteVisibleAction(
    roleId: string,
    _prev: ToggleWebsiteVisibleState,
    formData: FormData,
): Promise<ToggleWebsiteVisibleState> {
    await requireUserAdmin()

    const websiteVisible = formData.get("websiteVisible") === "true"
    await updateRoleWebsiteVisible(roleId, websiteVisible)

    revalidatePath("/roles")
    await revalidateWeb(["/about"])

    return {}
}

export type CreateRoleState = {
    error?: string
    roleId?: string
}

export async function createRoleAction(
    _prev: CreateRoleState,
    formData: FormData,
): Promise<CreateRoleState> {
    await requireUserAdmin()

    const name = (formData.get("name") as string)?.trim()
    const description = (formData.get("description") as string)?.trim() || null

    if (!name) {
        return { error: "Role name is required." }
    }

    try {
        const roleId = await createRole({ name, description })
        revalidatePath("/roles")
        return { roleId }
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create role"
        if (message.toLowerCase().includes("duplicate")) {
            return { error: `A role named "${name}" already exists.` }
        }
        return { error: message }
    }
}

export type UpdateRoleState = {
    error?: string
    success?: boolean
}

export async function updateRoleAction(
    roleId: string,
    _prev: UpdateRoleState,
    formData: FormData,
): Promise<UpdateRoleState> {
    await requireUserAdmin()

    const target = await getRole(roleId)
    if (!target) return { error: "Role not found." }
    if (target.system) return { error: "System roles cannot be edited." }

    const name = (formData.get("name") as string)?.trim()
    const description = (formData.get("description") as string)?.trim() || null

    if (!name) {
        return { error: "Role name is required." }
    }

    try {
        await updateRole(roleId, { name, description })
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update role"
        if (message.toLowerCase().includes("duplicate")) {
            return { error: `A role named "${name}" already exists.` }
        }
        return { error: message }
    }

    revalidatePath("/roles")
    revalidatePath(`/roles/${roleId}`)
    await revalidateWeb(["/about"])
    return { success: true }
}

export type UpdateRolePermissionsState = {
    error?: string
    success?: boolean
}

export async function updateRolePermissionsAction(
    roleId: string,
    _prev: UpdateRolePermissionsState,
    formData: FormData,
): Promise<UpdateRolePermissionsState> {
    const session = await requireUserAdmin()

    const target = await getRole(roleId)
    if (!target) return { error: "Role not found." }
    if (target.system) return { error: "System roles cannot be modified." }

    const permissionIds = formData.getAll("permissionIds") as string[]
    await setRolePermissions(roleId, permissionIds, session.user.id)

    revalidatePath("/roles")
    revalidatePath(`/roles/${roleId}`)
    revalidatePath("/users")
    return { success: true }
}

export async function deleteRoleAction(roleId: string) {
    await requireUserAdmin()

    const target = await getRole(roleId)
    if (!target) throw new Error("Role not found.")
    if (target.system) throw new Error("System roles cannot be deleted.")

    const users = await countRoleUsers(roleId)
    if (users > 0) {
        throw new Error("Role has assigned users; reassign them before deleting.")
    }

    await deleteRole(roleId)
    revalidatePath("/roles")
}
