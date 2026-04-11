"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SECTION_KEYS } from "@repo/database/schema"
import { SECTION_CONFIG_MAP } from "@repo/types"
import { cn } from "@repo/ui/lib/utils"
import { useApplication } from "./application-context"
import { toSlug, isSectionAccessible } from "../_lib/section-slugs"

export function ProgressBar() {
    const pathname = usePathname()
    const { completedSections } = useApplication()

    // Extract current section from URL
    const segments = pathname.split("/")
    const currentSlug = segments[segments.length - 1]

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-1">
                {SECTION_KEYS.map((key, index) => {
                    const slug = toSlug(key)
                    const isCompleted = completedSections.includes(key)
                    const isCurrent = currentSlug === slug
                    const isAccessible = isSectionAccessible(key, completedSections)

                    const dot = (
                        <div
                            className={cn(
                                "flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                                isCurrent &&
                                    "bg-primary text-primary-foreground ring-primary/30 ring-2",
                                isCompleted && !isCurrent && "bg-primary/20 text-primary",
                                !isCompleted && !isCurrent && "bg-muted text-muted-foreground",
                            )}
                        >
                            {index + 1}
                        </div>
                    )

                    if (isAccessible && !isCurrent) {
                        return (
                            <Link
                                key={key}
                                href={`/adopt/apply/wizard/${slug}`}
                                className="group flex flex-col items-center"
                            >
                                {dot}
                            </Link>
                        )
                    }

                    return (
                        <div key={key} className="flex flex-col items-center">
                            {dot}
                        </div>
                    )
                })}
            </div>
            {/* Current section title */}
            {SECTION_KEYS.map((key) => {
                const slug = toSlug(key)
                if (currentSlug !== slug) return null
                const config = SECTION_CONFIG_MAP[key]
                return (
                    <p key={key} className="text-muted-foreground text-center text-sm">
                        {config?.title}
                    </p>
                )
            })}
        </div>
    )
}
