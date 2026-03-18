import { and, asc, eq } from 'drizzle-orm';
import { db } from '../index.js';
import { photos } from '../schema/photos.js';

type PhotoType = (typeof photos.$inferSelect)['photoType'];

export async function getPhotos(photoType: PhotoType, parentId: number) {
  return db
    .select()
    .from(photos)
    .where(and(eq(photos.photoType, photoType), eq(photos.parentId, parentId)))
    .orderBy(asc(photos.sortOrder));
}

export async function createPhoto(data: typeof photos.$inferInsert) {
  const [result] = await db.insert(photos).values(data).$returningId();
  return result!;
}

export async function deletePhoto(id: number) {
  await db.delete(photos).where(eq(photos.id, id));
}

export async function getPhoto(id: number) {
  const [photo] = await db.select().from(photos).where(eq(photos.id, id));
  return photo;
}

export async function reorderPhotos(orderedIds: number[]) {
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.update(photos).set({ sortOrder: i }).where(eq(photos.id, orderedIds[i]!));
    }
  });
}
