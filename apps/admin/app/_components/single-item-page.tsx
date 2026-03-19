import { getLatestVersions, getAllVersions } from '@repo/database';
import { EditContentTabs } from '@/app/_components/edit-content-tabs';
import { updateContentAction, revertContentAction } from '@/app/_actions/content';
import type { ContentTypeConfig } from '@/app/_lib/content-config';

export async function SingleItemPage({ config }: { config: ContentTypeConfig }) {
  const items = await getLatestVersions(config.contentType);
  const item = items[0];

  if (!item) {
    return <p className="text-muted-foreground">No {config.singular.toLowerCase()} content found.</p>;
  }

  const versions = await getAllVersions(item.item.id);
  const formAction = updateContentAction.bind(null, config.contentType, item.item.id);
  const revertAction = revertContentAction.bind(null, config.contentType, item.item.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{config.singular}</h1>
      <EditContentTabs
        contentType={config.contentType}
        data={item.version.data as Record<string, unknown>}
        versions={versions}
        currentVersion={item.version.version}
        formAction={formAction}
        revertAction={revertAction}
        backHref="/"
      />
    </div>
  );
}
