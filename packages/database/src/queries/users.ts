import { and, eq, inArray, isNull, isNotNull, sql } from "drizzle-orm"
import { db } from "../index"
import { account, user } from "../schema/auth"
import { permission, role, rolePermission, userRole } from "../schema/roles"

export async function getUsers() {
    const rows = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            adminLogin: user.adminLogin,
            deactivatedAt: user.deactivatedAt,
            createdAt: user.createdAt,
            roleName: role.name,
            roleId: role.id,
        })
        .from(user)
        .leftJoin(userRole, eq(user.id, userRole.userId))
        .leftJoin(role, eq(userRole.roleId, role.id))

    const usersMap = new Map<
        string,
        {
            id: string
            name: string
            email: string
            phone: string | null
            adminLogin: boolean
            deactivatedAt: Date | null
            createdAt: Date
            roles: { id: string; name: string }[]
        }
    >()

    for (const row of rows) {
        if (!usersMap.has(row.id)) {
            usersMap.set(row.id, {
                id: row.id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                adminLogin: row.adminLogin,
                deactivatedAt: row.deactivatedAt,
                createdAt: row.createdAt,
                roles: [],
            })
        }
        if (row.roleId && row.roleName) {
            usersMap.get(row.id)!.roles.push({ id: row.roleId, name: row.roleName })
        }
    }

    return Array.from(usersMap.values())
}

export async function getUser(id: string) {
    const rows = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            adminLogin: user.adminLogin,
            notifyOnSubmission: user.notifyOnSubmission,
            notifyOnAssignment: user.notifyOnAssignment,
            notifyOnFosterSubmission: user.notifyOnFosterSubmission,
            deactivatedAt: user.deactivatedAt,
            createdAt: user.createdAt,
            roleName: role.name,
            roleId: role.id,
        })
        .from(user)
        .leftJoin(userRole, eq(user.id, userRole.userId))
        .leftJoin(role, eq(userRole.roleId, role.id))
        .where(eq(user.id, id))

    if (rows.length === 0) return null

    const first = rows[0]!
    return {
        id: first.id,
        name: first.name,
        email: first.email,
        phone: first.phone,
        adminLogin: first.adminLogin,
        notifyOnSubmission: first.notifyOnSubmission,
        notifyOnAssignment: first.notifyOnAssignment,
        notifyOnFosterSubmission: first.notifyOnFosterSubmission,
        deactivatedAt: first.deactivatedAt,
        createdAt: first.createdAt,
        roles: rows
            .filter((r) => r.roleId && r.roleName)
            .map((r) => ({ id: r.roleId!, name: r.roleName! })),
    }
}

export async function getUserByEmail(email: string) {
    const [result] = await db.select().from(user).where(eq(user.email, email))
    return result ?? null
}

export async function deactivateUser(id: string) {
    await db
        .update(user)
        .set({ deactivatedAt: sql`now()` })
        .where(eq(user.id, id))
}

export async function reactivateUser(id: string) {
    await db.update(user).set({ deactivatedAt: null }).where(eq(user.id, id))
}

export async function updateUserPhone(id: string, phone: string | null) {
    await db.update(user).set({ phone }).where(eq(user.id, id))
}

export async function updateUserNotificationPreferences(
    id: string,
    preferences: {
        notifyOnSubmission?: boolean
        notifyOnAssignment?: boolean
        notifyOnFosterSubmission?: boolean
    },
) {
    await db.update(user).set(preferences).where(eq(user.id, id))
}

const ADOPTION_SUBMISSION_PERMISSIONS = ["Adoption View", "Adoption Edit"]

const FOSTER_SUBMISSION_PERMISSIONS = ["Foster View", "Foster Edit"]

async function getUsersForPermissionNotification(
    permissionNames: string[],
    notifyColumn: "notifyOnSubmission" | "notifyOnFosterSubmission",
) {
    const rows = await db
        .selectDistinct({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        .from(user)
        .innerJoin(userRole, eq(user.id, userRole.userId))
        .innerJoin(rolePermission, eq(userRole.roleId, rolePermission.roleId))
        .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
        .where(
            and(
                eq(user[notifyColumn], true),
                isNull(user.deactivatedAt),
                eq(user.adminLogin, true),
                inArray(permission.name, permissionNames),
            ),
        )
    return rows
}

export async function getUsersForSubmissionNotification() {
    return getUsersForPermissionNotification(ADOPTION_SUBMISSION_PERMISSIONS, "notifyOnSubmission")
}

export async function getUsersForFosterSubmissionNotification() {
    return getUsersForPermissionNotification(
        FOSTER_SUBMISSION_PERMISSIONS,
        "notifyOnFosterSubmission",
    )
}

export async function getUserIdsWithRolePermissions(): Promise<string[]> {
    const rows = await db
        .selectDistinct({ userId: userRole.userId })
        .from(userRole)
        .innerJoin(rolePermission, eq(rolePermission.roleId, userRole.roleId))
    return rows.map((r) => r.userId)
}

export async function userHasRolePermissions(userId: string): Promise<boolean> {
    const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userRole)
        .innerJoin(rolePermission, eq(rolePermission.roleId, userRole.roleId))
        .where(eq(userRole.userId, userId))
    return (result?.count ?? 0) > 0
}

export async function hasAdminLogin(id: string): Promise<boolean> {
    const [result] = await db
        .select({ adminLogin: user.adminLogin })
        .from(user)
        .where(eq(user.id, id))
    return result?.adminLogin ?? false
}

export async function updateUserAdminLogin(id: string, adminLogin: boolean) {
    await db.update(user).set({ adminLogin }).where(eq(user.id, id))
}

export async function userHasPassword(userId: string): Promise<boolean> {
    const [result] = await db
        .select({ password: account.password })
        .from(account)
        .where(
            and(
                eq(account.userId, userId),
                eq(account.providerId, "credential"),
                isNotNull(account.password),
            ),
        )
    return result != null
}
