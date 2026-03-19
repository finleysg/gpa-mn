import { getPostAdoptionSupport, getPageHeader, getSectionHeader } from '@/app/_lib/content';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';
import { CTASection } from '@/app/_components/cta-section';
import { MarkdownContent } from '@/app/_components/markdown-content';

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
  const [resources, pageHeader, resourcesHeader] = await Promise.all([
    getPostAdoptionSupport(),
    getPageHeader('Adopt / Support'),
    getSectionHeader('Adopt / Support — Resources'),
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

      <section className="py-20 px-5 md:py-24 bg-card">
        <div className="max-w-300 mx-auto">
          <SectionHeader
            label={resourcesHeader.label}
            title={resourcesHeader.title}
            description={resourcesHeader.description}
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r, i) => (
              <FadeIn key={r.title} delay={i * 60}>
                <div className="bg-[#FAF5F0] dark:bg-[#1a1715] rounded-3xl p-6 border border-border shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)] h-full">
                  <div className="text-2xl mb-3">{r.icon}</div>
                  <h3 className="font-heading text-xl tracking-wider uppercase mb-2">{r.title}</h3>
                  <MarkdownContent content={r.description} className="text-sm text-muted-foreground leading-relaxed [&>p]:mb-0" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        variant="teal"
        label="Need Help?"
        title="We're Here For You"
        description="Have questions about your greyhound? Our experienced volunteers and adopter community are always happy to help."
        primaryAction={{ label: 'Contact Us', href: '/about/contact' }}
        secondaryAction={{ label: 'Join Our Community', href: '#' }}
      />
    </>
  );
}
