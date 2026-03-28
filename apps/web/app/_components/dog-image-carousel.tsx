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
                className="scrollbar-none flex gap-3 overflow-x-auto overflow-y-hidden"
                style={{ height: MAX_HEIGHT }}
            >
                {images.map((img) => {
                    const aspect = img.width / img.height
                    const height = Math.min(img.height, MAX_HEIGHT)
                    const width = Math.round(height * aspect)

                    return (
                        <Image
                            key={img.id}
                            src={img.url}
                            alt={name}
                            width={width}
                            height={height}
                            className="shrink-0 rounded-3xl"
                            style={{ height: MAX_HEIGHT, width: "auto" }}
                            sizes={`${width}px`}
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
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            )}

            {canScrollRight && (
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 absolute top-1/2 right-3 -translate-y-1/2 rounded-full backdrop-blur-sm"
                    onClick={() => scroll("right")}
                >
                    <ArrowRight className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}
