import { ContentListPage } from '@/app/_components/content-list-page';
import { contentTypeConfigs } from '@/app/_lib/content-config';

export default function WhyGreyhoundsPage() {
  return <ContentListPage config={contentTypeConfigs.whyGreyhound} />;
}
