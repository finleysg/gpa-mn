import { notFound } from 'next/navigation';
import { getContentItem, getAllVersions } from '@repo/database';
import { EditContentTabs } from '@/app/_components/edit-content-tabs';
import { updateContentAction, revertContentAction } from '@/app/_actions/content';
import { contentTypeConfigs } from '@/app/_lib/content-config';

const config = contentTypeConfigs.aboutPage;

export default async function EditAboutPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getContentItem(Number(id));

  if (!item) {
    notFound();
  }

  const versions = await getAllVersions(item.item.id);
  const formAction = updateContentAction.bind(null, config.contentType, item.item.id);
  const revertAction = revertContentAction.bind(null, config.contentType, item.item.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit {config.singular}</h1>
      <EditContentTabs
        contentType={config.contentType}
        data={item.version.data as Record<string, unknown>}
        versions={versions}
        currentVersion={item.version.version}
        formAction={formAction}
        revertAction={revertAction}
        backHref={`/${config.slug}`}
      />
    </div>
  );
}
