import { eq, and, sql } from "drizzle-orm"
import { db } from "../index"
import { role, userRole } from "../schema/roles"

export async function getRoles() {
    return db.select().from(role)
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
