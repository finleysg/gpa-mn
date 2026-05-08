"use client"

import { Button } from "@repo/ui/components/button"
import { ChevronUp, ChevronDown } from "lucide-react"

interface FeaturedReorderButtonsProps {
    isFirst: boolean
    isLast: boolean
    moveUp: () => Promise<void>
    moveDown: () => Promise<void>
}

export function FeaturedReorderButtons({
    isFirst,
    isLast,
    moveUp,
    moveDown,
}: FeaturedReorderButtonsProps) {
    return (
        <div className="flex gap-1">
            <form action={moveUp}>
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    disabled={isFirst}
                    aria-label="Move up"
                >
                    <ChevronUp className="h-4 w-4" />
                </Button>
            </form>
            <form action={moveDown}>
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    disabled={isLast}
                    aria-label="Move down"
                >
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </form>
        </div>
    )
}
