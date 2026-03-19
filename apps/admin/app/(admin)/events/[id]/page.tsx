import { notFound } from 'next/navigation';
import { getEvent, getPhotos } from '@repo/database';
import { EditEventTabs } from '@/app/_components/edit-event-tabs';
import { updateEventAction } from '@/app/_actions/events';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const [event, eventPhotos] = await Promise.all([
    getEvent(numericId),
    getPhotos('event', numericId),
  ]);

  if (!event) {
    notFound();
  }
  const desktopPhoto = eventPhotos.find((p) => p.variant === 'desktop') ?? null;
  const mobilePhoto = eventPhotos.find((p) => p.variant === 'mobile') ?? null;
  const s3PublicUrl = process.env.S3_PUBLIC_URL ?? '';

  const action = updateEventAction.bind(null, event.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Event</h1>
      <EditEventTabs
        event={event}
        desktopPhoto={desktopPhoto}
        mobilePhoto={mobilePhoto}
        action={action}
        s3PublicUrl={s3PublicUrl}
      />
    </div>
  );
}
