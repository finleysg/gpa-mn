import type { Metadata } from "next"
import { Phone, AlertTriangle } from "lucide-react"
import { getLostHoundSuggestions, getPageHeader, getSectionHeader } from "@/app/_lib/content"
import { PageHero } from "@/app/_components/page-hero"
import { SectionHeader } from "@/app/_components/section-header"
import { FadeIn } from "@/app/_components/fade-in"
import { BlobDecoration } from "@/app/_components/blob-decoration"
import { MarkdownContent } from "@/app/_components/markdown-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Lost Hound Help",
    description:
        "Lost greyhound? Step-by-step guidance to get your hound home, plus prevention tips and the GPA-MN lost-hound hotline.",
    alternates: { canonical: "/lost-hound" },
}

const immediateSteps = [
    "Stay calm. Greyhounds can sense panic and may run further.",
    "Search the immediate area — check behind bushes, under decks, and in neighboring yards.",
    "Leave your front door open with food and a familiar blanket outside.",
    "Ask neighbors to check their yards, garages, and sheds.",
    "Post to social media immediately — the MN Greyhound community is incredibly responsive.",
    "Contact GPA‑MN at 763-785-4000 to activate our lost hound network.",
    "File a lost pet report with local animal control and nearby shelters.",
    "Put up flyers with a clear photo in the surrounding neighborhood.",
]

export default async function LostHoundPage() {
    const [preventionTips, pageHeader, stepsHeader, preventionHeader] = await Promise.all([
        getLostHoundSuggestions(),
        getPageHeader("Lost Hound"),
        getSectionHeader("Lost Hound — Act Now"),
        getSectionHeader("Lost Hound — Prevention"),
    ])

    return (
        <>
            <PageHero
                variant={pageHeader.variant}
                title={pageHeader.title}
                highlight={pageHeader.highlight}
                description={pageHeader.description}
            />

            {/* Emergency banner */}
            <section className="bg-primary px-5 py-6 text-white">
                <div className="mx-auto flex max-w-300 flex-col items-center justify-center gap-4 text-center md:flex-row md:text-left">
                    <AlertTriangle className="size-8 shrink-0" />
                    <div>
                        <p className="font-heading text-2xl tracking-wider uppercase">
                            Call us immediately
                        </p>
                        <p className="text-sm text-white/80">
                            Our volunteer network can help spread the word fast
                        </p>
                    </div>
                    <a
                        href="tel:763-785-4000"
                        className="text-primary inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-3 font-bold transition-colors hover:bg-white/90"
                    >
                        <Phone className="size-4" />
                        763-785-4000
                    </a>
                </div>
            </section>

            {/* Immediate steps */}
            <section className="bg-card relative overflow-hidden px-5 py-20 md:py-24">
                <BlobDecoration
                    color="primary"
                    size={300}
                    className="-top-16 -right-16 opacity-10 dark:opacity-5"
                />
                <div className="relative z-10 mx-auto max-w-200">
                    <FadeIn>
                        <SectionHeader title={stepsHeader.title} />
                        <ol className="mt-8 space-y-4">
                            {immediateSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <span className="bg-primary font-heading flex h-8 w-8 min-w-8 items-center justify-center rounded-full text-lg text-white">
                                        {i + 1}
                                    </span>
                                    <span className="text-muted-foreground pt-1 leading-relaxed">
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </FadeIn>
                </div>
            </section>

            {/* Prevention */}
            <section className="bg-[#FAF5F0] px-5 py-20 md:py-24 dark:bg-[#1a1715]">
                <div className="mx-auto max-w-300">
                    <SectionHeader
                        title={preventionHeader.title}
                        description={preventionHeader.description}
                        align="center"
                        className="mb-12"
                    />

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {preventionTips.map((tip, i) => (
                            <FadeIn key={tip.title} delay={i * 60}>
                                <div className="bg-card border-border h-full rounded-3xl border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
                                    <div className="mb-3 text-2xl">{tip.icon}</div>
                                    <h3 className="font-heading mb-2 text-xl tracking-wider uppercase">
                                        {tip.title}
                                    </h3>
                                    <MarkdownContent
                                        content={tip.description}
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
