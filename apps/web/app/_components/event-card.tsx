import Link from "next/link"
import Image from "next/image"
import { Badge } from "@repo/ui/components/badge"
import type { WebEvent } from "@/app/_lib/content"

export function EventCard({ event }: { event: WebEvent; index?: number }) {
    return (
        <Link
            href={`/events/${event.id}`}
            className="group bg-card border-border block overflow-hidden rounded-3xl border shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        >
            {(event.mobileImage ?? event.image) ? (
                <div className="relative h-40 overflow-hidden">
                    <Image
                        src={(event.mobileImage ?? event.image)!}
                        alt={event.title}
                        fill
                        quality={70}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                </div>
            ) : (
                <div className="from-secondary/60 to-secondary/20 flex h-40 items-center justify-center bg-linear-to-br text-sm font-semibold text-[#2d7a81] dark:text-[#3a9da6]">
                    {event.title}
                </div>
            )}

            <div className="p-5 pt-4">
                <Badge
                    variant="secondary"
                    className="bg-secondary/30 dark:bg-secondary/20 mb-2.5 rounded-full text-[0.65rem] font-bold tracking-wider text-[#2d7a81] uppercase dark:text-[#3a9da6]"
                >
                    {event.type}
                </Badge>
                <h3 className="font-heading mb-1.5 text-xl tracking-wider uppercase">
                    {event.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
            </div>
        </Link>
    )
}
