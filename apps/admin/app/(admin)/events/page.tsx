import Link from "next/link"
import { getAllEvents, getFeaturedEvents } from "@repo/database"
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
import { Check, Plus, Star } from "lucide-react"
import {
    archiveEventAction,
    restoreEventAction,
    moveFeaturedEventUpAction,
    moveFeaturedEventDownAction,
} from "@/app/_actions/events"
import { ArchiveButton } from "@/app/_components/archive-button"
import { RestoreButton } from "@/app/_components/restore-button"
import { FeaturedReorderButtons } from "@/app/_components/featured-reorder-buttons"

const MAX_FEATURED = 4

export default async function EventsPage() {
    const [events, featuredEvents] = await Promise.all([getAllEvents(), getFeaturedEvents()])

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

            <section className="mb-10">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Featured on Home</h2>
                    <span className="text-muted-foreground text-sm">
                        {featuredEvents.length} of {MAX_FEATURED} featured
                    </span>
                </div>
                {featuredEvents.length === 0 ? (
                    <p className="text-muted-foreground rounded border border-dashed p-4 text-sm">
                        No featured events. Toggle &ldquo;Featured on Home&rdquo; on an event to
                        feature it.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">Order</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="w-32">Reorder</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {featuredEvents.map((event, i) => (
                                <TableRow key={event.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/events/${event.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {event.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{event.startDate}</TableCell>
                                    <TableCell>
                                        <FeaturedReorderButtons
                                            isFirst={i === 0}
                                            isLast={i === featuredEvents.length - 1}
                                            moveUp={moveFeaturedEventUpAction.bind(null, event.id)}
                                            moveDown={moveFeaturedEventDownAction.bind(
                                                null,
                                                event.id,
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </section>

            <h2 className="mb-3 text-lg font-semibold">All Events</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Featured</TableHead>
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
                                {event.featured && <Star className="h-4 w-4 text-amber-500" />}
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
                                colSpan={8}
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
