import { adoptionProcess } from '@/app/_data/adoption-process';
import { PageHero } from '@/app/_components/page-hero';
import { ProcessStep } from '@/app/_components/process-step';
import { FadeIn } from '@/app/_components/fade-in';
import { SectionHeader } from '@/app/_components/section-header';
import { CTASection } from '@/app/_components/cta-section';
import { BlobDecoration } from '@/app/_components/blob-decoration';

export default function OurProcessPage() {
  return (
    <>
      <PageHero
        badge="Adoption Process"
        title="Our Adoption Process"
        highlight="Adoption Process"
        description="Our primary obligation is to the dogs entrusted to our care. We've developed a thorough process over 30+ years to ensure successful, life-long adoptions."
      />

      {/* Process steps */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="teal" size={400} className="-top-24 -right-24 opacity-15 dark:opacity-5" />
        <div className="relative z-10 max-w-200 mx-auto">
          <SectionHeader
            label="Four Steps"
            title="From Application to Adoption Day"
            align="center"
            className="mb-12"
          />
          <div className="space-y-10">
            {adoptionProcess.map((step, i) => (
              <FadeIn key={step.step} delay={i * 100}>
                <ProcessStep step={step} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Important notes */}
      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-200 mx-auto">
          <FadeIn>
            <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <SectionHeader
                label="Good to Know"
                title="Before You Apply"
              />
              <ul className="mt-6 space-y-4">
                {[
                  'We carefully and thoughtfully consider each match to ensure successful, life-long adoptions.',
                  'We cannot adopt to homes with 4 or more resident pets.',
                  'A veterinary reference may be required if you have existing pets.',
                  'The adoption fee is non-refundable and covers veterinary care, spay/neuter, and dental cleaning.',
                  'All adopters are invited to join our Facebook community for ongoing support.',
                ].map((note, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        variant="warm"
        label="Ready?"
        title="Ready to Start Your Journey?"
        description="Browse our available greyhounds and find the perfect companion for your family."
        primaryAction={{ label: 'Meet Available Dogs', href: '/adopt/available' }}
        secondaryAction={{ label: 'Contact Us', href: '/about/contact' }}
      />
    </>
  );
}
