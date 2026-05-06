"use client"

import { useEffect, useRef } from "react"

export function HtmlEmbed({ html, className }: { html: string; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = ref.current
        if (!container) return
        container.innerHTML = html
        // <script> tags inserted via innerHTML do not execute. Re-create them.
        const scripts = Array.from(container.querySelectorAll("script"))
        for (const old of scripts) {
            const next = document.createElement("script")
            for (const { name, value } of Array.from(old.attributes)) {
                next.setAttribute(name, value)
            }
            if (old.textContent) next.textContent = old.textContent
            old.replaceWith(next)
        }
    }, [html])

    return <div ref={ref} className={className} />
}
