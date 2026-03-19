import Link from 'next/link';
import { getAboutPage, getPageHeader, getSectionHeader } from '@/app/_lib/content';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';
import { BlobDecoration } from '@/app/_components/blob-decoration';
import { MarkdownContent } from '@/app/_components/markdown-content';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [aboutPage, pageHeader, linksHeader] = await Promise.all([
    getAboutPage(),
    getPageHeader('About'),
    getSectionHeader('About — Learn More'),
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

      {/* Overview */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="teal" size={350} className="-top-20 -right-20 opacity-20 dark:opacity-6" />
        <div className="relative z-10 max-w-200 mx-auto">
          <FadeIn>
            {aboutPage?.body && (
              <MarkdownContent content={aboutPage.body} className="prose prose-lg max-w-none text-muted-foreground leading-relaxed" />
            )}
          </FadeIn>
        </div>
      </section>

      {/* Links */}
      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-200 mx-auto">
          <SectionHeader
            label={linksHeader.label}
            title={linksHeader.title}
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { href: '/about/history', title: 'Our History', desc: 'Explore the milestones and story of GPA-MN from 1989 to today.', icon: '📜' },
              { href: '/about/contact', title: 'Contact Us', desc: 'Get in touch with questions, feedback, or to learn more about our work.', icon: '📬' },
            ].map((link) => (
              <FadeIn key={link.href}>
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
