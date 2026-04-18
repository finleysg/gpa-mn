import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getEvent } from "@/app/_lib/content"
import { Badge } from "@repo/ui/components/badge"
import { MapPin, Clock, Calendar } from "lucide-react"
import { BlobDecoration } from "@/app/_components/blob-decoration"
import { MarkdownContent } from "@/app/_components/markdown-content"
import { JsonLd } from "@/app/_components/json-ld"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:6000"

export const dynamic = "force-dynamic"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const event = await getEvent(Number(id))
    if (!event) return {}
    return {
        title: event.title,
        description: event.description,
        alternates: { canonical: `/events/${id}` },
        openGraph: {
            title: event.title,
            description: event.description,
            type: "article",
            images: event.image ? [event.image] : undefined,
        },
    }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await getEvent(Number(id))

    if (!event) notFound()

    const eventUrl = `${siteUrl}/events/${id}`
    const eventJsonLd = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description,
        startDate: event.startDateIso,
        endDate: event.endDateIso ?? event.startDateIso,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
            "@type": "Place",
            name: event.location,
            address: event.location,
        },
        image: event.image ? [event.image] : undefined,
        url: eventUrl,
        organizer: {
            "@type": "NGO",
            name: "Greyhound Pets of America - Minnesota",
            url: siteUrl,
        },
    }
    const breadcrumbsJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "Events", item: `${siteUrl}/events` },
            { "@type": "ListItem", position: 3, name: event.title, item: eventUrl },
        ],
    }

    return (
        <>
            <JsonLd data={[eventJsonLd, breadcrumbsJsonLd]} />
            {/* Hero image */}
            <section className="relative overflow-hidden pt-28 pb-0">
                <div className="mx-auto max-w-300 px-5">
                    {event.image || event.mobileImage ? (
                        <>
                            {/* Mobile image */}
                            {event.mobileImage && (
                                <div className="relative h-48 overflow-hidden rounded-4xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] md:hidden dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                                    <Image
                                        src={event.mobileImage}
                                        alt={event.title}
                                        fill
                                        priority
                                        className="object-cover"
                                        sizes="100vw"
                                    />
                                </div>
                            )}
                            {/* Desktop image */}
                            <div
                                className={`relative h-48 overflow-hidden rounded-4xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] md:h-80 dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)] ${event.mobileImage ? "hidden md:block" : ""}`}
                            >
                                <Image
                                    src={event.image ?? event.mobileImage!}
                                    alt={event.title}
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 1200px) 100vw, 1200px"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="from-secondary/60 to-secondary/20 flex h-48 items-center justify-center rounded-4xl bg-linear-to-br text-lg font-semibold text-[#2d7a81] shadow-[0_8px_32px_rgba(0,0,0,0.08)] md:h-80 dark:from-[#1a3a3e] dark:to-[#253e42] dark:text-[#3a9da6] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                            {event.title}
                        </div>
                    )}
                </div>
            </section>

            {/* Event info */}
            <section className="bg-card relative overflow-hidden px-5 py-12 md:py-16">
                <BlobDecoration
                    color="teal"
                    size={300}
                    className="-top-16 -right-16 opacity-15 dark:opacity-5"
                />
                <div className="relative z-10 mx-auto max-w-300 md:grid md:grid-cols-[1fr_320px] md:gap-12">
                    <div>
                        <Link
                            href="/events"
                            className="text-muted-foreground hover:text-primary mb-4 inline-block text-sm transition-colors"
                        >
                            &larr; Back to Events
                        </Link>

                        <Badge
                            variant="secondary"
                            className="bg-secondary/30 dark:bg-secondary/20 mb-4 rounded-full text-xs font-bold tracking-wider text-[#2d7a81] uppercase dark:text-[#3a9da6]"
                        >
                            {event.type}
                        </Badge>

                        <h1 className="font-heading text-foreground mb-6 text-[clamp(2.5rem,6vw,4rem)] leading-[1.1] tracking-wider uppercase">
                            {event.title}
                        </h1>

                        <MarkdownContent
                            content={event.longDescription}
                            className="text-muted-foreground prose prose-lg mb-8 max-w-none text-lg leading-relaxed"
                        />

                        <a
                            href="#"
                            className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors"
                        >
                            Register / Learn More
                        </a>
                    </div>

                    {/* Details sidebar */}
                    <div className="mt-8 md:mt-0">
                        <div className="border-border rounded-3xl border bg-[#FAF5F0] p-6 dark:bg-[#1a1715]">
                            <h2 className="font-heading mb-4 text-xl tracking-wider uppercase">
                                Event Details
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="text-primary mt-0.5 size-5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold">{event.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="text-primary mt-0.5 size-5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold">{event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-primary mt-0.5 size-5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold">{event.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
