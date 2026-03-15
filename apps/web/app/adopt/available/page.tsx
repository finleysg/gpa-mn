import { dogs } from '@/app/_data/dogs';
import { PageHero } from '@/app/_components/page-hero';
import { DogCard } from '@/app/_components/dog-card';
import { FadeIn } from '@/app/_components/fade-in';
import { Badge } from '@repo/ui/components/badge';

export default function AvailableDogsPage() {
  return (
    <>
      <PageHero
        badge="Available Dogs"
        title="Meet Our Greyhounds"
        highlight="Greyhounds"
        description="Each of these gentle souls is looking for their forever home. Browse our available dogs and find your perfect match."
      />

      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-[1200px] mx-auto">
          {/* Filter pills (visual only) */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            <Badge variant="outline" className="rounded-full px-4 py-1.5 text-sm cursor-pointer hover:bg-accent">All Dogs</Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm cursor-pointer bg-secondary/30">Male</Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm cursor-pointer bg-secondary/30">Female</Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm cursor-pointer bg-secondary/30">Cat Friendly</Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm cursor-pointer bg-secondary/30">Kid Friendly</Badge>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dogs.map((dog, i) => (
              <FadeIn key={dog.id} delay={i * 60}>
                <DogCard dog={dog} index={i} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
