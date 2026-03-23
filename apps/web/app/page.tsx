import Link from 'next/link';
import { dogs } from './_data/dogs';
import { getEvents, getVolunteerRoles, getSectionHeader, getPageHeader, getHeroImages } from './_lib/content';
import { SectionHeader } from './_components/section-header';
import { StatCard } from './_components/stat-card';
import { DogCard } from './_components/dog-card';
import { EventCard } from './_components/event-card';
import { FadeIn } from './_components/fade-in';
import { BlobDecoration } from './_components/blob-decoration';
import { HeroImage } from './_components/hero-image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@repo/ui/components/carousel';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [events, volunteerRoles, heroImages, pageHeader, dogsSectionHeader, eventsSectionHeader, volunteerSectionHeader] = await Promise.all([
    getEvents(),
    getVolunteerRoles(),
    getHeroImages(),
    getPageHeader('Home'),
    getSectionHeader('Homepage — Available Greyhounds'),
    getSectionHeader('Homepage — Events'),
    getSectionHeader('Homepage — Volunteer'),
  ]);

  const shuffledRoles = [...volunteerRoles];
  for (let i = shuffledRoles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledRoles[i], shuffledRoles[j]] = [shuffledRoles[j]!, shuffledRoles[i]!];
  }
  shuffledRoles.splice(4);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-36 pb-20 px-5 md:pt-44 md:pb-24 bg-linear-to-br from-[#FAF5F0] via-[#f0ebe4] via-60% to-secondary/30 dark:from-[#1a1715] dark:via-[#1e1b17] dark:via-60% dark:to-[#152628] min-h-[80vh] flex items-center">
        <BlobDecoration color="pink" size={500} className="-top-24 -right-36 opacity-30 dark:opacity-8" />
        <BlobDecoration color="teal" size={400} className="-bottom-24 -left-24 opacity-25 dark:opacity-6" />

        <div className="relative z-10 max-w-300 mx-auto grid gap-10 items-center md:grid-cols-2 md:gap-12">
          {/* Text content */}
          <div className="text-center md:text-left">

            <h1 className="font-heading text-[clamp(2.8rem,7vw,4.8rem)] leading-[1.1] tracking-wider uppercase text-foreground mb-5">
              {pageHeader.highlight ? (
                <>
                  {pageHeader.title.split(pageHeader.highlight)[0]}
                  <em className="not-italic text-primary">{pageHeader.highlight}</em>
                  {pageHeader.title.split(pageHeader.highlight)[1]}
                </>
              ) : (
                pageHeader.title
              )}
            </h1>

            {pageHeader.description && (
              <p className="text-lg text-muted-foreground leading-relaxed max-w-130 mx-auto md:mx-0 mb-8">
                {pageHeader.description}
              </p>
            )}

            {/* Desktop-only action buttons */}
            <div className="hidden md:flex flex-wrap gap-3 md:justify-start">
              <Link
                href="/adopt"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(156,47,48,0.25)]"
              >
                Adopt a Greyhound
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-8 py-3.5 font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Become a Foster
              </Link>
            </div>
          </div>

          {/* Hero image + stats */}
          <div>
            <HeroImage images={heroImages} />

            {/* Mobile-only action buttons (below image) */}
            <div className="flex flex-wrap gap-3 justify-center mt-6 md:hidden">
              <Link
                href="/adopt"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(156,47,48,0.25)]"
              >
                Adopt a Greyhound
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-8 py-3.5 font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Become a Foster
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <StatCard value="2,000+" label="Placed" />
              <StatCard value="35+" label="Years" />
              <StatCard value="100%" label="Volunteer" />
            </div>
          </div>
        </div>
      </section>

      {/* ── AVAILABLE DOGS CAROUSEL ── */}
      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715] relative">
        <BlobDecoration color="pink" size={300} className="-bottom-16 -left-16 opacity-20 dark:opacity-6" />
        <div className="relative z-10 max-w-300 mx-auto">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              label={dogsSectionHeader.label}
              title={dogsSectionHeader.title}
              description={dogsSectionHeader.description}
            />
            <Link
              href="/adopt/available"
              className="hidden md:inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-6 py-2.5 text-sm font-semibold hover:bg-primary hover:text-white transition-colors shrink-0 ml-8"
            >
              View All Dogs
            </Link>
          </div>

          <Carousel
            opts={{ align: 'start', loop: true }}
            className="mx-auto"
          >
            <CarouselContent className="-ml-5">
              {dogs.map((dog, i) => (
                <CarouselItem
                  key={dog.id}
                  className="pl-5 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
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
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-6 py-2.5 text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              View All Dogs
            </Link>
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="teal" size={450} className="-bottom-36 -right-36 opacity-15 dark:opacity-4" />
        <div className="relative z-10 max-w-300 mx-auto">
          <SectionHeader
            label={eventsSectionHeader.label}
            title={eventsSectionHeader.title}
            description={eventsSectionHeader.description}
            align="center"
            className="mb-10"
          />

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0 md:justify-center md:flex-wrap md:overflow-visible md:pb-0">
            {events.filter((e) => e.showUpcoming).slice(0, 4).map((event, i) => (
              <FadeIn key={event.id} delay={i * 80} className="min-w-70 snap-start md:min-w-0 md:w-70">
                <EventCard event={event} index={i} />
              </FadeIn>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-6 py-2.5 text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* ── VOLUNTEER ── */}
      <section className="py-20 px-5 md:py-24 bg-card">
        <div className="max-w-300 mx-auto">
          <FadeIn>
            <div className="bg-linear-to-br from-[#00444b] via-[#005a63] to-[#2d7a81] dark:from-[#0a2e32] dark:via-[#0e3a40] dark:to-[#0c3438] rounded-4xl p-10 md:p-14 lg:p-16 text-white relative overflow-hidden shadow-[0_8px_40px_rgba(0,68,75,0.25)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] border border-white/6">
              <BlobDecoration color="teal" size={300} className="-bottom-24 -right-24 opacity-15 dark:opacity-8" />
              <BlobDecoration color="salmon" size={200} className="-top-16 -left-16 opacity-10 dark:opacity-5" />

              <div className="relative z-10 md:grid md:grid-cols-2 md:gap-10 md:items-center">
                <div>
                  <p className="font-sans font-bold text-xs uppercase tracking-[2.5px] text-secondary mb-3">
                    {volunteerSectionHeader.label}
                  </p>
                  <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-wider uppercase text-white mb-3">
                    {volunteerSectionHeader.title}
                  </h2>
                  <p className="text-[1.05rem] text-white/80 leading-relaxed max-w-125 mb-7">
                    {volunteerSectionHeader.description}
                  </p>
                  <Link
                    href="/volunteer"
                    className="inline-flex items-center gap-2 rounded-full bg-white text-[#00444b] px-8 py-3.5 font-semibold hover:bg-secondary transition-colors"
                  >
                    Get Involved
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8 md:mt-0">
                  {shuffledRoles.map((role) => (
                    <div
                      key={role.title}
                      className="bg-white/10 rounded-2xl p-4 text-center border border-white/10 hover:bg-white/15 hover:-translate-y-0.5 transition-all"
                    >
                      <div className="text-xl mb-1.5">{role.icon}</div>
                      <span className="text-xs font-semibold">{role.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
