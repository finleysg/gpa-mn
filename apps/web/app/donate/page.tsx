import { getDonationOptions, getPageHeader, getSectionHeader } from "@/app/_lib/content"
import { PageHero } from "@/app/_components/page-hero"
import { SectionHeader } from "@/app/_components/section-header"
import { FadeIn } from "@/app/_components/fade-in"
import { BlobDecoration } from "@/app/_components/blob-decoration"
import { MarkdownContent } from "@/app/_components/markdown-content"

export const dynamic = "force-dynamic"

export default async function DonatePage() {
    const [donationOptions, pageHeader, waysHeader] = await Promise.all([
        getDonationOptions(),
        getPageHeader("Donate"),
        getSectionHeader("Donate — Ways to Give"),
    ])

    return (
        <>
            <PageHero
                title={pageHeader.title}
                highlight={pageHeader.highlight}
                description={pageHeader.description}
                variant={pageHeader.variant}
            />

            {/* Donation methods */}
            <section className="bg-card relative overflow-hidden px-5 py-20 md:py-24">
                <BlobDecoration
                    color="salmon"
                    size={350}
                    className="-top-20 -left-20 opacity-15 dark:opacity-4"
                />
                <BlobDecoration
                    color="teal"
                    size={300}
                    className="-right-20 -bottom-20 opacity-20 dark:opacity-4"
                />

                <div className="relative z-10 mx-auto max-w-300">
                    <SectionHeader
                        title={waysHeader.title}
                        description={waysHeader.description}
                        align="center"
                        className="mb-12"
                    />

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {donationOptions.map((method, i) => (
                            <FadeIn key={method.title} delay={i * 60}>
                                <div className="border-border h-full rounded-3xl border bg-[#FAF5F0] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:bg-[#1a1715] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
                                    <div className="mb-3 text-2xl">{method.icon}</div>
                                    <h3 className="font-heading mb-2 text-xl tracking-wider uppercase">
                                        {method.title}
                                    </h3>
                                    <MarkdownContent
                                        content={method.description}
                                        className="text-muted-foreground text-sm leading-relaxed [&>p]:mb-0"
                                    />
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
