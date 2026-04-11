import { and, eq, isNull, notInArray, sql } from "drizzle-orm"
import { db } from "../index"
import { user } from "../schema/auth"
import { role, userRole } from "../schema/roles"

export async function getUsers() {
    const rows = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
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
            notifyOnSubmission: user.notifyOnSubmission,
            notifyOnAssignment: user.notifyOnAssignment,
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
        notifyOnSubmission: first.notifyOnSubmission,
        notifyOnAssignment: first.notifyOnAssignment,
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
    preferences: { notifyOnSubmission?: boolean; notifyOnAssignment?: boolean },
) {
    await db.update(user).set(preferences).where(eq(user.id, id))
}

const EXCLUDED_SUBMISSION_ROLES = ["Adoption Rep", "Foster Coordinator", "Foster"]

export async function getUsersForSubmissionNotification() {
    const rows = await db
        .selectDistinct({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        .from(user)
        .innerJoin(userRole, eq(user.id, userRole.userId))
        .innerJoin(role, eq(userRole.roleId, role.id))
        .where(
            and(
                eq(user.notifyOnSubmission, true),
                isNull(user.deactivatedAt),
                notInArray(role.name, EXCLUDED_SUBMISSION_ROLES),
            ),
        )
    return rows
}
