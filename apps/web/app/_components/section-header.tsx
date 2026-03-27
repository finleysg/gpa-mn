import { cn } from "@repo/ui/lib/utils"

type SectionHeaderProps = {
    title: string
    description?: string
    align?: "left" | "center"
    className?: string
}

export function SectionHeader({
    title,
    description,
    align = "left",
    className,
}: SectionHeaderProps) {
    return (
        <div className={cn(align === "center" && "text-center", className)}>
            <h2 className="font-heading text-foreground mb-4 text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.1] tracking-wider uppercase">
                {title}
            </h2>
            {description && (
                <p
                    className={cn(
                        "text-muted-foreground max-w-150 text-[1.05rem] leading-relaxed",
                        align === "center" && "mx-auto",
                    )}
                >
                    {description}
                </p>
            )}
        </div>
    )
}
