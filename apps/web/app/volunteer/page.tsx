import { getVolunteerRoles, getPageHeader, getSectionHeader } from '@/app/_lib/content';
import { PageHero } from '@/app/_components/page-hero';
import { SectionHeader } from '@/app/_components/section-header';
import { VolunteerRoleCard } from '@/app/_components/volunteer-role-card';
import { FadeIn } from '@/app/_components/fade-in';
import { CTASection } from '@/app/_components/cta-section';
import { BlobDecoration } from '@/app/_components/blob-decoration';

export const dynamic = 'force-dynamic';

export default async function VolunteerPage() {
  const [volunteerRoles, pageHeader, fosteringHeader, rolesHeader] = await Promise.all([
    getVolunteerRoles(),
    getPageHeader('Volunteer'),
    getSectionHeader('Volunteer — Fostering'),
    getSectionHeader('Volunteer — Roles'),
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

      {/* Fostering highlight */}
      <section className="py-20 px-5 md:py-24 bg-card relative overflow-hidden">
        <BlobDecoration color="salmon" size={400} className="-top-24 -right-24 opacity-12 dark:opacity-4" />
        <div className="relative z-10 max-w-300 mx-auto">
          <FadeIn>
            <div className="bg-linear-to-br from-[#FAF5F0] dark:from-[#1e1b17] to-[#fdf8f3] dark:to-[#222019] rounded-4xl p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-border relative overflow-hidden">
              <BlobDecoration color="pink" size={200} className="-bottom-16 -right-16 opacity-30 dark:opacity-6" />
              <div className="relative z-10">
                <SectionHeader
                  label={fosteringHeader.label}
                  title={fosteringHeader.title}
                  description={fosteringHeader.description}
                />
                <div className="mt-6 space-y-3">
                  {[
                    'GPA-MN covers all food, supplies, and veterinary costs',
                    'Complete a hound profile within 2 weeks describing behavior and personality',
                    'Bring foster dogs to meet potential adopters',
                    'Our experienced volunteers guide you every step of the way',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <a
                    href="mailto:fostering@gpa-mn.org"
                    className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(156,47,48,0.25)]"
                  >
                    Apply to Foster
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* All roles */}
      <section className="py-20 px-5 md:py-24 bg-[#FAF5F0] dark:bg-[#1a1715]">
        <div className="max-w-300 mx-auto">
          <SectionHeader
            label={rolesHeader.label}
            title={rolesHeader.title}
            description={rolesHeader.description}
            align="center"
            className="mb-12"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {volunteerRoles.map((role, i) => (
              <FadeIn key={role.title} delay={i * 60}>
                <VolunteerRoleCard role={role} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        variant="teal"
        label="Get Started"
        title="Ready to Make a Difference?"
        description="Contact us to learn more about volunteer opportunities or to sign up. We'd love to have you join our pack!"
        primaryAction={{ label: 'Contact Us', href: '/about/contact' }}
      />
    </>
  );
}
