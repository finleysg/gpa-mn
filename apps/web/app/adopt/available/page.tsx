import { dogs } from "@/app/_data/dogs"
import { PageHero } from "@/app/_components/page-hero"
import { DogCard } from "@/app/_components/dog-card"
import { FadeIn } from "@/app/_components/fade-in"
import { Badge } from "@repo/ui/components/badge"

export default function AvailableDogsPage() {
    return (
        <>
            <PageHero
                title="Meet Our Greyhounds"
                highlight="Greyhounds"
                description="Each of these gentle souls is looking for their forever home. Browse our available dogs and find your perfect match."
            />

            <section className="bg-[#FAF5F0] px-5 py-20 md:py-24 dark:bg-[#1a1715]">
                <div className="mx-auto max-w-300">
                    {/* Filter pills (visual only) */}
                    <div className="mb-10 flex flex-wrap justify-center gap-2">
                        <Badge
                            variant="outline"
                            className="hover:bg-accent cursor-pointer rounded-full px-4 py-1.5 text-sm"
                        >
                            All Dogs
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-secondary/30 cursor-pointer rounded-full px-4 py-1.5 text-sm"
                        >
                            Male
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-secondary/30 cursor-pointer rounded-full px-4 py-1.5 text-sm"
                        >
                            Female
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-secondary/30 cursor-pointer rounded-full px-4 py-1.5 text-sm"
                        >
                            Cat Friendly
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-secondary/30 cursor-pointer rounded-full px-4 py-1.5 text-sm"
                        >
                            Kid Friendly
                        </Badge>
                    </div>

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
