import { and, asc, desc, eq, inArray, like, max, or, sql } from "drizzle-orm"
import { db } from "../index"
import { user } from "../schema/auth"
import {
    fosterApplications,
    fosterApplicationMilestones,
    fosterApplicationSections,
    fosterApplicationComments,
    fosterApplicationTokens,
    type FosterApplicationStatus,
    type FosterMilestone,
    type FosterSectionCategory,
    type FosterSectionKey,
} from "../schema/foster-applications"

export async function createFosterApplication(data: {
    email: string
    firstName: string
    lastName: string
    phone?: string
}) {
    const [result] = await db.insert(fosterApplications).values(data).$returningId()
    return result!
}

export async function getFosterApplication(id: number) {
    const [result] = await db.select().from(fosterApplications).where(eq(fosterApplications.id, id))
    return result ?? null
}

export async function getFosterApplicationByToken(token: string) {
    const [result] = await db
        .select({ application: fosterApplications, token: fosterApplicationTokens })
        .from(fosterApplicationTokens)
        .innerJoin(
            fosterApplications,
            eq(fosterApplicationTokens.fosterApplicationId, fosterApplications.id),
        )
        .where(eq(fosterApplicationTokens.token, token))
    return result ?? null
}

export async function listFosterApplications(filters?: {
    status?: FosterApplicationStatus
    search?: string
}) {
    let query = db.select({ application: fosterApplications }).from(fosterApplications).$dynamic()

    const conditions = []

    if (filters?.status) {
        conditions.push(eq(fosterApplications.status, filters.status))
    }

    if (filters?.search) {
        const pattern = `%${filters.search}%`
        conditions.push(
            or(
                like(fosterApplications.firstName, pattern),
                like(fosterApplications.lastName, pattern),
                like(fosterApplications.email, pattern),
            )!,
        )
    }

    if (conditions.length > 0) {
        query = query.where(and(...conditions))
    }

    return query.orderBy(desc(fosterApplications.createdAt))
}

export async function updateFosterApplicationStatus(
    id: number,
    status: FosterApplicationStatus,
    userId: string,
) {
    await db.transaction(async (tx) => {
        await tx.update(fosterApplications).set({ status }).where(eq(fosterApplications.id, id))

        await tx.insert(fosterApplicationComments).values({
            fosterApplicationId: id,
            userId,
            body: `Status changed to ${status}`,
            isSystemEvent: true,
        })
    })
}

export async function addFosterMilestone(data: {
    fosterApplicationId: number
    milestone: FosterMilestone
    completedAt: Date
    userId: string
    notes?: string
}) {
    const [result] = await db
        .insert(fosterApplicationMilestones)
        .values({
            fosterApplicationId: data.fosterApplicationId,
            milestone: data.milestone,
            completedAt: data.completedAt,
            notes: data.notes ?? null,
            userId: data.userId,
        })
        .$returningId()
    return result!
}

export async function upsertFosterMilestone(data: {
    fosterApplicationId: number
    milestone: FosterMilestone
    completedAt: Date
    userId: string
    notes?: string
}) {
    await db
        .insert(fosterApplicationMilestones)
        .values({
            fosterApplicationId: data.fosterApplicationId,
            milestone: data.milestone,
            completedAt: data.completedAt,
            notes: data.notes ?? null,
            userId: data.userId,
        })
        .onDuplicateKeyUpdate({
            set: {
                completedAt: data.completedAt,
                userId: data.userId,
                notes: data.notes ?? null,
            },
        })
}

export async function deleteFosterMilestone(
    fosterApplicationId: number,
    milestone: FosterMilestone,
) {
    await db
        .delete(fosterApplicationMilestones)
        .where(
            and(
                eq(fosterApplicationMilestones.fosterApplicationId, fosterApplicationId),
                eq(fosterApplicationMilestones.milestone, milestone),
            ),
        )
}

export async function getFosterMilestones(fosterApplicationId: number) {
    return db
        .select({
            milestone: fosterApplicationMilestones,
            userName: user.name,
        })
        .from(fosterApplicationMilestones)
        .innerJoin(user, eq(fosterApplicationMilestones.userId, user.id))
        .where(eq(fosterApplicationMilestones.fosterApplicationId, fosterApplicationId))
        .orderBy(asc(fosterApplicationMilestones.completedAt))
}

export async function saveFosterSection(
    fosterApplicationId: number,
    sectionKey: FosterSectionKey,
    data: Record<string, unknown>,
) {
    return db.transaction(async (tx) => {
        const [latest] = await tx
            .select({ version: max(fosterApplicationSections.version) })
            .from(fosterApplicationSections)
            .where(
                and(
                    eq(fosterApplicationSections.fosterApplicationId, fosterApplicationId),
                    eq(fosterApplicationSections.sectionKey, sectionKey),
                ),
            )

        const nextVersion = (latest?.version ?? 0) + 1

        const [result] = await tx
            .insert(fosterApplicationSections)
            .values({
                fosterApplicationId,
                sectionKey,
                version: nextVersion,
                data,
            })
            .$returningId()

        return result!
    })
}

