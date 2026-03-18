import { notFound } from 'next/navigation';
import { getEvent } from '@repo/database';
import { EventForm } from '@/app/_components/event-form';
import { updateEventAction } from '@/app/_actions/events';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(Number(id));

  if (!event) {
    notFound();
  }

  const action = updateEventAction.bind(null, event.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <EventForm event={event} action={action} />
    </div>
  );
}
