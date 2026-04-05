import Link from "next/link"
import { getAllEvents } from "@repo/database"
import { Button } from "@repo/ui/components/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/components/table"
import { Badge } from "@repo/ui/components/badge"
import { Check, Plus } from "lucide-react"
import { archiveEventAction, restoreEventAction } from "@/app/_actions/events"
import { ArchiveButton } from "@/app/_components/archive-button"
import { RestoreButton } from "@/app/_components/restore-button"

export default async function EventsPage() {
    const events = await getAllEvents()

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
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
                        <TableRow
                            key={event.id}
                            className={event.archived ? "opacity-50" : undefined}
                        >
                            <TableCell>
                                <span className="flex items-center gap-2">
                                    <Link
                                        href={`/events/${event.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {event.title}
                                    </Link>
                                    {event.archived && <Badge variant="outline">Archived</Badge>}
                                </span>
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
                                {event.archived ? (
                                    <RestoreButton
                                        title={event.title}
                                        entityName="event"
                                        action={restoreEventAction.bind(null, event.id)}
                                    />
                                ) : (
                                    <ArchiveButton
                                        title={event.title}
                                        entityName="event"
                                        action={archiveEventAction.bind(null, event.id)}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {events.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="text-muted-foreground py-8 text-center"
                            >
                                No events yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
