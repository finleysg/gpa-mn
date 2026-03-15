import { events } from '@/app/_data/events';
import { PageHero } from '@/app/_components/page-hero';
import { EventCard } from '@/app/_components/event-card';
import { FadeIn } from '@/app/_components/fade-in';

export default function EventsPage() {
  return (
    <>
      <PageHero
        badge="Join Us"
        title="Upcoming Events"
        highlight="Events"
        description="From our signature fundraiser to casual weekend walks, there are plenty of ways to connect with our community and the greyhounds."
      />

      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <FadeIn key={event.id} delay={i * 60}>
                <EventCard event={event} index={i} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
