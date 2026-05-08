import type { Metadata } from "next"
import {
    getAdoptionSteps,
    getPageHeader,
    getSectionHeader,
    getBeforeYouApply,
    getRequiredReading,
} from "@/app/_lib/content"
import { PageHero } from "@/app/_components/page-hero"
import { ProcessStep } from "@/app/_components/process-step"
import { FadeIn } from "@/app/_components/fade-in"
import { SectionHeader } from "@/app/_components/section-header"
import { CTASection } from "@/app/_components/cta-section"
import { BlobDecoration } from "@/app/_components/blob-decoration"
import { MarkdownContent } from "@/app/_components/markdown-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Our Adoption Process",
    description:
        "Step-by-step guide to adopting a retired racing greyhound from GPA-MN — from application to homecoming.",
    alternates: { canonical: "/adopt/our-process" },
}

export default async function OurProcessPage() {
    const [adoptionSteps, pageHeader, stepsHeader, beforeYouApply, requiredReading] =
        await Promise.all([
            getAdoptionSteps(),
            getPageHeader("Adopt / Our Process"),
            getSectionHeader("Adopt / Our Process — Steps"),
            getBeforeYouApply(),
            getRequiredReading(),
        ])

    return (
        <>
            <PageHero
                title={pageHeader.title}
                highlight={pageHeader.highlight}
                description={pageHeader.description}
                variant={pageHeader.variant}
            />

            {/* Process steps */}
            <section
                aria-labelledby="process-steps-heading"
                className="bg-card relative overflow-hidden px-5 py-20 md:py-24"
            >
                <BlobDecoration
                    color="teal"
                    size={400}
                    className="-top-24 -right-24 opacity-15 dark:opacity-5"
                />
                <div className="relative z-10 mx-auto max-w-200">
                    <SectionHeader
                        title={stepsHeader.title}
                        headingId="process-steps-heading"
                        align="center"
                        className="mb-12"
                    />
                    <div className="space-y-10">
                        {adoptionSteps.map((step, i) => (
                            <FadeIn key={step.step} delay={i * 100}>
                                <ProcessStep step={step} />
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Required reading */}
            {requiredReading.length > 0 && (
                <section
                    aria-labelledby="required-reading-heading"
                    className="bg-card px-5 py-20 md:py-24"
                >
                    <div className="mx-auto max-w-300">
                        <SectionHeader
                            title="Required Reading"
                            description="Books we recommend every prospective adopter read to better understand greyhounds and their needs."
                            headingId="required-reading-heading"
                            align="center"
                            className="mb-12"
                        />

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {requiredReading.map((book, i) => (
                                <FadeIn key={book.title} delay={i * 60}>
                                    <article className="border-border flex h-full flex-col rounded-3xl border bg-[#FAF5F0] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:bg-[#1a1715] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
                                        <div className="mb-3 text-2xl" aria-hidden="true">
                                            📖
                                        </div>
                                        <h3 className="font-heading mb-1 text-xl tracking-wider uppercase">
                                            {book.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-3 text-sm italic">
                                            by {book.author}
                                        </p>
                                        <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">
                                            {book.description}
                                        </p>
                                        <a
                                            href={book.purchaseUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center self-start rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                        >
                                            Buy on Amazon
                                        </a>
                                    </article>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Important notes */}
            <section
                aria-labelledby="before-you-apply-heading"
                className="bg-[#FAF5F0] px-5 py-20 md:py-24 dark:bg-[#1a1715]"
            >
                <div className="mx-auto max-w-200">
                    <FadeIn>
                        <div className="bg-card border-border rounded-3xl border p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-10 dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                            {beforeYouApply && (
                                <>
                                    <SectionHeader
                                        title={beforeYouApply.title}
                                        headingId="before-you-apply-heading"
                                    />
                                    <MarkdownContent
                                        content={beforeYouApply.text}
                                        className="prose text-muted-foreground mt-6 max-w-none"
                                    />
                                </>
                            )}
                        </div>
                    </FadeIn>
                </div>
            </section>

            <CTASection
                variant="warm"
                label="Ready?"
                title="Ready to Start Your Journey?"
                description="Fill out an application form. If you need more time, you can start your application now and come back to it later."
                primaryAction={{ label: "Apply Now", href: "/apply-original" }}
                secondaryAction={{ label: "Contact Us", href: "/about/contact" }}
            />
        </>
    )
}
