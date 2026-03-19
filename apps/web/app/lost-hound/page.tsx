import { Phone, AlertTriangle } from 'lucide-react';
import { getLostHoundSuggestions, getPageHeader, getSectionHeader } from '@/app/_lib/content';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';
import { BlobDecoration } from '@/app/_components/blob-decoration';
import { MarkdownContent } from '@/app/_components/markdown-content';

export const dynamic = 'force-dynamic';

const immediateSteps = [
  'Stay calm. Greyhounds can sense panic and may run further.',
  'Search the immediate area — check behind bushes, under decks, and in neighboring yards.',
  'Leave your front door open with food and a familiar blanket outside.',
  'Ask neighbors to check their yards, garages, and sheds.',
  'Post to social media immediately — the MN Greyhound community is incredibly responsive.',
  'Contact GPA-MN at 763-785-4000 to activate our lost hound network.',
  'File a lost pet report with local animal control and nearby shelters.',
  'Put up flyers with a clear photo in the surrounding neighborhood.',
];

export default async function LostHoundPage() {
  const [preventionTips, pageHeader, stepsHeader, preventionHeader] = await Promise.all([
    getLostHoundSuggestions(),
    getPageHeader('Lost Hound'),
    getSectionHeader('Lost Hound — Act Now'),
    getSectionHeader('Lost Hound — Prevention'),
  ]);

  return (
    <>
      <PageHero
        variant={pageHeader.variant}
        badge={pageHeader.badge}
        title={pageHeader.title}
        highlight={pageHeader.highlight}
        description={pageHeader.description}
      />

      {/* Emergency banner */}
      <section className="bg-primary text-white py-6 px-5">
        <div className="max-w-300 mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          <AlertTriangle className="size-8 shrink-0" />
          <div>
            <p className="font-heading text-2xl tracking-wider uppercase">Call us immediately</p>
            <p className="text-white/80 text-sm">Our volunteer network can help spread the word fast</p>
          </div>
          <a
            href="tel:763-785-4000"
            className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-8 py-3 font-bold hover:bg-white/90 transition-colors shrink-0"
          >
            <Phone className="size-4" />
            763-785-4000
          </a>
        </div>
      </section>

      {/* Immediate steps */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="primary" size={300} className="-top-16 -right-16 opacity-10 dark:opacity-5" />
        <div className="relative z-10 max-w-200 mx-auto">
          <FadeIn>
            <SectionHeader
              label={stepsHeader.label}
              title={stepsHeader.title}
            />
            <ol className="mt-8 space-y-4">
              {immediateSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 min-w-8 rounded-full bg-primary text-white flex items-center justify-center font-heading text-lg">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground leading-relaxed pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </section>

      {/* Prevention */}
      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-300 mx-auto">
          <SectionHeader
            label={preventionHeader.label}
            title={preventionHeader.title}
            description={preventionHeader.description}
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {preventionTips.map((tip, i) => (
              <FadeIn key={tip.title} delay={i * 60}>
                <div className="bg-card rounded-3xl p-6 border border-border shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)] h-full">
                  <div className="text-2xl mb-3">{tip.icon}</div>
                  <h3 className="font-heading text-xl tracking-wider uppercase mb-2">{tip.title}</h3>
                  <MarkdownContent content={tip.description} className="text-sm text-muted-foreground leading-relaxed [&>p]:mb-0" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
