import Link from "next/link"
import { fetchDogs } from "./_lib/rescue-groups"
import {
    getEvents,
    getVolunteerRoles,
    getSectionHeader,
    getPageHeader,
    getHeroImages,
} from "./_lib/content"
import { SectionHeader } from "./_components/section-header"
import { StatCard } from "./_components/stat-card"
import { DogCard } from "./_components/dog-card"
import { EventCard } from "./_components/event-card"
import { FadeIn } from "./_components/fade-in"
import { BlobDecoration } from "./_components/blob-decoration"
import { HeroImage } from "./_components/hero-image"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@repo/ui/components/carousel"

export const dynamic = "force-dynamic"

export default async function HomePage() {
    const [
        dogs,
        events,
        volunteerRoles,
        heroImages,
        pageHeader,
        dogsSectionHeader,
        eventsSectionHeader,
        volunteerSectionHeader,
    ] = await Promise.all([
        fetchDogs(),
        getEvents(),
        getVolunteerRoles(),
        getHeroImages(),
        getPageHeader("Home"),
        getSectionHeader("Homepage — Available Greyhounds"),
        getSectionHeader("Homepage — Events"),
        getSectionHeader("Homepage — Volunteer"),
    ])

    const shuffledRoles = [...volunteerRoles]
    for (let i = shuffledRoles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledRoles[i], shuffledRoles[j]] = [shuffledRoles[j]!, shuffledRoles[i]!]
    }
    shuffledRoles.splice(4)

    return (
        <>
            {/* ── HERO ── */}
            <section className="to-secondary/30 relative flex min-h-[80vh] items-center overflow-hidden bg-linear-to-br from-[#FAF5F0] via-[#f0ebe4] via-60% px-5 pt-36 pb-20 md:pt-44 md:pb-24 dark:from-[#1a1715] dark:via-[#1e1b17] dark:via-60% dark:to-[#152628]">
                <BlobDecoration
                    color="pink"
                    size={500}
                    className="-top-24 -right-36 opacity-30 dark:opacity-8"
                />
                <BlobDecoration
                    color="teal"
                    size={400}
                    className="-bottom-24 -left-24 opacity-25 dark:opacity-6"
                />

                <div className="relative z-10 mx-auto grid max-w-300 items-center gap-10 md:grid-cols-2 md:gap-12">
                    {/* Text content */}
                    <div className="text-center md:text-left">
                        <h1 className="font-heading text-foreground mb-5 text-[clamp(2.8rem,7vw,4.8rem)] leading-[1.1] tracking-wider uppercase">
                            {pageHeader.highlight ? (
                                <>
                                    {pageHeader.title.split(pageHeader.highlight)[0]}
                                    <em className="text-primary not-italic">
                                        {pageHeader.highlight}
                                    </em>
                                    {pageHeader.title.split(pageHeader.highlight)[1]}
                                </>
                            ) : (
                                pageHeader.title
                            )}
                        </h1>

                        {pageHeader.description && (
                            <p className="text-muted-foreground mx-auto mb-8 max-w-130 text-lg leading-relaxed md:mx-0">
                                {pageHeader.description}
                            </p>
                        )}

                        {/* Desktop-only action buttons */}
                        <div className="hidden flex-wrap gap-3 md:flex md:justify-start">
                            <Link
                                href="/adopt"
                                className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors"
                            >
                                Adopt a Greyhound
                            </Link>
                            <Link
                                href="/volunteer"
                                className="border-primary text-primary hover:bg-primary inline-flex items-center gap-2 rounded-full border-2 px-8 py-3.5 font-semibold transition-colors hover:text-white"
                            >
                                Become a Foster
                            </Link>
                        </div>
                    </div>

                    {/* Hero image + stats */}
                    <div>
                        <HeroImage images={heroImages} />

                        {/* Mobile-only action buttons (below image) */}
                        <div className="mt-6 flex flex-wrap justify-center gap-3 md:hidden">
                            <Link
                                href="/adopt"
                                className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors"
                            >
                                Adopt a Greyhound
                            </Link>
                            <Link
                                href="/volunteer"
                                className="border-primary text-primary hover:bg-primary inline-flex items-center gap-2 rounded-full border-2 px-8 py-3.5 font-semibold transition-colors hover:text-white"
                            >
                                Become a Foster
                            </Link>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <StatCard value="2,000+" label="Placed" />
                            <StatCard value="35+" label="Years" />
                            <StatCard value="100%" label="Volunteer" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── AVAILABLE DOGS CAROUSEL ── */}
            <section className="relative bg-[#FAF5F0] px-5 py-20 md:py-24 dark:bg-[#1a1715]">
                <BlobDecoration
                    color="pink"
                    size={300}
                    className="-bottom-16 -left-16 opacity-20 dark:opacity-6"
                />
                <div className="relative z-10 mx-auto max-w-300">
                    <div className="mb-10 flex items-end justify-between">
                        <SectionHeader
                            title={dogsSectionHeader.title}
                            description={dogsSectionHeader.description}
                            className="text-center md:text-left"
                        />
                        <Link
                            href="/adopt/available"
                            className="border-primary text-primary hover:bg-primary ml-8 hidden shrink-0 items-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-colors hover:text-white md:inline-flex"
                        >
                            View All Dogs
                        </Link>
                    </div>

                    <Carousel opts={{ align: "start", loop: true }} className="mx-auto">
                        <CarouselContent className="-ml-5">
                            {dogs.map((dog, i) => (
                                <CarouselItem
                                    key={dog.id}
                                    className="basis-full pl-5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                >
                                    <DogCard dog={dog} index={i} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-4 md:-left-12" />
                        <CarouselNext className="-right-4 md:-right-12" />
                    </Carousel>

                    <div className="mt-8 text-center md:hidden">
                        <Link
                            href="/adopt/available"
                            className="border-primary text-primary hover:bg-primary inline-flex items-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-colors hover:text-white"
                        >
                            View All Dogs
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── EVENTS ── */}
            <section className="bg-card relative overflow-hidden px-5 py-20 md:py-24">
                <BlobDecoration
                    color="teal"
                    size={450}
                    className="-right-36 -bottom-36 opacity-15 dark:opacity-4"
                />
                <div className="relative z-10 mx-auto max-w-300">
                    <SectionHeader
                        title={eventsSectionHeader.title}
                        description={eventsSectionHeader.description}
                        align="center"
                        className="mb-10"
                    />

                    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0">
                        {events
                            .filter((e) => e.showUpcoming)
                            .slice(0, 4)
                            .map((event, i) => (
                                <FadeIn
                                    key={event.id}
                                    delay={i * 80}
                                    className="min-w-70 snap-start md:w-70 md:min-w-0"
                                >
                                    <EventCard event={event} index={i} />
                                </FadeIn>
                            ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href="/events"
                            className="border-primary text-primary hover:bg-primary inline-flex items-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-colors hover:text-white"
                        >
                            View All Events
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── VOLUNTEER ── */}
            <section className="bg-card px-5 py-20 md:py-24">
                <div className="mx-auto max-w-300">
                    <FadeIn>
                        <div className="relative overflow-hidden rounded-4xl border border-white/6 bg-linear-to-br from-[#00444b] via-[#005a63] to-[#2d7a81] p-10 text-white shadow-[0_8px_40px_rgba(0,68,75,0.25)] md:p-14 lg:p-16 dark:from-[#0a2e32] dark:via-[#0e3a40] dark:to-[#0c3438] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                            <BlobDecoration
                                color="teal"
                                size={300}
                                className="-right-24 -bottom-24 opacity-15 dark:opacity-8"
                            />
                            <BlobDecoration
                                color="salmon"
                                size={200}
                                className="-top-16 -left-16 opacity-10 dark:opacity-5"
                            />

                            <div className="relative z-10 md:grid md:grid-cols-2 md:items-center md:gap-10">
                                <div>
                                    <h2 className="font-heading mb-3 text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-wider text-white uppercase">
                                        {volunteerSectionHeader.title}
                                    </h2>
                                    <p className="mb-7 max-w-125 text-[1.05rem] leading-relaxed text-white/80">
                                        {volunteerSectionHeader.description}
                                    </p>
                                    <Link
                                        href="/volunteer"
                                        className="hover:bg-secondary inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-[#00444b] transition-colors"
                                    >
                                        Get Involved
                                    </Link>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-3 md:mt-0">
                                    {shuffledRoles.map((role) => (
                                        <div
                                            key={role.title}
                                            className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center transition-all hover:-translate-y-0.5 hover:bg-white/15"
                                        >
                                            <div className="mb-1.5 text-xl">{role.icon}</div>
                                            <span className="text-xs font-semibold">
                                                {role.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </>
    )
}
