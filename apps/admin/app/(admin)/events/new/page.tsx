import { EventForm } from '@/app/_components/event-form';
import { createEventAction } from '@/app/_actions/events';

export default function NewEventPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Event</h1>
      <EventForm action={createEventAction} />
    </div>
  );
}
