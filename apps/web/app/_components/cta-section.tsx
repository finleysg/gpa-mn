import Link from "next/link"
import { cn } from "@repo/ui/lib/utils"
import { BlobDecoration } from "./blob-decoration"

type CTASectionProps = {
    label?: string
    title: string
    description: string
    primaryAction?: { label: string; href: string }
    secondaryAction?: { label: string; href: string }
    variant?: "teal" | "warm" | "default"
    className?: string
    children?: React.ReactNode
    headingId?: string
}

export function CTASection({
    label,
    title,
    description,
    primaryAction,
    secondaryAction,
    variant = "default",
    className,
    children,
    headingId = "cta-section-heading",
}: CTASectionProps) {
    return (
        <section
            aria-labelledby={headingId}
            className={cn(
                "relative overflow-hidden px-5 py-20 md:py-24",
                variant === "default" && "bg-[#FAF5F0] dark:bg-[#1a1715]",
                variant === "warm" &&
                    "bg-linear-to-br from-[#FAF5F0] via-[#f5ece3] to-[#f0e8df] dark:from-[#1a1715] dark:via-[#1e1b17] dark:to-[#201d19]",
                variant === "teal" && "",
                className,
            )}
        >
            {variant !== "teal" && (
                <>
                    <BlobDecoration
                        color="salmon"
                        size={350}
                        className="-top-20 -left-20 opacity-15 dark:opacity-4"
                    />
                    <BlobDecoration
                        color="teal"
                        size={300}
                        className="-right-20 -bottom-20 opacity-20 dark:opacity-4"
                    />
                </>
            )}

            <div className="relative z-10 mx-auto max-w-300">
                {variant === "teal" ? (
                    <div className="relative overflow-hidden rounded-4xl border border-white/6 bg-linear-to-br from-[#00444b] via-[#005a63] to-[#2d7a81] p-10 text-white shadow-[0_8px_40px_rgba(0,68,75,0.25)] md:p-14 lg:p-16 dark:from-[#0a2e32] dark:via-[#0e3a40] dark:to-[#0c3438] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                        <BlobDecoration
                            color="teal"
                            size={300}
                            className="-right-24 -bottom-24 opacity-15 dark:opacity-8"
                        />
                        <BlobDecoration
                            color="salmon"
                            size={200}
                            className="-top-16 -left-16 opacity-10 dark:opacity-5"
                        />

                        <div className="relative z-10">
                            {label && (
                                <p className="text-secondary mb-3 font-sans text-xs font-bold tracking-[2.5px] uppercase">
                                    {label}
                                </p>
                            )}
                            <h2
                                id={headingId}
                                className="font-heading mb-3 text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-wider text-white uppercase"
                            >
                                {title}
                            </h2>
                            <p className="mb-7 max-w-125 text-[1.05rem] leading-relaxed text-white/80">
                                {description}
                            </p>

                            {children}

                            {(primaryAction || secondaryAction) && (
                                <div className="flex flex-wrap gap-3">
                                    {primaryAction && (
                                        <Link
                                            href={primaryAction.href}
                                            className="hover:bg-secondary inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-[#00444b] transition-colors"
                                        >
                                            {primaryAction.label}
                                        </Link>
                                    )}
                                    {secondaryAction && (
                                        <Link
                                            href={secondaryAction.href}
                                            className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
                                        >
                                            {secondaryAction.label}
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-card border-border relative overflow-hidden rounded-4xl border p-10 text-center shadow-[0_6px_28px_rgba(156,47,48,0.08)] md:p-14 dark:shadow-[0_6px_28px_rgba(0,0,0,0.2)]">
                        <div className="via-primary absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-[#ff8f89] to-[#ff8f89]" />

                        <div className="relative z-10">
                            {label && (
                                <p className="mb-3 font-sans text-xs font-bold tracking-[2.5px] text-[#2d7a81] uppercase dark:text-[#3a9da6]">
                                    {label}
                                </p>
                            )}
                            <h2
                                id={headingId}
                                className="font-heading text-foreground mb-3 text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-wider uppercase"
                            >
                                {title}
                            </h2>
                            <p className="text-muted-foreground mx-auto mb-7 max-w-125 text-[1.05rem] leading-relaxed">
                                {description}
                            </p>

                            {children}

                            {(primaryAction || secondaryAction) && (
                                <div className="flex flex-wrap justify-center gap-3">
                                    {primaryAction && (
                                        <Link
                                            href={primaryAction.href}
                                            className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors"
                                        >
                                            {primaryAction.label}
                                        </Link>
                                    )}
                                    {secondaryAction && (
                                        <Link
                                            href={secondaryAction.href}
                                            className="border-primary text-primary hover:bg-primary inline-flex items-center gap-2 rounded-full border-2 px-8 py-3.5 font-semibold transition-colors hover:text-white"
                                        >
                                            {secondaryAction.label}
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
