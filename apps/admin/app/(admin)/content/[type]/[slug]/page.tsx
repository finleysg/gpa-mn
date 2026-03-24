import { notFound } from 'next/navigation';
import { getContentItemBySlug, getContentItem, getAllVersions } from '@repo/database';
import { EditContentTabs } from '@/app/_components/edit-content-tabs';
import { updateContentAction, revertContentAction } from '@/app/_actions/content';
import type { ContentType } from '@repo/types';

const typeMap: Record<string, ContentType> = {
  'page-header': 'pageHeader',
  'section-header': 'sectionHeader',
};

export default async function ContentBySlugPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;

  const contentType = typeMap[type];
  if (!contentType) {
    notFound();
  }

  const contentItem = await getContentItemBySlug(contentType, slug);
  if (!contentItem) {
    notFound();
  }

  const [item, versions] = await Promise.all([
    getContentItem(contentItem.id),
    getAllVersions(contentItem.id),
  ]);

  if (!item) {
    notFound();
  }

  const label = contentType === 'pageHeader' ? 'Page Header' : 'Section Header';
  const formAction = updateContentAction.bind(null, contentType, contentItem.id);
  const revertAction = revertContentAction.bind(null, contentType, contentItem.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit {label}</h1>
      <EditContentTabs
        contentType={contentType}
        data={item.version.data as Record<string, unknown>}
        versions={versions}
        currentVersion={item.version.version}
        formAction={formAction}
        revertAction={revertAction}
        backHref={`/content/${type}/${slug}`}
      />
    </div>
  );
}
