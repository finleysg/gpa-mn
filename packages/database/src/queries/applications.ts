import { and, asc, desc, eq, like, max, or, sql } from "drizzle-orm"
import { db } from "../index"
import { user } from "../schema/auth"
import {
    applications,
    applicationMilestones,
    applicationSections,
    applicationComments,
    applicationTokens,
    type ApplicationStatus,
    type Milestone,
    type SectionCategory,
    type SectionKey,
} from "../schema/applications"

export async function createApplication(data: {
    email: string
    firstName: string
    lastName: string
    phone?: string
}) {
    const [result] = await db.insert(applications).values(data).$returningId()
    return result!
}

export async function getApplication(id: number) {
    const [result] = await db.select().from(applications).where(eq(applications.id, id))
    return result ?? null
}

export async function getApplicationByToken(token: string) {
    const [result] = await db
        .select({ application: applications, token: applicationTokens })
        .from(applicationTokens)
        .innerJoin(applications, eq(applicationTokens.applicationId, applications.id))
        .where(eq(applicationTokens.token, token))
    return result ?? null
}

export async function listApplications(filters?: { status?: ApplicationStatus; search?: string }) {
    let query = db
        .select({
            application: applications,
            repName: user.name,
        })
        .from(applications)
        .leftJoin(user, eq(applications.adoptionRep, user.id))
        .$dynamic()

    const conditions = []

    if (filters?.status) {
        conditions.push(eq(applications.status, filters.status))
    }

    if (filters?.search) {
        const pattern = `%${filters.search}%`
        conditions.push(
            or(
                like(applications.firstName, pattern),
                like(applications.lastName, pattern),
                like(applications.email, pattern),
                like(applications.houndName, pattern),
            )!,
        )
    }

    if (conditions.length > 0) {
        query = query.where(and(...conditions))
    }

    return query.orderBy(desc(applications.createdAt))
}

export async function updateApplicationStatus(
    id: number,
    status: ApplicationStatus,
    userId: string,
) {
    await db.transaction(async (tx) => {
        await tx.update(applications).set({ status }).where(eq(applications.id, id))

        await tx.insert(applicationComments).values({
            applicationId: id,
            userId,
            body: `Status changed to ${status}`,
            isSystemEvent: true,
        })
    })
}

export async function updateApplicationEnrichment(
    id: number,
    data: Partial<Pick<typeof applications.$inferInsert, "adoptionRep" | "houndId" | "houndName">>,
) {
    await db.update(applications).set(data).where(eq(applications.id, id))
}

export async function addMilestone(data: {
    applicationId: number
    milestone: Milestone
    completedAt: Date
    userId: string
    notes?: string
}) {
    const [result] = await db
        .insert(applicationMilestones)
        .values({
            applicationId: data.applicationId,
            milestone: data.milestone,
            completedAt: data.completedAt,
            notes: data.notes ?? null,
            userId: data.userId,
        })
        .$returningId()
    return result!
}

export async function getMilestones(applicationId: number) {
    return db
        .select({
            milestone: applicationMilestones,
            userName: user.name,
        })
        .from(applicationMilestones)
        .innerJoin(user, eq(applicationMilestones.userId, user.id))
        .where(eq(applicationMilestones.applicationId, applicationId))
        .orderBy(asc(applicationMilestones.completedAt))
}

export async function saveSection(
    applicationId: number,
    sectionKey: SectionKey,
    data: Record<string, unknown>,
) {
    return db.transaction(async (tx) => {
        const [latest] = await tx
            .select({ version: max(applicationSections.version) })
            .from(applicationSections)
            .where(
                and(
                    eq(applicationSections.applicationId, applicationId),
                    eq(applicationSections.sectionKey, sectionKey),
                ),
            )

        const nextVersion = (latest?.version ?? 0) + 1

        const [result] = await tx
            .insert(applicationSections)
            .values({
                applicationId,
                sectionKey,
                version: nextVersion,
                data,
            })
            .$returningId()

        return result!
    })
}

export async function getLatestSections(applicationId: number) {
    const latestVersions = db
        .select({
            sectionKey: applicationSections.sectionKey,
            maxVersion: max(applicationSections.version).as("maxVersion"),
        })
        .from(applicationSections)
        .where(eq(applicationSections.applicationId, applicationId))
        .groupBy(applicationSections.sectionKey)
        .as("latestVersions")

    return db
        .select({
            section: applicationSections,
        })
        .from(applicationSections)
        .innerJoin(
            latestVersions,
            and(
                eq(applicationSections.sectionKey, latestVersions.sectionKey),
                eq(applicationSections.version, sql`${latestVersions.maxVersion}`),
            ),
        )
        .where(eq(applicationSections.applicationId, applicationId))
}

export async function submitApplication(id: number) {
    await db
        .update(applications)
        .set({ status: "submitted", submittedAt: sql`now()` })
        .where(eq(applications.id, id))
}

export async function createApplicationToken(
    applicationId: number,
    token: string,
    expiresAt: Date,
) {
    const [result] = await db
        .insert(applicationTokens)
        .values({ applicationId, token, expiresAt })
        .$returningId()
    return result!
}

export async function getApplicationByEmail(email: string) {
    const [result] = await db
        .select()
        .from(applications)
        .where(eq(applications.email, email))
        .orderBy(desc(applications.createdAt))
        .limit(1)
    return result ?? null
}

export async function deleteApplicationTokens(applicationId: number) {
    await db.delete(applicationTokens).where(eq(applicationTokens.applicationId, applicationId))
}

export async function addComment(data: {
    applicationId: number
    userId: string
    body: string
    sectionCategory?: SectionCategory
    isSystemEvent?: boolean
}) {
    const [result] = await db
        .insert(applicationComments)
        .values({
            applicationId: data.applicationId,
            userId: data.userId,
            body: data.body,
            sectionCategory: data.sectionCategory ?? null,
            isSystemEvent: data.isSystemEvent ?? false,
        })
        .$returningId()
    return result!
}

export async function getComments(applicationId: number, sectionCategory?: SectionCategory) {
    const conditions = [eq(applicationComments.applicationId, applicationId)]

    if (sectionCategory) {
        conditions.push(eq(applicationComments.sectionCategory, sectionCategory))
    }

    return db
        .select({
            comment: applicationComments,
            userName: user.name,
        })
        .from(applicationComments)
        .innerJoin(user, eq(applicationComments.userId, user.id))
        .where(and(...conditions))
        .orderBy(asc(applicationComments.createdAt))
}