export async function getLatestFosterSections(fosterApplicationId: number) {
    const latestVersions = db
        .select({
            sectionKey: fosterApplicationSections.sectionKey,
            maxVersion: max(fosterApplicationSections.version).as("maxVersion"),
        })
        .from(fosterApplicationSections)
        .where(eq(fosterApplicationSections.fosterApplicationId, fosterApplicationId))
        .groupBy(fosterApplicationSections.sectionKey)
        .as("latestVersions")

    return db
        .select({
            section: fosterApplicationSections,
        })
        .from(fosterApplicationSections)
        .innerJoin(
            latestVersions,
            and(
                eq(fosterApplicationSections.sectionKey, latestVersions.sectionKey),
                eq(fosterApplicationSections.version, sql`${latestVersions.maxVersion}`),
            ),
        )
        .where(eq(fosterApplicationSections.fosterApplicationId, fosterApplicationId))
}

export async function getLatestFosterSectionsForApplications(
    fosterApplicationIds: number[],
    sectionKeys: FosterSectionKey[],
) {
    if (fosterApplicationIds.length === 0) return []

    const latestVersions = db
        .select({
            fosterApplicationId: fosterApplicationSections.fosterApplicationId,
            sectionKey: fosterApplicationSections.sectionKey,
            maxVersion: max(fosterApplicationSections.version).as("maxVersion"),
        })
        .from(fosterApplicationSections)
        .where(
            and(
                inArray(fosterApplicationSections.fosterApplicationId, fosterApplicationIds),
                inArray(fosterApplicationSections.sectionKey, sectionKeys),
            ),
        )
        .groupBy(
            fosterApplicationSections.fosterApplicationId,
            fosterApplicationSections.sectionKey,
        )
        .as("latestVersions")

    return db
        .select({
            fosterApplicationId: fosterApplicationSections.fosterApplicationId,
            sectionKey: fosterApplicationSections.sectionKey,
            data: fosterApplicationSections.data,
        })
        .from(fosterApplicationSections)
        .innerJoin(
            latestVersions,
            and(
                eq(
                    fosterApplicationSections.fosterApplicationId,
                    latestVersions.fosterApplicationId,
                ),
                eq(fosterApplicationSections.sectionKey, latestVersions.sectionKey),
                eq(fosterApplicationSections.version, sql`${latestVersions.maxVersion}`),
            ),
        )
}

export async function submitFosterApplication(id: number) {
    await db
        .update(fosterApplications)
        .set({ status: "submitted", submittedAt: sql`now()` })
        .where(eq(fosterApplications.id, id))
}

export async function createFosterApplicationToken(
    fosterApplicationId: number,
    token: string,
    expiresAt: Date,
) {
    const [result] = await db
        .insert(fosterApplicationTokens)
        .values({ fosterApplicationId, token, expiresAt })
        .$returningId()
    return result!
}

export async function getFosterApplicationByEmail(email: string) {
    const [result] = await db
        .select()
        .from(fosterApplications)
        .where(eq(fosterApplications.email, email))
        .orderBy(desc(fosterApplications.createdAt))
        .limit(1)
    return result ?? null
}

export async function deleteFosterApplicationTokens(fosterApplicationId: number) {
    await db
        .delete(fosterApplicationTokens)
        .where(eq(fosterApplicationTokens.fosterApplicationId, fosterApplicationId))
}

export async function addFosterComment(data: {
    fosterApplicationId: number
    userId: string
    body: string
    sectionCategory?: FosterSectionCategory
    isSystemEvent?: boolean
}) {
    const [result] = await db
        .insert(fosterApplicationComments)
        .values({
            fosterApplicationId: data.fosterApplicationId,
            userId: data.userId,
            body: data.body,
            sectionCategory: data.sectionCategory ?? null,
            isSystemEvent: data.isSystemEvent ?? false,
        })
        .$returningId()
    return result!
}

export async function getFosterComments(
    fosterApplicationId: number,
    sectionCategory?: FosterSectionCategory,
) {
    const conditions = [eq(fosterApplicationComments.fosterApplicationId, fosterApplicationId)]

    if (sectionCategory) {
        conditions.push(eq(fosterApplicationComments.sectionCategory, sectionCategory))
    }

    return db
        .select({
            comment: fosterApplicationComments,
            userName: user.name,
        })
        .from(fosterApplicationComments)
        .innerJoin(user, eq(fosterApplicationComments.userId, user.id))
        .where(and(...conditions))
        .orderBy(asc(fosterApplicationComments.createdAt))
}
