import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { events } from '@/app/_data/events';
import { Badge } from '@repo/ui/components/badge';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { BlobDecoration } from '@/app/_components/blob-decoration';

export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }));
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = events.find((e) => e.id === id);

  if (!event) notFound();

  return (
    <>
      {/* Hero image */}
      <section className="relative pt-28 pb-0 overflow-hidden">
        <div className="max-w-300 mx-auto px-5">
          {event.image ? (
            <div className="relative h-48 md:h-80 rounded-4xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
              <Image
                src={event.image}
                alt={event.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          ) : (
            <div className="h-48 md:h-80 bg-linear-to-br from-secondary/60 to-secondary/20 dark:from-[#1a3a3e] dark:to-[#253e42] rounded-4xl flex items-center justify-center text-lg font-semibold text-[#2d7a81] dark:text-[#3a9da6] shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
              {event.title}
            </div>
          )}
        </div>
      </section>

      {/* Event info */}
      <section className="py-12 px-5 md:py-16 bg-card relative overflow-hidden">
        <BlobDecoration color="teal" size={300} className="-top-16 -right-16 opacity-15 dark:opacity-5" />
        <div className="relative z-10 max-w-300 mx-auto md:grid md:grid-cols-[1fr_320px] md:gap-12">
          <div>
            <Link
              href="/events"
              className="text-sm text-muted-foreground hover:text-primary transition-colors mb-4 inline-block"
            >
              &larr; Back to Events
            </Link>

            <Badge
              variant="secondary"
              className="rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/30 text-[#2d7a81] dark:bg-secondary/20 dark:text-[#3a9da6] mb-4"
            >
              {event.type}
            </Badge>

            <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] leading-[1.1] tracking-wider uppercase text-foreground mb-6">
              {event.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {event.longDescription}
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(156,47,48,0.25)]"
            >
              Register / Learn More
            </a>
          </div>

          {/* Details sidebar */}
          <div className="mt-8 md:mt-0">
            <div className="bg-[#FAF5F0] dark:bg-[#1a1715] rounded-3xl p-6 border border-border">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-primary mt-0.5 shrink-0" />
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
  );
}
