import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@repo/ui/components/badge';
import type { WebEvent } from '@/app/_lib/content';

export function EventCard({ event }: { event: WebEvent; index?: number }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block bg-card rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-border hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300"
    >
      {(event.mobileImage ?? event.image) ? (
        <div className="relative h-40 overflow-hidden">
          <Image
            src={(event.mobileImage ?? event.image)!}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="h-40 bg-linear-to-br from-secondary/60 to-secondary/20 flex items-center justify-center text-sm font-semibold text-[#2d7a81] dark:text-[#3a9da6]">
          {event.title}
        </div>
      )}

      <div className="p-5 pt-4">
        <Badge
          variant="secondary"
          className="rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-secondary/30 text-[#2d7a81] dark:bg-secondary/20 dark:text-[#3a9da6] mb-2.5"
        >
          {event.type}
        </Badge>
        <h3 className="font-heading text-xl tracking-wider uppercase mb-1.5">{event.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
      </div>
    </Link>
  );
}
