import { donationMethods } from '@/app/_data/donation-options';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';
import { BlobDecoration } from '@/app/_components/blob-decoration';

export default function DonatePage() {
  return (
    <>
      <PageHero
        badge="Support Our Mission"
        title="Help Us Save More Greyhounds"
        highlight="Save More Greyhounds"
        description="Your generous donation helps cover veterinary care, foster supplies, transportation, and everything needed to give these gentle dogs a second chance at life."
      />

      {/* Donation methods */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="salmon" size={350} className="-top-20 -left-20 opacity-15 dark:opacity-4" />
        <BlobDecoration color="teal" size={300} className="-bottom-20 -right-20 opacity-20 dark:opacity-4" />

        <div className="relative z-10 max-w-300 mx-auto">
          <SectionHeader
            label="Ways to Give"
            title="Choose How to Help"
            description="There are many ways to support GPA-MN's mission. Every contribution makes a difference in the lives of retired racing greyhounds."
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {donationMethods.map((method, i) => (
              <FadeIn key={method.title} delay={i * 60}>
                <div className="bg-[#FAF5F0] dark:bg-[#1a1715] rounded-3xl p-6 border border-border shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)] h-full hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all">
                  <div className="text-2xl mb-3">{method.icon}</div>
                  <h3 className="font-heading text-xl tracking-wider uppercase mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{method.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tax info */}
      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-150 mx-auto text-center">
          <FadeIn>
            <div className="bg-card rounded-4xl p-10 border border-border shadow-[0_6px_28px_rgba(156,47,48,0.08)] dark:shadow-[0_6px_28px_rgba(0,0,0,0.2)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#ff8f89] via-primary to-[#ff8f89]" />
              <div className="text-4xl mb-4">🩺</div>
              <h2 className="font-heading text-[clamp(1.8rem,4vw,2.5rem)] tracking-wider uppercase mb-3">
                Heal a Hound Fund
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Some greyhounds arrive with injuries or medical conditions that require extraordinary care. The Heal a Hound Fund covers these special veterinary expenses so no greyhound is left behind.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(156,47,48,0.25)]"
              >
                Contribute to Heal a Hound
              </a>
              <p className="text-xs text-muted-foreground mt-6">
                GPA-MN is a 501(c)(3) nonprofit organization. All donations are 100% tax-deductible.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
