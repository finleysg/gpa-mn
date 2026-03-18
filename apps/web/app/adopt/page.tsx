import Link from 'next/link';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';
import { BlobDecoration } from '@/app/_components/blob-decoration';

const features = [
  { icon: '🛋️', title: 'Gentle Temperament', desc: 'Greyhounds are known for being calm, quiet, and surprisingly low-energy in the home. They are the ultimate couch companion.' },
  { icon: '👨‍👩‍👧', title: 'Great with Families', desc: 'Most greyhounds are wonderful with children and adapt well to family life. Their gentle nature makes them patient and loving pets.' },
  { icon: '✂️', title: 'Low Grooming Needs', desc: 'With short coats and minimal shedding, greyhounds are easy to groom. A weekly brush and occasional bath is all they need.' },
  { icon: '🏡', title: 'Calm House Dogs', desc: 'Despite being the fastest dog breed, greyhounds are surprisingly lazy at home. They typically sleep 16–18 hours a day.' },
];

const links = [
  { href: '/adopt/available', title: 'Available Dogs', desc: 'Browse our current greyhounds looking for forever homes.', icon: '🐾' },
  { href: '/adopt/our-process', title: 'Our Process', desc: 'Learn about our four-step adoption process and what to expect.', icon: '📋' },
  { href: '/adopt/support', title: 'Post-Adoption Support', desc: 'Resources and community support for after you bring your greyhound home.', icon: '💛' },
];

export default function AdoptPage() {
  return (
    <>
      <PageHero
        badge="Adopt a Greyhound"
        title="Your New Best Friend is Waiting"
        highlight="Best Friend"
        description="Greyhounds make wonderful family pets. They are gentle, affectionate, and surprisingly low-energy couch companions. Ready to open your heart and home?"
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
            label="Why Greyhounds?"
            title="The Perfect Family Companion"
            description="Retired racing greyhounds adapt beautifully to home life. Here's what makes them such special pets."
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 80}>
                <div className="bg-[#FAF5F0] dark:bg-[#1a1715] rounded-3xl p-6 flex gap-4 items-start border border-border shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
                  <div className="w-12 h-12 min-w-12 rounded-2xl bg-card dark:bg-[#242019] flex items-center justify-center text-xl shadow-sm">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl tracking-wider uppercase mb-1">{f.title}</h3>
                    <p className="text-[0.95rem] text-muted-foreground leading-relaxed">{f.desc}</p>
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
            label="Get Started"
            title="Ready to Adopt?"
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
