import { ContentForm } from '@/app/_components/content-form';
import { createContentAction } from '@/app/_actions/content';
import { contentTypeConfigs } from '@/app/_lib/content-config';

const config = contentTypeConfigs.adoptionStep;

export default function NewAdoptionStepPage() {
  const action = createContentAction.bind(null, config.contentType);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New {config.singular}</h1>
      <ContentForm contentType={config.contentType} action={action} backHref={`/${config.slug}`} />
    </div>
  );
}
