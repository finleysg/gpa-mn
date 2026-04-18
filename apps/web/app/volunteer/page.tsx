import {
    getVolunteerRoles,
    getPageHeader,
    getSectionHeader,
    getHeroImages,
} from "@/app/_lib/content"
import { PageHero } from "@/app/_components/page-hero"
import { SectionHeader } from "@/app/_components/section-header"
import { VolunteerRoleCard } from "@/app/_components/volunteer-role-card"
import { FadeIn } from "@/app/_components/fade-in"
import { MarkdownContent } from "@/app/_components/markdown-content"
import { CTASection } from "@/app/_components/cta-section"
import { BlobDecoration } from "@/app/_components/blob-decoration"
import { HeroImage } from "@/app/_components/hero-image"

export const dynamic = "force-dynamic"

export default async function VolunteerPage() {
    const [volunteerRoles, pageHeader, fosteringHeader, rolesHeader, heroImages] =
        await Promise.all([
            getVolunteerRoles(),
            getPageHeader("Volunteer"),
            getSectionHeader("Volunteer — Fostering"),
            getSectionHeader("Volunteer — Roles"),
            getHeroImages(),
        ])

    return (
        <>
            <PageHero
                title={pageHeader.title}
                highlight={pageHeader.highlight}
                description={pageHeader.description}
                variant={pageHeader.variant}
            />

            {/* Fostering highlight */}
            <section className="bg-card relative overflow-hidden px-5 py-20 md:py-24">
                <BlobDecoration
                    color="salmon"
                    size={400}
                    className="-top-24 -right-24 opacity-12 dark:opacity-4"
                />
                <div className="relative z-10 mx-auto max-w-300">
                    <FadeIn>
                        <div className="border-border relative overflow-hidden rounded-4xl border bg-linear-to-br from-[#FAF5F0] to-[#fdf8f3] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-12 dark:from-[#1e1b17] dark:to-[#222019] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                            <BlobDecoration
                                color="pink"
                                size={200}
                                className="-right-16 -bottom-16 opacity-30 dark:opacity-6"
                            />
                            <div className="relative z-10 md:grid md:grid-cols-2 md:items-center md:gap-10">
                                <div className="order-1 text-center md:text-left">
                                    <SectionHeader title={fosteringHeader.title} />
                                </div>
                                <div className="order-2 mt-6 md:row-span-2 md:mt-0">
                                    <HeroImage images={heroImages} />
                                </div>
                                <div className="order-3 mt-6 md:mt-0">
                                    {fosteringHeader.description && (
                                        <MarkdownContent
                                            content={fosteringHeader.description}
                                            className="prose text-muted-foreground max-w-150 text-[1.05rem] leading-relaxed [&>p]:mb-4 [&>ul]:mt-0 [&>ul]:space-y-1"
                                        />
                                    )}
                                    <div className="mt-8">
                                        <a
                                            href="mailto:fostering@gpa-mn.org"
                                            className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors"
                                        >
                                            Apply to Foster
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* All roles */}
            <section className="bg-[#FAF5F0] px-5 py-20 md:py-24 dark:bg-[#1a1715]">
                <div className="mx-auto max-w-300">
                    <SectionHeader
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
                primaryAction={{ label: "Contact Us", href: "/about/contact" }}
            />
        </>
    )
}
