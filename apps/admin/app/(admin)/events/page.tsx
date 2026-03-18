import Link from 'next/link';
import { getEvents } from '@repo/database';
import { Button } from '@repo/ui/components/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table';
import { Badge } from '@repo/ui/components/badge';
import { Check, Plus } from 'lucide-react';
import { archiveEventAction } from '@/app/_actions/events';
import { ArchiveButton } from '@/app/_components/archive-button';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/events/new">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Upcoming</TableHead>
            <TableHead className="w-30">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Link href={`/events/${event.id}`} className="font-medium hover:underline">
                  {event.title}
                </Link>
              </TableCell>
              <TableCell>{event.startDate}</TableCell>
              <TableCell>{event.time}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <Badge variant="secondary">{event.type}</Badge>
              </TableCell>
              <TableCell>
                {event.showUpcoming && <Check className="h-4 w-4 text-green-600" />}
              </TableCell>
              <TableCell>
                <ArchiveButton
                  title={event.title}
                  entityName="event"
                  action={archiveEventAction.bind(null, event.id)}
                />
              </TableCell>
            </TableRow>
          ))}
          {events.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No events yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
