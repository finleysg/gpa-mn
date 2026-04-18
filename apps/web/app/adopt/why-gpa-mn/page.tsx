import Image from "next/image"
import type { Metadata } from "next"
import { getWhyChooseUs, getPageHeader } from "@/app/_lib/content"
import type { PageHeaderData } from "@repo/types"
import { FadeIn } from "@/app/_components/fade-in"
import { BlobDecoration } from "@/app/_components/blob-decoration"
import { MarkdownContent } from "@/app/_components/markdown-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Why GPA-MN",
    description:
        "Why adopt through GPA-MN: an NGA-endorsed, all-volunteer organization with decades of experience matching greyhounds to the right homes.",
    alternates: { canonical: "/adopt/why-gpa-mn" },
}

const fallbackHeader: PageHeaderData = {
    title: "Why Choose GPA\u2011MN?",
    highlight: "GPA\u2011MN",
    description:
        "A responsible, NGA-endorsed adoption organization dedicated to finding the perfect match for every greyhound.",
}

export default async function WhyGpaMnPage() {
    const [whyChooseUs, pageHeader] = await Promise.all([
        getWhyChooseUs(),
        getPageHeader("Adopt / Why GPA-MN").catch(() => fallbackHeader),
    ])

    const highlight = pageHeader.highlight
    const parts = highlight ? pageHeader.title.split(highlight) : [pageHeader.title]

    return (
        <>
            <section className="to-secondary/30 relative overflow-hidden bg-linear-to-br from-[#FAF5F0] via-[#f0ebe4] via-60% px-5 py-20 pt-36 md:py-24 md:pt-44 dark:from-[#1a1715] dark:via-[#1e1b17] dark:via-60% dark:to-[#152628]">
                <BlobDecoration
                    color="pink"
                    size={500}
                    className="-top-24 -right-36 opacity-30 dark:opacity-8"
                />
                <BlobDecoration
                    color="teal"
                    size={400}
                    className="-bottom-24 -left-24 opacity-25 dark:opacity-6"
                />
                <div className="relative z-10 mx-auto grid max-w-200 items-center gap-10 md:grid-cols-[1fr_auto]">
                    <div className="text-center md:text-left">
                        <h1 className="font-heading text-foreground mb-5 text-[clamp(2.8rem,7vw,4.8rem)] leading-[1.1] tracking-wider uppercase">
                            {highlight ? (
                                <>
                                    {parts[0]}
                                    <em className="text-primary not-italic">{highlight}</em>
                                    {parts[1]}
                                </>
                            ) : (
                                pageHeader.title
                            )}
                        </h1>
                        {pageHeader.description && (
                            <p className="text-muted-foreground mx-auto mb-8 max-w-130 text-lg leading-relaxed md:mx-0">
                                {pageHeader.description}
                            </p>
                        )}
                    </div>
                    <div className="hidden md:block">
                        <Image
                            src="/images/events/NGAendorsementLogo.png"
                            alt="National Greyhound Association Endorsement"
                            width={240}
                            height={240}
                            className="h-auto w-56"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-card relative overflow-hidden px-5 py-20 md:py-24">
                <BlobDecoration
                    color="teal"
                    size={350}
                    className="-top-20 -right-20 opacity-20 dark:opacity-6"
                />
                <div className="relative z-10 mx-auto max-w-200">
                    <FadeIn>
                        {whyChooseUs?.body && (
                            <MarkdownContent
                                content={whyChooseUs.body}
                                className="prose prose-lg text-muted-foreground max-w-none leading-relaxed"
                            />
                        )}
                    </FadeIn>
                </div>
            </section>
        </>
    )
}
