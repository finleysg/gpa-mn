import { eq, and, ne, asc, count } from "drizzle-orm"
import { db } from "../index"
import { events } from "../schema/events"

export async function getEvents() {
    return db.select().from(events).where(eq(events.archived, false)).orderBy(asc(events.startDate))
}

export async function getAllEvents() {
    return db.select().from(events).orderBy(asc(events.archived), asc(events.startDate))
}

export async function getFeaturedEvents() {
    return db
        .select()
        .from(events)
        .where(and(eq(events.archived, false), eq(events.featured, true)))
        .orderBy(asc(events.featuredOrder), asc(events.startDate))
}

export async function countFeaturedEventsExcluding(excludeId?: number) {
    const where = excludeId
        ? and(eq(events.featured, true), ne(events.id, excludeId))
        : eq(events.featured, true)
    const [row] = await db.select({ value: count() }).from(events).where(where)
    return row?.value ?? 0
}

export async function getMaxFeaturedOrder() {
    const featured = await getFeaturedEvents()
    return featured.reduce((max, e) => Math.max(max, e.featuredOrder), 0)
}

export async function getEvent(id: number) {
    const [event] = await db.select().from(events).where(eq(events.id, id))
    return event
}

export async function createEvent(data: typeof events.$inferInsert) {
    const [result] = await db.insert(events).values(data).$returningId()
    return result!
}

export async function updateEvent(
    id: number,
    data: Partial<Omit<typeof events.$inferInsert, "id">>,
) {
    await db.update(events).set(data).where(eq(events.id, id))
}

export async function archiveEvent(id: number) {
    await db.update(events).set({ archived: true }).where(eq(events.id, id))
}

export async function restoreEvent(id: number) {
    await db.update(events).set({ archived: false }).where(eq(events.id, id))
}

export async function swapFeaturedOrder(idA: number, idB: number) {
    const [a] = await db.select().from(events).where(eq(events.id, idA))
    const [b] = await db.select().from(events).where(eq(events.id, idB))
    if (!a || !b) return
    await db.update(events).set({ featuredOrder: b.featuredOrder }).where(eq(events.id, idA))
    await db.update(events).set({ featuredOrder: a.featuredOrder }).where(eq(events.id, idB))
}
