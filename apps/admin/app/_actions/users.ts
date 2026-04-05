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
} from "@repo/database"
import {
    getSessionOrRedirect,
    getUserRolesFromSession,
    canAccessSection,
} from "@/app/lib/auth-utils"
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
    revalidatePath("/users")
    revalidatePath(`/users/${userId}`)
}

export async function reactivateUserAction(userId: string) {
    await requireUserAdmin()
    await reactivateUser(userId)
    revalidatePath("/users")
    revalidatePath(`/users/${userId}`)
}
