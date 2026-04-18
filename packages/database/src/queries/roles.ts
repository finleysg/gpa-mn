import { eq, and, sql, isNull, inArray } from "drizzle-orm"
import { db } from "../index"
import { user } from "../schema/auth"
import { permission, role, rolePermission, userRole } from "../schema/roles"
import type { PermissionName } from "../schema/roles"

export async function getRoles() {
    return db.select().from(role).orderBy(role.name)
}

export async function getRolesWithUsage() {
    const rows = await db
        .select({
            id: role.id,
            name: role.name,
            description: role.description,
            websiteVisible: role.websiteVisible,
            system: role.system,
            userCount: sql<number>`count(distinct ${userRole.userId})`,
            permissionCount: sql<number>`count(distinct ${rolePermission.permissionId})`,
        })
        .from(role)
        .leftJoin(userRole, eq(userRole.roleId, role.id))
        .leftJoin(rolePermission, eq(rolePermission.roleId, role.id))
        .groupBy(role.id)
        .orderBy(role.name)
    return rows
}

export async function getRole(id: string) {
    const [result] = await db.select().from(role).where(eq(role.id, id))
    return result ?? null
}

export async function createRole(input: {
    name: string
    description?: string | null
    websiteVisible?: boolean
}) {
    const id = crypto.randomUUID()
    await db.insert(role).values({
        id,
        name: input.name,
        description: input.description ?? null,
        websiteVisible: input.websiteVisible ?? false,
    })
    return id
}

export async function updateRole(
    id: string,
    input: { name?: string; description?: string | null },
) {
    await db.update(role).set(input).where(eq(role.id, id))
}

export async function deleteRole(id: string) {
    await db.transaction(async (tx) => {
        await tx.delete(rolePermission).where(eq(rolePermission.roleId, id))
        await tx.delete(role).where(eq(role.id, id))
    })
}

export async function countRoleUsers(roleId: string) {
    const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userRole)
        .where(eq(userRole.roleId, roleId))
    return result?.count ?? 0
}

export async function getPermissions() {
    return db.select().from(permission).orderBy(permission.name)
}

export async function getRolePermissions(roleId: string) {
    const rows = await db
        .select({ id: permission.id, name: permission.name })
        .from(rolePermission)
        .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
        .where(eq(rolePermission.roleId, roleId))
    return rows
}

export async function setRolePermissions(
    roleId: string,
    permissionIds: string[],
    assignedBy?: string,
) {
    await db.transaction(async (tx) => {
        await tx.delete(rolePermission).where(eq(rolePermission.roleId, roleId))
        if (permissionIds.length > 0) {
            await tx.insert(rolePermission).values(
                permissionIds.map((permissionId) => ({
                    id: crypto.randomUUID(),
                    roleId,
                    permissionId,
                    assignedBy: assignedBy ?? null,
                })),
            )
        }
    })
}

export async function getUserPermissions(userId: string): Promise<PermissionName[]> {
    const rows = await db
        .selectDistinct({ name: permission.name })
        .from(userRole)
        .innerJoin(rolePermission, eq(rolePermission.roleId, userRole.roleId))
        .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
        .where(eq(userRole.userId, userId))
    return rows.map((r) => r.name as PermissionName)
}

export async function getRolesWithPermissions(roleIds: string[]) {
    if (roleIds.length === 0) return []
    const rows = await db
        .select({ roleId: role.id, roleName: role.name, permissionCount: rolePermission.id })
        .from(role)
        .leftJoin(rolePermission, eq(rolePermission.roleId, role.id))
        .where(inArray(role.id, roleIds))

    const byRole = new Map<string, { roleId: string; roleName: string; hasPermissions: boolean }>()
    for (const row of rows) {
        const existing = byRole.get(row.roleId)
        if (existing) {
            if (row.permissionCount) existing.hasPermissions = true
        } else {
            byRole.set(row.roleId, {
                roleId: row.roleId,
                roleName: row.roleName,
                hasPermissions: Boolean(row.permissionCount),
            })
        }
    }
    return Array.from(byRole.values())
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
