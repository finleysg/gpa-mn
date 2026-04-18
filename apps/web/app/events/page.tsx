import type { Metadata } from "next"
import { getEvents, getPageHeader, getSectionHeader } from "@/app/_lib/content"
import { PageHero } from "@/app/_components/page-hero"
import { EventCard } from "@/app/_components/event-card"
import { EventCalendar } from "@/app/_components/event-calendar"
import { SectionHeader } from "@/app/_components/section-header"
import { FadeIn } from "@/app/_components/fade-in"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Events",
    description:
        "Greyhound meet-and-greets, group walks, and fundraisers in the Twin Cities and across Minnesota.",
    alternates: { canonical: "/events" },
}

export default async function EventsPage() {
    const [events, pageHeader, calendarHeader] = await Promise.all([
        getEvents(),
        getPageHeader("Events"),
        getSectionHeader("Events — Calendar"),
    ])

    return (
        <>
            <PageHero
                title={pageHeader.title}
                highlight={pageHeader.highlight}
                description={pageHeader.description}
                variant={pageHeader.variant}
            />

            <section className="bg-[#FAF5F0] px-5 py-20 md:py-24 dark:bg-[#1a1715]">
                <div className="mx-auto max-w-300">
                    <div className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0">
                        {events
                            .filter((e) => e.showUpcoming)
                            .map((event, i) => (
                                <FadeIn
                                    key={event.id}
                                    delay={i * 60}
                                    className="min-w-70 snap-start md:w-80 md:min-w-0"
                                >
                                    <EventCard event={event} index={i} />
                                </FadeIn>
                            ))}
                    </div>
                </div>
            </section>
            {/* Calendar */}
            <section className="bg-card px-5 py-20 md:py-24">
                <div className="mx-auto max-w-300">
                    <SectionHeader title={calendarHeader.title} className="mb-10" />
                    <EventCalendar events={events} />
                </div>
            </section>
        </>
    )
}
