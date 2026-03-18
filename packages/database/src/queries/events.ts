import { eq, asc } from 'drizzle-orm';
import { db } from '../index.js';
import { events } from '../schema/events.js';

export async function getEvents() {
  return db.select().from(events).where(eq(events.archived, false)).orderBy(asc(events.sortOrder));
}

export async function getEvent(id: number) {
  const [event] = await db.select().from(events).where(eq(events.id, id));
  return event;
}

export async function createEvent(data: typeof events.$inferInsert) {
  const [result] = await db.insert(events).values(data).$returningId();
  return result!;
}

export async function updateEvent(id: number, data: Partial<Omit<typeof events.$inferInsert, 'id'>>) {
  await db.update(events).set(data).where(eq(events.id, id));
}

export async function archiveEvent(id: number) {
  await db.update(events).set({ archived: true }).where(eq(events.id, id));
}

export async function reorderEvents(orderedIds: number[]) {
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.update(events).set({ sortOrder: i }).where(eq(events.id, orderedIds[i]!));
    }
  });
}
