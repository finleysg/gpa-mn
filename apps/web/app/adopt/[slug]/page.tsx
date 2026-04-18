import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPage } from "@/app/_lib/content"
import { MarkdownContent } from "@/app/_components/markdown-content"
import { PrintButton } from "@/app/_components/print-button"
import { BlobDecoration } from "@/app/_components/blob-decoration"
import { FadeIn } from "@/app/_components/fade-in"
import { JsonLd, breadcrumbList } from "@/app/_components/json-ld"

export const dynamic = "force-dynamic"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const page = await getPage("adopt", slug)
    if (!page) return {}
    return {
        title: page.title,
        description: page.description,
        alternates: { canonical: `/adopt/${slug}` },
    }
}

export default async function AdoptContentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const page = await getPage("adopt", slug)

    if (!page) notFound()

    const crumbs = breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Adopt", path: "/adopt" },
        { name: page.title, path: `/adopt/${slug}` },
    ])

    return (
        <section className="bg-card relative overflow-hidden px-5 py-20 pt-36 md:py-24 md:pt-44">
            <JsonLd data={crumbs} />
            <BlobDecoration
                color="teal"
                size={350}
                className="-top-20 -right-20 opacity-20 dark:opacity-6"
            />
            <div className="relative z-10 mx-auto max-w-200">
                <h1 className="font-heading text-foreground mb-8 text-[clamp(2.5rem,6vw,4rem)] leading-[1.1] tracking-wider uppercase">
                    {page.title}
                </h1>
                {page.printable && (
                    <div className="mb-8 flex justify-end">
                        <PrintButton />
                    </div>
                )}
                <FadeIn>
                    <MarkdownContent
                        content={page.body}
                        className="prose prose-lg text-muted-foreground max-w-none leading-relaxed"
                    />
                </FadeIn>
            </div>
        </section>
    )
}
