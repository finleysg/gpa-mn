import { cn } from "@repo/ui/lib/utils"
import { BlobDecoration } from "./blob-decoration"

type PageHeroProps = {
    title: string
    highlight?: string
    description?: string
    children?: React.ReactNode
    className?: string
    variant?: "default" | "urgent"
}

export function PageHero({
    title,
    highlight,
    description,
    children,
    className,
    variant = "default",
}: PageHeroProps) {
    const parts = highlight ? title.split(highlight) : [title]

    return (
        <section
            className={cn(
                "relative overflow-hidden px-5 pt-36 pb-20 md:pt-44 md:pb-24",
                variant === "default" &&
                    "to-secondary/30 bg-linear-to-br from-[#FAF5F0] via-[#f0ebe4] via-60% dark:from-[#1a1715] dark:via-[#1e1b17] dark:via-60% dark:to-[#152628]",
                variant === "urgent" &&
                    "to-primary/20 dark:to-primary/10 bg-linear-to-br from-[#FAF5F0] via-[#fce0dd] dark:from-[#1a1715] dark:via-[#211211]",
                className,
            )}
        >
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

            <div className="relative z-10 mx-auto max-w-300 text-center">
                <h1 className="font-heading text-foreground mb-5 text-[clamp(2.8rem,7vw,4.8rem)] leading-[1.1] tracking-wider uppercase">
                    {highlight ? (
                        <>
                            {parts[0]}
                            <em className="text-primary not-italic">{highlight}</em>
                            {parts[1]}
                        </>
                    ) : (
                        title
                    )}
                </h1>

                {description && (
                    <p className="text-muted-foreground mx-auto mb-8 max-w-130 text-lg leading-relaxed">
                        {description}
                    </p>
                )}

                {children}
            </div>
        </section>
    )
}
