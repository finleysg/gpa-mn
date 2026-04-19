"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { mainNav } from "@/app/_data/navigation"
import { SearchIcon } from "lucide-react"
import { cn } from "@repo/ui/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { MobileNav } from "./mobile-nav"
import { SearchPalette } from "./search-palette"

export function SiteHeader() {
    const [scrolled, setScrolled] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setSearchOpen((prev) => !prev)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <header className="fixed top-0 right-0 left-0 z-50 p-3">
            <div
                className={cn(
                    "bg-background/92 mx-auto flex max-w-300 items-center justify-between rounded-4xl border border-white/60 px-6 py-3 backdrop-blur-xl transition-shadow duration-300 dark:border-white/10",
                    scrolled
                        ? "shadow-[0_4px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)]"
                        : "shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]",
                )}
            >
                {/* Logo */}
                <Link href="/" className="shrink-0">
                    <Image
                        src="/images/gpa-logo-light.png"
                        alt="GPA‑MN"
                        width={140}
                        height={56}
                        className="h-10 w-auto dark:hidden"
                        priority
                    />
                    <Image
                        src="/images/gpa-logo-dark.png"
                        alt="GPA‑MN"
                        width={140}
                        height={56}
                        className="hidden h-10 w-auto dark:block"
                        priority
                    />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
                    {mainNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-muted-foreground hover:bg-accent hover:text-primary rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        className="border-input bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-2 rounded-full border px-2.5 py-2 text-sm transition-colors md:px-4"
                    >
                        <SearchIcon className="size-4" />
                        <span className="hidden md:inline">Search…</span>
                        <kbd className="bg-muted pointer-events-none ml-2 hidden items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none md:inline-flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>
                    <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
                    <ThemeToggle />
                    <Link
                        href="/adopt/available"
                        className="bg-primary hover:bg-primary/90 hidden items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors md:inline-flex"
                    >
                        Meet Our Greys
                    </Link>
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}
