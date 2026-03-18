import Link from 'next/link';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';
import { BlobDecoration } from '@/app/_components/blob-decoration';

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="About Us"
        title="About GPA-Minnesota"
        highlight="GPA-Minnesota"
        description="Greyhound Pets of America — Minnesota is an all-volunteer, 501(c)(3) nonprofit organization dedicated to finding loving homes for retired racing greyhounds in the Twin Cities area."
      />

      {/* Overview */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="teal" size={350} className="-top-20 -right-20 opacity-20 dark:opacity-6" />
        <div className="relative z-10 max-w-200 mx-auto">
          <FadeIn>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
              <p>
                Since 1989, GPA-MN has been placing retired racing greyhounds in loving forever families throughout Minnesota. We believe that successful, life-long adoptions are achieved by carefully and thoughtfully considering each match between dog and family.
              </p>
              <p>
                We are a foster-home based organization, meaning every greyhound in our care lives in a volunteer&apos;s home rather than a kennel. This allows each dog to adjust to home life — learning about stairs, glass doors, couches, and the simple joy of being a pet — before joining their forever family.
              </p>
              <p>
                Our organization runs entirely on the dedication of volunteers who share a passion for these gentle, elegant dogs. From fostering and transport to events and fundraising, every aspect of GPA-MN is powered by people who care deeply about greyhound welfare.
              </p>
              <p>
                Over the past three decades, we have placed approximately 2,000 greyhounds with families across the Twin Cities and beyond. Each placement is a success story, and we remain committed to supporting our adopters throughout the lifetime of their greyhound.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Links */}
      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-200 mx-auto">
          <SectionHeader
            label="Learn More"
            title="Explore Our Story"
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
