import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchDog } from "@/app/_lib/rescue-groups"
import { BlobDecoration } from "@/app/_components/blob-decoration"
import { CTASection } from "@/app/_components/cta-section"
import { DogImageCarousel } from "@/app/_components/dog-image-carousel"
import { JsonLd, breadcrumbList } from "@/app/_components/json-ld"

export const revalidate = 300

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const dog = await fetchDog(id)
    if (!dog) return {}
    const description = `Meet ${dog.name}, a ${dog.age}-year-old ${dog.color.toLowerCase()} ${dog.sex.toLowerCase()} greyhound available for adoption through GPA-MN.`
    return {
        title: `Meet ${dog.name}`,
        description,
        alternates: { canonical: `/adopt/available/${id}` },
        openGraph: {
            title: `Meet ${dog.name}`,
            description,
            type: "article",
            images: dog.image ? [dog.image] : undefined,
        },
    }
}

export default async function DogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const dog = await fetchDog(id)

    if (!dog) notFound()

    const crumbs = breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Adopt", path: "/adopt" },
        { name: "Available Greyhounds", path: "/adopt/available" },
        { name: dog.name, path: `/adopt/available/${id}` },
    ])

    return (
        <>
            <JsonLd data={crumbs} />
            {/* Hero image */}
            <section className="relative overflow-hidden pt-28 pb-0">
                <div className="mx-auto max-w-300 px-5">
                    {dog.images.length > 1 ? (
                        <DogImageCarousel images={dog.images} name={dog.name} />
                    ) : (
                        <div className="relative h-64 overflow-hidden rounded-4xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] md:h-96 dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                            <Image
                                src={dog.image}
                                alt={dog.name}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1200px) 100vw, 1200px"
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Dog info */}
            <section className="bg-card relative overflow-hidden px-5 py-12 md:py-16">
                <BlobDecoration
                    color="teal"
                    size={300}
                    className="-top-16 -right-16 opacity-15 dark:opacity-5"
                />
                <div className="relative z-10 mx-auto max-w-300 md:grid md:grid-cols-[1fr_320px] md:gap-12">
                    <div>
                        <Link
                            href="/adopt/available"
                            className="text-muted-foreground hover:text-primary mb-4 inline-block text-sm transition-colors"
                        >
                            &larr; Back to Available Dogs
                        </Link>

                        <h1 className="font-heading text-foreground mb-4 text-[clamp(2.5rem,6vw,4rem)] leading-[1.1] tracking-wider uppercase">
                            {dog.name}
                        </h1>

                        <p className="text-muted-foreground mb-8 text-lg leading-relaxed whitespace-pre-line">
                            {dog.bio}
                        </p>

                        {dog.adoptionPending ? (
                            <span className="bg-muted text-muted-foreground inline-flex cursor-not-allowed items-center gap-2 rounded-full px-8 py-3.5 font-semibold">
                                Adoption Pending
                            </span>
                        ) : (
                            <Link
                                href="/adopt/our-process"
                                className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors"
                            >
                                Start Your Application
                            </Link>
                        )}
                    </div>

                    {/* Details sidebar */}
                    <div className="mt-8 md:mt-0">
                        <div className="border-border rounded-3xl border bg-[#FAF5F0] p-6 dark:bg-[#1a1715]">
                            <h2 className="font-heading mb-4 text-xl tracking-wider uppercase">
                                Details
                            </h2>
                            <dl className="space-y-3">
                                {(
                                    [
                                        ["Age", `${dog.age} years`],
                                        ["Sex", dog.sex],
                                        [
                                            "Cat Trainable",
                                            dog.catFriendly === true
                                                ? "Yes"
                                                : dog.catFriendly === false
                                                  ? "No"
                                                  : "Unknown",
                                        ],
                                        [
                                            "Ok With Dogs",
                                            dog.dogFriendly === true
                                                ? "Yes"
                                                : dog.dogFriendly === false
                                                  ? "No"
                                                  : "Unknown",
                                        ],
                                        ["Left Ear", dog.earTattoos.left ?? "—"],
                                        ["Right Ear", dog.earTattoos.right ?? "—"],
                                    ] as const
                                ).map(([label, value]) => (
                                    <div key={label} className="flex justify-between">
                                        <dt className="text-muted-foreground text-sm">{label}</dt>
                                        <dd className="text-sm font-semibold">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection
                variant="warm"
                label="Interested?"
                title={`Interested in ${dog.name}?`}
                description="Learn about our adoption process and start your application today. Our team will help match you with the perfect greyhound."
                primaryAction={{ label: "Our Adoption Process", href: "/adopt/our-process" }}
                secondaryAction={{ label: "View All Dogs", href: "/adopt/available" }}
            />
        </>
    )
}
