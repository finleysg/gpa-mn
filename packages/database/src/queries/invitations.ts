import { eq, sql } from "drizzle-orm"
import { db } from "../index"
import { user } from "../schema/auth"
import { invitation, invitationRole, role } from "../schema/roles"

export async function createInvitation(
    email: string,
    roleIds: string[],
    invitedBy: string,
    token: string,
    expiresAt: Date,
) {
    const id = crypto.randomUUID()
    await db.transaction(async (tx) => {
        await tx.insert(invitation).values({ id, email, token, expiresAt, invitedBy })
        if (roleIds.length > 0) {
            await tx.insert(invitationRole).values(
                roleIds.map((roleId) => ({
                    id: crypto.randomUUID(),
                    invitationId: id,
                    roleId,
                })),
            )
        }
    })
    return id
}

export async function getInvitations() {
    const rows = await db
        .select({
            id: invitation.id,
            email: invitation.email,
            status: invitation.status,
            expiresAt: invitation.expiresAt,
            createdAt: invitation.createdAt,
            invitedByName: user.name,
            roleName: role.name,
            roleId: role.id,
        })
        .from(invitation)
        .innerJoin(user, eq(invitation.invitedBy, user.id))
        .leftJoin(invitationRole, eq(invitation.id, invitationRole.invitationId))
        .leftJoin(role, eq(invitationRole.roleId, role.id))

    const map = new Map<
        string,
        {
            id: string
            email: string
            status: string
            expiresAt: Date
            createdAt: Date
            invitedByName: string
            roles: { id: string; name: string }[]
        }
    >()

    for (const row of rows) {
        if (!map.has(row.id)) {
            map.set(row.id, {
                id: row.id,
                email: row.email,
                status: row.status,
                expiresAt: row.expiresAt,
                createdAt: row.createdAt,
                invitedByName: row.invitedByName,
                roles: [],
            })
        }
        if (row.roleId && row.roleName) {
            map.get(row.id)!.roles.push({ id: row.roleId, name: row.roleName })
        }
    }

    return Array.from(map.values())
}

export async function getInvitationByToken(token: string) {
    const rows = await db
        .select({
            id: invitation.id,
            email: invitation.email,
            status: invitation.status,
            expiresAt: invitation.expiresAt,
            roleName: role.name,
            roleId: role.id,
        })
        .from(invitation)
        .leftJoin(invitationRole, eq(invitation.id, invitationRole.invitationId))
        .leftJoin(role, eq(invitationRole.roleId, role.id))
        .where(eq(invitation.token, token))

    if (rows.length === 0) return null

    const first = rows[0]!
    return {
        id: first.id,
        email: first.email,
        status: first.status,
        expiresAt: first.expiresAt,
        roles: rows
            .filter((r) => r.roleId && r.roleName)
            .map((r) => ({ id: r.roleId!, name: r.roleName! })),
    }
}

export async function acceptInvitation(id: string) {
    await db
        .update(invitation)
        .set({ status: "accepted", acceptedAt: sql`now()` })
        .where(eq(invitation.id, id))
}

export async function revokeInvitation(id: string) {
    await db.update(invitation).set({ status: "revoked" }).where(eq(invitation.id, id))
}

export async function updateInvitationToken(id: string, newToken: string, newExpiresAt: Date) {
    await db
        .update(invitation)
        .set({ token: newToken, expiresAt: newExpiresAt })
        .where(eq(invitation.id, id))
}
