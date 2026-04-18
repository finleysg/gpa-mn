import type { Metadata } from "next"
import { fetchDogs } from "@/app/_lib/rescue-groups"
import { PageHero } from "@/app/_components/page-hero"
import { DogCard } from "@/app/_components/dog-card"
import { FadeIn } from "@/app/_components/fade-in"
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Available Greyhounds",
    description:
        "Meet the retired racing greyhounds currently available for adoption through GPA-MN.",
    alternates: { canonical: "/adopt/available" },
}

export default async function AvailableDogsPage() {
    const dogs = await fetchDogs()

    return (
        <>
            <PageHero
                title="Meet Our Greyhounds"
                highlight="Greyhounds"
                description="Each of these gentle souls is looking for their forever home. Browse our available dogs and find your perfect match."
            />

            <section className="bg-[#FAF5F0] px-5 py-20 md:py-24 dark:bg-[#1a1715]">
                <div className="mx-auto max-w-300">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {dogs.map((dog, i) => (
                            <FadeIn key={dog.id} delay={i * 60}>
                                <DogCard dog={dog} index={i} />
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
