import { and, asc, desc, eq, max, sql } from 'drizzle-orm';
import { db } from '../index';
import { contentItems, contentVersions } from '../schema/content';

type ContentType = (typeof contentItems.$inferSelect)['contentType'];

function withLatestVersion(filter?: ReturnType<typeof eq>) {
  const latestVersions = db
    .select({
      contentItemId: contentVersions.contentItemId,
      maxVersion: max(contentVersions.version).as('maxVersion'),
    })
    .from(contentVersions)
    .$dynamic();

  const subquery = (filter ? latestVersions.where(filter) : latestVersions)
    .groupBy(contentVersions.contentItemId)
    .as('latestVersions');

  return db
    .select({
      item: contentItems,
      version: contentVersions,
    })
    .from(contentItems)
    .innerJoin(subquery, eq(contentItems.id, subquery.contentItemId))
    .innerJoin(
      contentVersions,
      and(
        eq(contentVersions.contentItemId, subquery.contentItemId),
        eq(contentVersions.version, sql`${subquery.maxVersion}`),
      ),
    );
}

export async function getLatestVersions(contentType: ContentType) {
  return withLatestVersion()
    .where(and(eq(contentItems.contentType, contentType), eq(contentItems.archived, false)))
    .orderBy(asc(contentItems.sortOrder));
}

export async function getContentItemBySlug(contentType: ContentType, slug: string) {
  const [result] = await db
    .select()
    .from(contentItems)
    .where(and(eq(contentItems.contentType, contentType), eq(contentItems.slug, slug)));
  return result;
}

export async function getContentItem(id: number) {
  const [result] = await withLatestVersion(eq(contentVersions.contentItemId, id))
    .where(eq(contentItems.id, id));

  return result;
}

export async function getAllVersions(contentItemId: number) {
  return db
    .select()
    .from(contentVersions)
    .where(eq(contentVersions.contentItemId, contentItemId))
    .orderBy(desc(contentVersions.version));
}

export async function createContentItem(
  contentType: ContentType,
  slug: string,
  data: Record<string, unknown>,
  createdBy: string,
) {
  return db.transaction(async (tx) => {
    const [item] = await tx.insert(contentItems).values({ contentType, slug }).$returningId();
    await tx.insert(contentVersions).values({
      contentItemId: item!.id,
      version: 1,
      data,
      createdBy,
    });
    return item!;
  });
}

export async function updateContentItem(
  contentItemId: number,
  data: Record<string, unknown>,
  createdBy: string,
  changeNote?: string,
) {
  await db.transaction(async (tx) => {
    const [latest] = await tx
      .select({ version: max(contentVersions.version) })
      .from(contentVersions)
      .where(eq(contentVersions.contentItemId, contentItemId));

    const nextVersion = (latest?.version ?? 0) + 1;

    await tx.insert(contentVersions).values({
      contentItemId,
      version: nextVersion,
      data,
      createdBy,
      changeNote: changeNote ?? null,
    });
  });
}

export async function revertToVersion(contentItemId: number, targetVersionId: number, createdBy: string) {
  const [targetVersion] = await db.select().from(contentVersions).where(eq(contentVersions.id, targetVersionId));

  if (!targetVersion) throw new Error(`Version ${targetVersionId} not found`);

  await updateContentItem(contentItemId, targetVersion.data as Record<string, unknown>, createdBy, `Reverted to version ${targetVersion.version}`);
}

export async function archiveContentItem(contentItemId: number) {
  await db.update(contentItems).set({ archived: true }).where(eq(contentItems.id, contentItemId));
}

export async function reorderContentItems(contentType: ContentType, orderedIds: number[]) {
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx
        .update(contentItems)
        .set({ sortOrder: i })
        .where(and(eq(contentItems.id, orderedIds[i]!), eq(contentItems.contentType, contentType)));
    }
  });
}
