import Link from "next/link"
import Image from "next/image"
import { Badge } from "@repo/ui/components/badge"
import type { Dog } from "@/app/_data/dogs"

export function DogCard({ dog }: { dog: Dog; index?: number }) {
    return (
        <Link
            href={`/adopt/available/${dog.id}`}
            className="group bg-card border-border block overflow-hidden rounded-3xl border shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        >
            {/* Dog photo */}
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={dog.image}
                    alt={dog.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {dog.adoptionPending && (
                    <div className="absolute top-3 right-3 z-10">
                        <Badge className="rounded-full bg-amber-500 text-white hover:bg-amber-500">
                            Adoption Pending
                        </Badge>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5">
                <h3 className="font-heading mb-1 text-2xl tracking-wider uppercase">{dog.name}</h3>
                <p className="text-muted-foreground text-sm">
                    {dog.age} yr old {dog.sex}
                </p>
            </div>
        </Link>
    )
}
