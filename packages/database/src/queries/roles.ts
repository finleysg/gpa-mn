import { eq, and, sql, isNull } from "drizzle-orm"
import { db } from "../index"
import { user } from "../schema/auth"
import { role, userRole } from "../schema/roles"

export async function getRoles() {
    return db.select().from(role).orderBy(role.name)
}

export async function getRoleByName(name: string) {
    const [result] = await db.select().from(role).where(eq(role.name, name))
    return result
}

export async function getUserRoles(userId: string) {
    const rows = await db
        .select({ id: role.id, name: role.name })
        .from(userRole)
        .innerJoin(role, eq(userRole.roleId, role.id))
        .where(eq(userRole.userId, userId))
    return rows
}

export async function assignRole(userId: string, roleId: string, assignedBy?: string) {
    await db.insert(userRole).values({
        id: crypto.randomUUID(),
        userId,
        roleId,
        assignedBy: assignedBy ?? null,
    })
}

export async function removeRole(userId: string, roleId: string) {
    await db.delete(userRole).where(and(eq(userRole.userId, userId), eq(userRole.roleId, roleId)))
}

export async function setUserRoles(userId: string, roleIds: string[], assignedBy?: string) {
    await db.transaction(async (tx) => {
        await tx.delete(userRole).where(eq(userRole.userId, userId))
        if (roleIds.length > 0) {
            await tx.insert(userRole).values(
                roleIds.map((roleId) => ({
                    id: crypto.randomUUID(),
                    userId,
                    roleId,
                    assignedBy: assignedBy ?? null,
                })),
            )
        }
    })
}

export async function countSuperAdmins() {
    const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userRole)
        .innerJoin(role, eq(userRole.roleId, role.id))
        .where(eq(role.name, "Super Admin"))
    return result?.count ?? 0
}

export async function hasRole(userId: string, roleName: string) {
    const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userRole)
        .innerJoin(role, eq(userRole.roleId, role.id))
        .where(and(eq(userRole.userId, userId), eq(role.name, roleName)))
    return (result?.count ?? 0) > 0
}

export async function getUsersByRole(roleName: string) {
    return db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        .from(userRole)
        .innerJoin(role, eq(userRole.roleId, role.id))
        .innerJoin(user, eq(userRole.userId, user.id))
        .where(eq(role.name, roleName))
}

export async function updateRoleWebsiteVisible(roleId: string, websiteVisible: boolean) {
    await db.update(role).set({ websiteVisible }).where(eq(role.id, roleId))
}

export async function getWebsiteVisibleRolesWithUsers() {
    const rows = await db
        .select({
            roleId: role.id,
            roleName: role.name,
            userId: user.id,
            userName: user.name,
        })
        .from(role)
        .innerJoin(userRole, eq(role.id, userRole.roleId))
        .innerJoin(user, and(eq(userRole.userId, user.id), isNull(user.deactivatedAt)))
        .where(eq(role.websiteVisible, true))
        .orderBy(role.name, user.name)

    const rolesMap = new Map<
        string,
        { id: string; name: string; users: { id: string; name: string }[] }
    >()

    for (const row of rows) {
        if (!rolesMap.has(row.roleId)) {
            rolesMap.set(row.roleId, {
                id: row.roleId,
                name: row.roleName,
                users: [],
            })
        }
        rolesMap.get(row.roleId)!.users.push({
            id: row.userId,
            name: row.userName,
        })
    }

    return Array.from(rolesMap.values())
}
