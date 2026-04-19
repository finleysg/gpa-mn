import Link from "next/link"
import type { Metadata } from "next"
import { getWhyGreyhounds, getPageHeader, getSectionHeader } from "@/app/_lib/content"
import { PageHero } from "@/app/_components/page-hero"
import { SectionHeader } from "@/app/_components/section-header"
import { FadeIn } from "@/app/_components/fade-in"
import { BlobDecoration } from "@/app/_components/blob-decoration"
import { MarkdownContent } from "@/app/_components/markdown-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Adopt a Greyhound",
    description:
        "Adopt a retired racing greyhound from GPA-MN. Learn why greyhounds make exceptional pets and start the adoption process.",
    alternates: { canonical: "/adopt" },
}

const links = [
    {
        href: "/adopt/available",
        title: "Available Dogs",
        desc: "Browse our current greyhounds looking for forever homes.",
        icon: "🐾",
    },
    {
        href: "/adopt/our-process",
        title: "Our Process",
        desc: "Learn about our four-step adoption process and what to expect.",
        icon: "📋",
    },
    {
        href: "/adopt/why-gpa-mn",
        title: "Why GPA-MN?",
        desc: "Learn what makes GPA-MN a trusted, NGA-endorsed adoption organization.",
        icon: "⭐",
    },
    {
        href: "/adopt/support",
        title: "Post-Adoption Support",
        desc: "Resources and community support for after you bring your greyhound home.",
        icon: "💛",
    },
]

export default async function AdoptPage() {
    const [whyGreyhounds, pageHeader, whyHeader, linksHeader] = await Promise.all([
        getWhyGreyhounds(),
        getPageHeader("Adopt"),
        getSectionHeader("Adopt — Why Greyhounds?"),
        getSectionHeader("Adopt — Get Started"),
    ])

    return (
        <>
            <PageHero
                title={pageHeader.title}
                highlight={pageHeader.highlight}
                description={pageHeader.description}
                variant={pageHeader.variant}
            >
                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        href="/adopt/available"
                        className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors"
                    >
                        Meet Available Dogs
                    </Link>
                    <Link
                        href="/adopt/our-process"
                        className="border-primary text-primary hover:bg-primary inline-flex items-center gap-2 rounded-full border-2 px-8 py-3.5 font-semibold transition-colors hover:text-white"
                    >
                        Learn Our Process
                    </Link>
                </div>
            </PageHero>

            {/* Why Adopt */}
            <section
                aria-labelledby="adopt-why-heading"
                className="bg-card relative overflow-hidden px-5 py-20 md:py-24"
            >
                <BlobDecoration
                    color="teal"
                    size={350}
                    className="-top-20 -right-20 opacity-20 dark:opacity-6"
                />
                <div className="relative z-10 mx-auto max-w-300">
                    <SectionHeader
                        title={whyHeader.title}
                        description={whyHeader.description}
                        headingId="adopt-why-heading"
                        align="center"
                        className="mb-12"
                    />
                    <div className="grid gap-6 sm:grid-cols-2">
                        {whyGreyhounds.map((f, i) => (
                            <FadeIn key={f.title} delay={i * 80}>
                                <div className="border-border flex items-start gap-4 rounded-3xl border bg-[#FAF5F0] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:bg-[#1a1715] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
                                    <div className="bg-card flex h-12 w-12 min-w-12 items-center justify-center rounded-2xl text-xl shadow-sm dark:bg-[#242019]">
                                        {f.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-heading mb-1 text-xl tracking-wider uppercase">
                                            {f.title}
                                        </h3>
                                        <MarkdownContent
                                            content={f.description}
                                            className="text-muted-foreground text-[0.95rem] leading-relaxed [&>p]:mb-0"
                                        />
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section
                aria-labelledby="adopt-links-heading"
                className="bg-[#FAF5F0] px-5 py-20 md:py-24 dark:bg-[#1a1715]"
            >
                <div className="mx-auto max-w-300">
                    <SectionHeader
                        title={linksHeader.title}
                        headingId="adopt-links-heading"
                        align="center"
                        className="mb-12"
                    />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {links.map((link, i) => (
                            <FadeIn key={link.href} delay={i * 80}>
                                <Link
                                    href={link.href}
                                    className="bg-card border-border block rounded-3xl border p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                                >
                                    <div className="mb-4 text-3xl">{link.icon}</div>
                                    <h3 className="font-heading mb-2 text-2xl tracking-wider uppercase">
                                        {link.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {link.desc}
                                    </p>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
