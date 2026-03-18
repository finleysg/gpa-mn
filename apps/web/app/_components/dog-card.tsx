import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@repo/ui/components/badge';
import type { Dog } from '@/app/_data/dogs';

export function DogCard({ dog }: { dog: Dog; index?: number }) {
  return (
    <Link
      href={`/adopt/available/${dog.id}`}
      className="group block bg-card rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-border hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300"
    >
      {/* Dog photo */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={dog.image}
          alt={dog.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
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
