import Link from 'next/link';
import { Badge } from '@repo/ui/components/badge';
import type { Event } from '@/app/_data/events';

const gradients = [
  'from-secondary/60 to-secondary/20',
  'from-[#ffcfca] to-[#ff8f89]/30',
  'from-[#f0ebe4] to-secondary/40',
  'from-secondary/30 to-[#c7f8fd]/40',
  'from-[#ffcfca]/40 to-[#f0ebe4]',
  'from-[#c7f8fd]/30 to-secondary/50',
];

export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const gradient = gradients[index % gradients.length];

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block bg-card rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-border hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300"
    >
      <div
        className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-semibold text-[#2d7a81] dark:text-[#3a9da6]`}
      >
        {event.title} Photo
      </div>

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
