import { getContentItemBySlug, getContentItem, getPhotos } from '@repo/database';
import { EditHomeTabs } from '@/app/_components/edit-home-tabs';
import { updateContentAction } from '@/app/_actions/content';

export default async function HomePage() {
  const homeItem = await getContentItemBySlug('pageHeader', 'home');
  const parentId = homeItem?.id ?? 0;

  const [itemWithVersion, photos] = await Promise.all([
    parentId ? getContentItem(parentId) : null,
    parentId ? getPhotos('content', parentId) : [],
  ]);

  const s3PublicUrl = process.env.S3_PUBLIC_URL ?? '';
  const data = (itemWithVersion?.version.data as Record<string, unknown>) ?? {};
  const formAction = parentId
    ? updateContentAction.bind(null, 'pageHeader', parentId)
    : undefined;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Home Page</h1>
      <p className="mb-8 text-muted-foreground">
        Manage the home page hero content and photos.
      </p>

      {formAction ? (
        <EditHomeTabs
          data={data}
          formAction={formAction}
          existingPhotos={photos}
          parentId={parentId}
          s3PublicUrl={s3PublicUrl}
        />
      ) : (
        <p className="text-muted-foreground">
          No home page content found. Please seed the database first.
        </p>
      )}
    </div>
  );
}
