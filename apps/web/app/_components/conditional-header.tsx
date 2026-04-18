"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "./site-header"

export function ConditionalHeader() {
    const pathname = usePathname()
    if (pathname.startsWith("/adopt/apply") || pathname.startsWith("/foster/apply")) return null
    return <SiteHeader />
}
