import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "./auth"
import { getUserRoles, hasAdminLogin } from "@repo/database"
import type { RoleName } from "@repo/database"

const SECTION_ACCESS: Record<string, RoleName[]> = {
    users: ["Super Admin", "User Admin"],
    home: ["Super Admin", "Content Admin"],
    adopt: [
        "Super Admin",
        "Content Admin",
        "Adoption Matcher",
        "Adoption Coordinator",
        "Adoption Rep",
        "President",
        "Vice President",
        "Secretary",
        "Treasurer",
        "Board Member",
    ],
    volunteer: ["Super Admin", "Content Admin"],
    donate: ["Super Admin", "Content Admin"],
    events: ["Super Admin", "Content Admin"],
    about: ["Super Admin", "Content Admin"],
    "lost-hound": ["Super Admin", "Content Admin"],
    foster: ["Super Admin", "Foster Coordinator", "Foster"],
    applications: [
        "Super Admin",
        "Adoption Coordinator",
        "Adoption Matcher",
        "Adoption Rep",
        "President",
        "Vice President",
        "Secretary",
        "Treasurer",
        "Board Member",
    ],
}

export async function getSessionOrRedirect() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        redirect("/login")
    }

    // Check if user is deactivated
    if ((session.user as Record<string, unknown>).deactivatedAt) {
        // Invalidate the session and redirect
        await auth.api.signOut({ headers: await headers() })
        redirect("/login")
    }

    // Check if user has admin login access
    const canLogin = await hasAdminLogin(session.user.id)
    if (!canLogin) {
        await auth.api.signOut({ headers: await headers() })
        redirect("/login")
    }

    return session
}

export async function getUserRolesFromSession(userId: string) {
    const roles = await getUserRoles(userId)
    return roles.map((r) => r.name as RoleName)
}

export function canAccessSection(userRoles: RoleName[], section: string): boolean {
    if (userRoles.includes("Super Admin")) return true
    const allowed = SECTION_ACCESS[section]
    if (!allowed) return false
    return userRoles.some((r) => allowed.includes(r))
}
