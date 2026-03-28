import { PageHero } from "@/app/_components/page-hero"
import { FadeIn } from "@/app/_components/fade-in"
import { SectionHeader } from "@/app/_components/section-header"
import { cn } from "@repo/ui/lib/utils"

const milestones = [
    {
        year: "1989",
        title: "GPA‑MN Founded",
        desc: "Greyhound Pets of America — Minnesota chapter is established by a small group of dedicated greyhound enthusiasts in the Twin Cities.",
    },
    {
        year: "1992",
        title: "First 100 Placements",
        desc: "Within three years, GPA‑MN reaches 100 successful adoptions, establishing itself as a trusted resource for greyhound adoption in the region.",
    },
    {
        year: "1998",
        title: "First Greyfest",
        desc: "GPA‑MN hosts the inaugural Greyfest, bringing together greyhound families for a day of celebration. It quickly becomes the organization's signature annual event.",
    },
    {
        year: "2005",
        title: "1,000th Placement",
        desc: "A major milestone as GPA‑MN places its 1,000th retired racing greyhound in a loving forever home.",
    },
    {
        year: "2010",
        title: "Race to Raise Launched",
        desc: "The first annual Race to Raise 5K fundraiser takes place at Lake Harriet, adding a fun new way to support the organization's mission.",
    },
    {
        year: "2015",
        title: "Sunday Como Walk Tradition",
        desc: "The weekly Sunday Como Walk becomes a beloved community tradition, with dozens of greyhound families gathering every week.",
    },
    {
        year: "2020",
        title: "Adapting Through COVID",
        desc: "GPA‑MN adapts its operations during the pandemic, moving to virtual Meet & Greets and contactless adoption processes while continuing to place greyhounds.",
    },
    {
        year: "2024",
        title: "2,000th Placement",
        desc: "GPA‑MN reaches the incredible milestone of 2,000 greyhounds placed in loving homes over 35 years of dedicated volunteer service.",
    },
]

export default function HistoryPage() {
    return (
        <>
            <PageHero
                title="35+ Years of Saving Lives"
                highlight="Saving Lives"
                description="From a small group of greyhound enthusiasts to one of Minnesota's most respected adoption organizations, here's our journey."
            />

            <section className="bg-card px-5 py-20 md:py-24">
                <div className="mx-auto max-w-200">
                    <SectionHeader title="Key Milestones" align="center" className="mb-12" />

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="bg-border absolute top-0 bottom-0 left-6 w-px md:left-1/2 md:-translate-x-px" />

                        <div className="space-y-8">
                            {milestones.map((m, i) => (
                                <FadeIn key={m.year} delay={i * 80}>
                                    <div className="relative pl-16 md:grid md:grid-cols-2 md:gap-8 md:pl-0">
                                        {/* Dot */}
                                        <div className="bg-primary border-card absolute top-1 left-4.5 z-10 h-4 w-4 rounded-full border-4 md:left-1/2 md:-translate-x-1/2" />

                                        {/* Content */}
                                        <div
                                            className={cn(
                                                i % 2 === 0
                                                    ? "md:pr-8 md:text-right"
                                                    : "md:col-start-2 md:pl-8",
                                            )}
                                        >
                                            <span className="font-heading text-primary text-2xl tracking-wider">
                                                {m.year}
                                            </span>
                                            <h3 className="font-heading mt-1 mb-1 text-xl tracking-wider uppercase">
                                                {m.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {m.desc}
                                            </p>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
