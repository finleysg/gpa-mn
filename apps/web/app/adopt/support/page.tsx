import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { FadeIn } from '@/app/_components/fade-in';
import { CTASection } from '@/app/_components/cta-section';

const resources = [
  { icon: '📖', title: "New Hound Owner's Manual", desc: 'Everything you need to know about bringing your greyhound home — from the first night to establishing routines.' },
  { icon: '💊', title: 'Heartworm Prescription Note', desc: 'Information about heartworm prevention and how to obtain prescriptions for your adopted greyhound.' },
  { icon: '🔒', title: 'Preventing Escapes', desc: 'Tips and best practices for preventing your greyhound from getting loose, including collar and leash recommendations.' },
  { icon: '🤝', title: 'Stay Connected', desc: 'Join the MN Greyhound Playdates, Outings, Hijinks, Chat and Support Facebook group for ongoing community support.' },
  { icon: '🍽️', title: 'Feeding Guidelines', desc: 'Recommended food brands, portion sizes, and feeding schedules tailored specifically for retired racing greyhounds.' },
  { icon: '🏥', title: 'Veterinary Care', desc: 'Greyhound-specific health information including dental care, anesthesia sensitivities, and recommended vet practices in the Twin Cities.' },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        badge="Post-Adoption"
        title="Post-Adoption Support"
        highlight="Support"
        description="Congratulations on your new family member! We're here to help you and your greyhound thrive together."
      />

      <section className="py-20 px-5 md:py-24 bg-card">
        <div className="max-w-300 mx-auto">
          <SectionHeader
            label="Resources"
            title="Everything You Need"
            description="These resources will help you and your greyhound adjust to life together. Don't hesitate to reach out to the GPA-MN community with questions."
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r, i) => (
              <FadeIn key={r.title} delay={i * 60}>
                <div className="bg-[#FAF5F0] dark:bg-[#1a1715] rounded-3xl p-6 border border-border shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)] h-full">
                  <div className="text-2xl mb-3">{r.icon}</div>
                  <h3 className="font-heading text-xl tracking-wider uppercase mb-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
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
