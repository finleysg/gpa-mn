import Link from 'next/link';
import { Badge } from '@repo/ui/components/badge';
import type { Dog } from '@/app/_data/dogs';

const gradients = [
  'from-secondary/60 to-secondary/20',
  'from-[#ffcfca] to-[#ff8f89]/30',
  'from-[#f0ebe4] to-secondary/40',
  'from-secondary/30 to-[#c7f8fd]/40',
];

export function DogCard({ dog, index = 0 }: { dog: Dog; index?: number }) {
  const gradient = gradients[index % gradients.length];

  return (
    <Link
      href={`/adopt/available/${dog.id}`}
      className="group block bg-card rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-border hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300"
    >
      {/* Placeholder image */}
      <div
        className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-semibold text-[#2d7a81] dark:text-[#3a9da6]`}
      >
        {dog.name}&apos;s Photo
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-heading text-2xl tracking-wider uppercase mb-1">{dog.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {dog.age} yr old {dog.sex} &middot; {dog.color} &middot; {dog.weight} lbs
        </p>
        <div className="flex flex-wrap gap-1.5">
          {dog.traits.map((trait) => (
            <Badge
              key={trait}
              variant="secondary"
              className="rounded-full text-xs bg-secondary/30 text-secondary-foreground dark:bg-secondary/20"
            >
              {trait}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
