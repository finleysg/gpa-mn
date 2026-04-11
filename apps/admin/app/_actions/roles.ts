"use server"

import { revalidatePath } from "next/cache"
import { updateRoleWebsiteVisible } from "@repo/database"
import {
    getSessionOrRedirect,
    getUserRolesFromSession,
    canAccessSection,
} from "@/app/lib/auth-utils"
import { revalidateWeb } from "@/app/_lib/revalidate-web"

async function requireUserAdmin() {
    const session = await getSessionOrRedirect()
    const roles = await getUserRolesFromSession(session.user.id)
    if (!canAccessSection(roles, "users")) {
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
