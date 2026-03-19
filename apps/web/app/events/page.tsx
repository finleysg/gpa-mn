import { getEvents, getPageHeader, getSectionHeader } from '@/app/_lib/content';
import { PageHero } from '@/app/_components/page-hero';
import { EventCard } from '@/app/_components/event-card';
import { EventCalendar } from '@/app/_components/event-calendar';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const [events, pageHeader, calendarHeader] = await Promise.all([
    getEvents(),
    getPageHeader('Events'),
    getSectionHeader('Events — Calendar'),
  ]);

  return (
    <>
      <PageHero
        badge={pageHeader.badge}
        title={pageHeader.title}
        highlight={pageHeader.highlight}
        description={pageHeader.description}
        variant={pageHeader.variant}
      />

      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-300 mx-auto">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0 md:justify-center md:flex-wrap md:overflow-visible md:pb-0">
            {events.filter((e) => e.showUpcoming).map((event, i) => (
              <FadeIn key={event.id} delay={i * 60} className="min-w-70 snap-start md:min-w-0 md:w-80">
                <EventCard event={event} index={i} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* Calendar */}
      <section className="py-20 px-5 md:py-24 bg-card">
        <div className="max-w-300 mx-auto">
          <SectionHeader
            label={calendarHeader.label}
            title={calendarHeader.title}
            className="mb-10"
          />
          <EventCalendar events={events} />
        </div>
      </section>
    </>
  );
}
