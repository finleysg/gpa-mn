"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
    setUserRoles,
    countSuperAdmins,
    deactivateUser,
    reactivateUser,
    getUserByEmail,
    getUser,
    getRoles,
    updateUserAdminLogin,
    updateUserPhone,
    userHasPassword,
} from "@repo/database"
import { getPermissionContext, getSessionOrRedirect, hasPermission } from "@/app/lib/auth-utils"
import { auth } from "@/app/lib/auth"
import { revalidateWeb } from "@/app/_lib/revalidate-web"

async function requireUserAdmin() {
    const session = await getSessionOrRedirect()
    const ctx = await getPermissionContext(session.user.id)
    if (!hasPermission(ctx, "User Edit")) {
        throw new Error("Unauthorized")
    }
    return session
}

export type UpdateRolesState = {
    error?: string
}

export async function updateUserRolesAction(
    userId: string,
    _prev: UpdateRolesState,
    formData: FormData,
): Promise<UpdateRolesState> {
    const session = await requireUserAdmin()
    const roleIds = formData.getAll("roleIds") as string[]

    if (roleIds.length === 0) {
        return { error: "At least one role is required." }
    }

    // Check if we're removing Super Admin from this user
    const targetUser = await getUser(userId)
    if (!targetUser) {
        return { error: "User not found." }
    }

    const allRoles = await getRoles()
    const superAdminRole = allRoles.find((r) => r.name === "Super Admin")

    if (superAdminRole) {
        const hadSuperAdmin = targetUser.roles.some((r) => r.name === "Super Admin")
        const willHaveSuperAdmin = roleIds.includes(superAdminRole.id)

        if (hadSuperAdmin && !willHaveSuperAdmin) {
            const count = await countSuperAdmins()
            if (count <= 1) {
                return { error: "Cannot remove the last Super Admin." }
            }
        }
    }

    await setUserRoles(userId, roleIds, session.user.id)
    revalidatePath(`/users/${userId}`)
    revalidatePath("/users")
    await revalidateWeb(["/about"])
    redirect("/users")
}

export async function deactivateUserAction(userId: string) {
    await requireUserAdmin()

    const targetUser = await getUser(userId)
    if (!targetUser) throw new Error("User not found")

    if (targetUser.roles.some((r) => r.name === "Super Admin")) {
        const count = await countSuperAdmins()
        if (count <= 1) {
            throw new Error("Cannot deactivate the last Super Admin.")
        }
    }

    await deactivateUser(userId)
    await updateUserAdminLogin(userId, false)
    revalidatePath("/users")
    revalidatePath("/users/deactivated")
    revalidatePath(`/users/${userId}`)
    await revalidateWeb(["/about"])
}

export async function reactivateUserAction(userId: string) {
    await requireUserAdmin()
    await reactivateUser(userId)
    revalidatePath("/users")
    revalidatePath("/users/deactivated")
    revalidatePath(`/users/${userId}`)
    await revalidateWeb(["/about"])
}

// --- Create User ---

export type CreateUserState = {
    error?: string
    existingUserId?: string
    success?: boolean
}

export async function createUserAction(
    _prev: CreateUserState,
    formData: FormData,
): Promise<CreateUserState> {
    const session = await requireUserAdmin()

    const name = (formData.get("name") as string)?.trim()
    const email = (formData.get("email") as string)?.trim().toLowerCase()
    const phone = (formData.get("phone") as string)?.trim() || null
    const roleIds = formData.getAll("roleIds") as string[]
    const tempPassword = (formData.get("tempPassword") as string) || ""

    if (!name || !email) {
        return { error: "Name and email are required." }
    }

    // If a temp password is provided, the user will be able to log in.
    // If blank, the user is a data-only record with no usable login (admin
    // can enable login later from the user detail page).
    const enableAdminLogin = tempPassword.length > 0
    if (enableAdminLogin && tempPassword.length < 8) {
        return { error: "Temporary password must be at least 8 characters." }
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return {
            error: "A user with this email already exists.",
            existingUserId: existingUser.id,
        }
    }

    const password = enableAdminLogin ? tempPassword : crypto.randomUUID() + crypto.randomUUID()

    const result = await auth.api.signUpEmail({
        body: { name, email, password },
    })

    if (!result?.user) {
        return { error: "Failed to create user. Please try again." }
    }

    const userId = result.user.id

    if (phone) {
        await updateUserPhone(userId, phone)
    }
    if (enableAdminLogin) {
        await updateUserAdminLogin(userId, true)
    }
    if (roleIds.length > 0) {
        await setUserRoles(userId, roleIds, session.user.id)
    }

    revalidatePath("/users")
    redirect("/users")
}

// --- Update Admin Login ---

export type UpdateAdminLoginState = {
    error?: string
    success?: boolean
    message?: string
}

export async function updateAdminLoginAction(
    userId: string,
    _prev: UpdateAdminLoginState,
    formData: FormData,
): Promise<UpdateAdminLoginState> {
    await requireUserAdmin()

    const adminLogin = formData.get("adminLogin") === "true"

    const targetUser = await getUser(userId)
    if (!targetUser) {
        return { error: "User not found." }
    }

    await updateUserAdminLogin(userId, adminLogin)

    // If toggling ON, check if user has a password. If not, send setup email.
    if (adminLogin && !targetUser.adminLogin) {
        const hasPassword = await userHasPassword(userId)
        if (!hasPassword) {
            await auth.api.requestPasswordReset({
                body: { email: targetUser.email, redirectTo: "/reset-password" },
            })
            revalidatePath(`/users/${userId}`)
            revalidatePath("/users")
            return {
                success: true,
                message: "Admin login enabled. A password setup email has been sent.",
            }
        }
    }

    revalidatePath(`/users/${userId}`)
    revalidatePath("/users")
    return { success: true, message: "Admin login updated." }
}

// --- Send Password Setup / Reset Email ---

export type SendPasswordEmailState = {
    error?: string
    success?: boolean
    message?: string
}

export async function sendPasswordEmailAction(
    userId: string,
    _prev: SendPasswordEmailState,
    _formData: FormData,
): Promise<SendPasswordEmailState> {
    await requireUserAdmin()

    const targetUser = await getUser(userId)
    if (!targetUser) {
        return { error: "User not found." }
    }

    if (targetUser.deactivatedAt) {
        return { error: "Cannot send email to a deactivated user." }
    }

    const hasPassword = await userHasPassword(userId)

    await auth.api.requestPasswordReset({
        body: { email: targetUser.email, redirectTo: "/reset-password" },
    })

    return {
        success: true,
        message: hasPassword ? "Password reset email sent." : "Password setup email sent.",
    }
}
