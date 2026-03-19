import { getAdoptionSteps, getPageHeader, getSectionHeader, getBeforeYouApply } from '@/app/_lib/content';
import { PageHero } from '@/app/_components/page-hero';
import { ProcessStep } from '@/app/_components/process-step';
import { FadeIn } from '@/app/_components/fade-in';
import { SectionHeader } from '@/app/_components/section-header';
import { CTASection } from '@/app/_components/cta-section';
import { BlobDecoration } from '@/app/_components/blob-decoration';
import { MarkdownContent } from '@/app/_components/markdown-content';

export const dynamic = 'force-dynamic';

export default async function OurProcessPage() {
  const [adoptionSteps, pageHeader, stepsHeader, beforeYouApply] = await Promise.all([
    getAdoptionSteps(),
    getPageHeader('Adopt / Our Process'),
    getSectionHeader('Adopt / Our Process — Steps'),
    getBeforeYouApply(),
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

      {/* Process steps */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="teal" size={400} className="-top-24 -right-24 opacity-15 dark:opacity-5" />
        <div className="relative z-10 max-w-200 mx-auto">
          <SectionHeader
            label={stepsHeader.label}
            title={stepsHeader.title}
            align="center"
            className="mb-12"
          />
          <div className="space-y-10">
            {adoptionSteps.map((step, i) => (
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
              {beforeYouApply && (
                <>
                  <SectionHeader label={beforeYouApply.label} title={beforeYouApply.title} />
                  <MarkdownContent content={beforeYouApply.text} className="mt-6 prose max-w-none text-muted-foreground" />
                </>
              )}
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
