"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
    createInvitation,
    getInvitations,
    revokeInvitation,
    updateInvitationToken,
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
import {
    getSessionOrRedirect,
    getUserRolesFromSession,
    canAccessSection,
} from "@/app/lib/auth-utils"
import { auth } from "@/app/lib/auth"
import { sendInviteEmail } from "@/app/_lib/email"

async function requireUserAdmin() {
    const session = await getSessionOrRedirect()
    const roles = await getUserRolesFromSession(session.user.id)
    if (!canAccessSection(roles, "users")) {
        throw new Error("Unauthorized")
    }
    return session
}

export type InviteUserState = {
    error?: string
    success?: boolean
}

export async function inviteUserAction(
    _prev: InviteUserState,
    formData: FormData,
): Promise<InviteUserState> {
    const session = await requireUserAdmin()

    const email = (formData.get("email") as string)?.trim().toLowerCase()
    const roleIds = formData.getAll("roleIds") as string[]

    if (!email) {
        return { error: "Email is required." }
    }

    if (roleIds.length === 0) {
        return { error: "At least one role is required." }
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return { error: "A user with this email already exists." }
    }

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await createInvitation(email, roleIds, session.user.id, token, expiresAt)
    await sendInviteEmail({ to: email, inviterName: session.user.name, token })

    revalidatePath("/users/invitations")
    redirect("/users/invitations")
}

export async function resendInviteAction(invitationId: string) {
    const session = await requireUserAdmin()

    const invitations = await getInvitations()
    const invite = invitations.find((i) => i.id === invitationId)

    if (!invite || invite.status !== "pending") {
        throw new Error("Invitation not found or already used")
    }

    const newToken = crypto.randomUUID()
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await updateInvitationToken(invitationId, newToken, newExpiresAt)
    await sendInviteEmail({ to: invite.email, inviterName: session.user.name, token: newToken })

    revalidatePath("/users/invitations")
}

export async function revokeInviteAction(invitationId: string) {
    await requireUserAdmin()
    await revokeInvitation(invitationId)
    revalidatePath("/users/invitations")
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
    revalidatePath(`/users/${userId}`)
}

export async function reactivateUserAction(userId: string) {
    await requireUserAdmin()
    await reactivateUser(userId)
    revalidatePath("/users")
    revalidatePath(`/users/${userId}`)
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
    const sendInvitation = formData.get("sendInvitation") === "true"

    if (!name || !email) {
        return { error: "Name and email are required." }
    }

    // Check for duplicate email
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return {
            error: "A user with this email already exists.",
            existingUserId: existingUser.id,
        }
    }

    // Create user + account via Better Auth with an unknowable temporary password
    const tempPassword = crypto.randomUUID() + crypto.randomUUID()

    const result = await auth.api.signUpEmail({
        body: { name, email, password: tempPassword },
    })

    if (!result?.user) {
        return { error: "Failed to create user. Please try again." }
    }

    const userId = result.user.id

    // Update additional fields
    if (phone) {
        await updateUserPhone(userId, phone)
    }
    if (sendInvitation) {
        await updateUserAdminLogin(userId, true)
    }

    // Assign roles
    if (roleIds.length > 0) {
        await setUserRoles(userId, roleIds, session.user.id)
    }

    // If admin login enabled, send "set your password" email
    if (sendInvitation) {
        await auth.api.requestPasswordReset({
            body: { email, redirectTo: "/reset-password" },
        })
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
