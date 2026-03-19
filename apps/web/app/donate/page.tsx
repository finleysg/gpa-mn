import { getDonationOptions, getPageHeader, getSectionHeader } from '@/app/_lib/content';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';
import { BlobDecoration } from '@/app/_components/blob-decoration';
import { MarkdownContent } from '@/app/_components/markdown-content';

export const dynamic = 'force-dynamic';

export default async function DonatePage() {
  const [donationOptions, pageHeader, waysHeader] = await Promise.all([
    getDonationOptions(),
    getPageHeader('Donate'),
    getSectionHeader('Donate — Ways to Give'),
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

      {/* Donation methods */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="salmon" size={350} className="-top-20 -left-20 opacity-15 dark:opacity-4" />
        <BlobDecoration color="teal" size={300} className="-bottom-20 -right-20 opacity-20 dark:opacity-4" />

        <div className="relative z-10 max-w-300 mx-auto">
          <SectionHeader
            label={waysHeader.label}
            title={waysHeader.title}
            description={waysHeader.description}
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {donationOptions.map((method, i) => (
              <FadeIn key={method.title} delay={i * 60}>
                <div className="bg-[#FAF5F0] dark:bg-[#1a1715] rounded-3xl p-6 border border-border shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)] h-full hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all">
                  <div className="text-2xl mb-3">{method.icon}</div>
                  <h3 className="font-heading text-xl tracking-wider uppercase mb-2">{method.title}</h3>
                  <MarkdownContent content={method.description} className="text-sm text-muted-foreground leading-relaxed [&>p]:mb-0" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
