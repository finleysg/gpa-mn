import { redirect } from "next/navigation"
import {
    getSessionOrRedirect,
    getUserRolesFromSession,
    canAccessSection,
} from "@/app/lib/auth-utils"

export async function requireSectionAccess(section: string) {
    const session = await getSessionOrRedirect()
    const roles = await getUserRolesFromSession(session.user.id)
    if (!canAccessSection(roles, section)) {
        redirect("/")
    }
    return { session, roles }
}
