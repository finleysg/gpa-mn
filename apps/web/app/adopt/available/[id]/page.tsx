import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { dogs } from '@/app/_data/dogs';
import { Badge } from '@repo/ui/components/badge';
import { BlobDecoration } from '@/app/_components/blob-decoration';
import { CTASection } from '@/app/_components/cta-section';

export function generateStaticParams() {
  return dogs.map((dog) => ({ id: dog.id }));
}

export default async function DogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dog = dogs.find((d) => d.id === id);

  if (!dog) notFound();

  return (
    <>
      {/* Hero image */}
      <section className="relative pt-28 pb-0 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="relative h-64 md:h-96 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
            <Image
              src={dog.image}
              alt={dog.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>
      </section>

      {/* Dog info */}
      <section className="py-12 px-5 md:py-16 bg-card relative overflow-hidden">
        <BlobDecoration color="teal" size={300} className="-top-16 -right-16 opacity-15 dark:opacity-5" />
        <div className="relative z-10 max-w-[1200px] mx-auto md:grid md:grid-cols-[1fr_320px] md:gap-12">
          <div>
            <Link
              href="/adopt/available"
              className="text-sm text-muted-foreground hover:text-primary transition-colors mb-4 inline-block"
            >
              &larr; Back to Available Dogs
            </Link>

            <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] leading-[1.1] tracking-wider uppercase text-foreground mb-4">
              {dog.name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {dog.traits.map((trait) => (
                <Badge
                  key={trait}
                  variant="secondary"
                  className="rounded-full text-sm bg-secondary/30 dark:bg-secondary/20"
                >
                  {trait}
                </Badge>
              ))}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{dog.bio}</p>

            <Link
              href="/adopt/our-process"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(156,47,48,0.25)]"
            >
              Start Your Application
            </Link>
          </div>

          {/* Details sidebar */}
          <div className="mt-8 md:mt-0">
            <div className="bg-[#FAF5F0] dark:bg-[#1a1715] rounded-[24px] p-6 border border-border">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Details</h2>
              <dl className="space-y-3">
                {[
                  ['Age', `${dog.age} years`],
                  ['Sex', dog.sex],
                  ['Color', dog.color],
                  ['Weight', `${dog.weight} lbs`],
                  ['Cat Friendly', dog.catFriendly ? 'Yes' : 'No'],
                  ['Kid Friendly', dog.kidFriendly ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        variant="warm"
        label="Interested?"
        title={`Interested in ${dog.name}?`}
        description="Learn about our adoption process and start your application today. Our team will help match you with the perfect greyhound."
        primaryAction={{ label: 'Our Adoption Process', href: '/adopt/our-process' }}
        secondaryAction={{ label: 'View All Dogs', href: '/adopt/available' }}
      />
    </>
  );
}
