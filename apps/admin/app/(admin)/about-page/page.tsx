import { SingleItemPage } from '@/app/_components/single-item-page';
import { contentTypeConfigs } from '@/app/_lib/content-config';

export default function AboutPagePage() {
  return <SingleItemPage config={contentTypeConfigs.aboutPage} />;
}
