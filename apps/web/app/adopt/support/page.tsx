import { getPostAdoptionSupport, getPageHeader, getSectionHeader } from "@/app/_lib/content"
import { PageHero } from "@/app/_components/page-hero"
import { SectionHeader } from "@/app/_components/section-header"
import { FadeIn } from "@/app/_components/fade-in"
import { CTASection } from "@/app/_components/cta-section"
import { MarkdownContent } from "@/app/_components/markdown-content"

export const dynamic = "force-dynamic"

export default async function SupportPage() {
    const [resources, pageHeader, resourcesHeader] = await Promise.all([
        getPostAdoptionSupport(),
        getPageHeader("Adopt / Support"),
        getSectionHeader("Adopt / Support — Resources"),
    ])

    return (
        <>
            <PageHero
                title={pageHeader.title}
                highlight={pageHeader.highlight}
                description={pageHeader.description}
                variant={pageHeader.variant}
            />

            <section className="bg-card px-5 py-20 md:py-24">
                <div className="mx-auto max-w-300">
                    <SectionHeader
                        title={resourcesHeader.title}
                        description={resourcesHeader.description}
                        align="center"
                        className="mb-12"
                    />

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {resources.map((r, i) => (
                            <FadeIn key={r.title} delay={i * 60}>
                                <div className="border-border h-full rounded-3xl border bg-[#FAF5F0] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:bg-[#1a1715] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
                                    <div className="mb-3 text-2xl">{r.icon}</div>
                                    <h3 className="font-heading mb-2 text-xl tracking-wider uppercase">
                                        {r.title}
                                    </h3>
                                    <MarkdownContent
                                        content={r.description}
                                        className="text-muted-foreground text-sm leading-relaxed [&>p]:mb-0"
                                    />
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
                primaryAction={{ label: "Contact Us", href: "/about/contact" }}
                secondaryAction={{ label: "Join Our Community", href: "#" }}
            />
        </>
    )
}
