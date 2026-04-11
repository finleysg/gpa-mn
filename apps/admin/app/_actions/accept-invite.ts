"use server"

import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import {
    getInvitationByToken,
    acceptInvitation,
    setUserRoles,
    updateUserAdminLogin,
} from "@repo/database"

export type AcceptInviteState = {
    error?: string
}

export async function acceptInviteAction(
    _prev: AcceptInviteState,
    formData: FormData,
): Promise<AcceptInviteState> {
    const token = formData.get("token") as string
    const name = (formData.get("name") as string)?.trim()
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!token || !name || !password) {
        return { error: "All fields are required." }
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match." }
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." }
    }

    const invite = await getInvitationByToken(token)

    if (!invite || invite.status !== "pending") {
        return { error: "This invitation is no longer valid." }
    }

    if (new Date(invite.expiresAt) < new Date()) {
        return { error: "This invitation has expired." }
    }

    const result = await auth.api.signUpEmail({
        body: { name, email: invite.email, password },
    })

    if (!result?.user) {
        return { error: "Failed to create account. Please try again." }
    }

    await acceptInvitation(invite.id)
    await setUserRoles(
        result.user.id,
        invite.roles.map((r) => r.id),
    )
    await updateUserAdminLogin(result.user.id, true)

    redirect("/login")
}
