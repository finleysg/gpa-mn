"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import type { DogImage } from "@/app/_data/dogs"

const MAX_HEIGHT = 384
const SCROLL_AMOUNT = 400

export function DogImageCarousel({ images, name }: { images: DogImage[]; name: string }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 0)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }, [])

    useEffect(() => {
        updateScrollState()
        const el = scrollRef.current
        if (!el) return
        el.addEventListener("scroll", updateScrollState, { passive: true })
        const observer = new ResizeObserver(updateScrollState)
        observer.observe(el)
        return () => {
            el.removeEventListener("scroll", updateScrollState)
            observer.disconnect()
        }
    }, [updateScrollState])

    const scroll = (direction: "left" | "right") => {
        scrollRef.current?.scrollBy({
            left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
            behavior: "smooth",
        })
    }

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                className="scrollbar-none flex flex-col gap-3 md:h-96 md:flex-row md:overflow-x-auto md:overflow-y-hidden"
            >
                {images.map((img) => {
                    const aspect = img.width / img.height
                    const desktopHeight = Math.min(img.height, MAX_HEIGHT)
                    const desktopWidth = Math.round(desktopHeight * aspect)

                    return (
                        <Image
                            key={img.id}
                            src={img.url}
                            alt={name}
                            width={img.width}
                            height={img.height}
                            sizes={`(max-width: 768px) 100vw, ${desktopWidth}px`}
                            className="w-full rounded-3xl md:h-96 md:w-auto md:shrink-0"
                        />
                    )
                })}
            </div>

            {canScrollLeft && (
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 absolute top-1/2 left-3 -translate-y-1/2 rounded-full backdrop-blur-sm"
                    onClick={() => scroll("left")}
                    aria-label="Previous image"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
            )}

            {canScrollRight && (
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 absolute top-1/2 right-3 -translate-y-1/2 rounded-full backdrop-blur-sm"
                    onClick={() => scroll("right")}
                    aria-label="Next image"
                >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
            )}
        </div>
    )
}
