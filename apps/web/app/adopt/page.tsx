import Link from 'next/link';
import { getWhyGreyhounds, getPageHeader, getSectionHeader } from '@/app/_lib/content';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';
import { BlobDecoration } from '@/app/_components/blob-decoration';
import { MarkdownContent } from '@/app/_components/markdown-content';

export const dynamic = 'force-dynamic';

const links = [
  { href: '/adopt/available', title: 'Available Dogs', desc: 'Browse our current greyhounds looking for forever homes.', icon: '🐾' },
  { href: '/adopt/our-process', title: 'Our Process', desc: 'Learn about our four-step adoption process and what to expect.', icon: '📋' },
  { href: '/adopt/support', title: 'Post-Adoption Support', desc: 'Resources and community support for after you bring your greyhound home.', icon: '💛' },
];

export default async function AdoptPage() {
  const [whyGreyhounds, pageHeader, whyHeader, linksHeader] = await Promise.all([
    getWhyGreyhounds(),
    getPageHeader('Adopt'),
    getSectionHeader('Adopt — Why Greyhounds?'),
    getSectionHeader('Adopt — Get Started'),
  ]);

  return (
    <>
      <PageHero
        badge={pageHeader.badge}
        title={pageHeader.title}
        highlight={pageHeader.highlight}
        description={pageHeader.description}
        variant={pageHeader.variant}
      >
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/adopt/available"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(156,47,48,0.25)]"
          >
            Meet Available Dogs
          </Link>
          <Link
            href="/adopt/our-process"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-8 py-3.5 font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Learn Our Process
          </Link>
        </div>
      </PageHero>

      {/* Why Adopt */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="teal" size={350} className="-top-20 -right-20 opacity-20 dark:opacity-6" />
        <div className="relative z-10 max-w-300 mx-auto">
          <SectionHeader
            label={whyHeader.label}
            title={whyHeader.title}
            description={whyHeader.description}
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {whyGreyhounds.map((f, i) => (
              <FadeIn key={f.title} delay={i * 80}>
                <div className="bg-[#FAF5F0] dark:bg-[#1a1715] rounded-3xl p-6 flex gap-4 items-start border border-border shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
                  <div className="w-12 h-12 min-w-12 rounded-2xl bg-card dark:bg-[#242019] flex items-center justify-center text-xl shadow-sm">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl tracking-wider uppercase mb-1">{f.title}</h3>
                    <MarkdownContent content={f.description} className="text-[0.95rem] text-muted-foreground leading-relaxed [&>p]:mb-0" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-300 mx-auto">
          <SectionHeader
            label={linksHeader.label}
            title={linksHeader.title}
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {links.map((link, i) => (
              <FadeIn key={link.href} delay={i * 80}>
                <Link
                  href={link.href}
                  className="block bg-card rounded-3xl p-8 text-center border border-border shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all"
                >
                  <div className="text-3xl mb-4">{link.icon}</div>
                  <h3 className="font-heading text-2xl tracking-wider uppercase mb-2">{link.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{link.desc}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
