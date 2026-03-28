import Link from "next/link"
import { getAboutPage, getPageHeader, getSectionHeader } from "@/app/_lib/content"
import { PageHero } from "@/app/_components/page-hero"
import { SectionHeader } from "@/app/_components/section-header"
import { FadeIn } from "@/app/_components/fade-in"
import { BlobDecoration } from "@/app/_components/blob-decoration"
import { MarkdownContent } from "@/app/_components/markdown-content"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
    const [aboutPage, pageHeader, linksHeader] = await Promise.all([
        getAboutPage(),
        getPageHeader("About"),
        getSectionHeader("About — Learn More"),
    ])

    return (
        <>
            <PageHero
                title={pageHeader.title}
                highlight={pageHeader.highlight}
                description={pageHeader.description}
                variant={pageHeader.variant}
            />

            {/* Overview */}
            <section className="bg-card relative overflow-hidden px-5 py-20 md:py-24">
                <BlobDecoration
                    color="teal"
                    size={350}
                    className="-top-20 -right-20 opacity-20 dark:opacity-6"
                />
                <div className="relative z-10 mx-auto max-w-200">
                    <FadeIn>
                        {aboutPage?.body && (
                            <MarkdownContent
                                content={aboutPage.body}
                                className="prose prose-lg text-muted-foreground max-w-none leading-relaxed"
                            />
                        )}
                    </FadeIn>
                </div>
            </section>

            {/* Links */}
            <section className="bg-[#FAF5F0] px-5 py-20 md:py-24 dark:bg-[#1a1715]">
                <div className="mx-auto max-w-200">
                    <SectionHeader title={linksHeader.title} align="center" className="mb-12" />
                    <div className="flex justify-center">
                        {[
                            {
                                href: "/about/contact",
                                title: "Contact Us",
                                desc: "Get in touch with questions, feedback, or to learn more about our work.",
                                icon: "📬",
                            },
                        ].map((link) => (
                            <FadeIn key={link.href} className="w-full max-w-sm">
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
