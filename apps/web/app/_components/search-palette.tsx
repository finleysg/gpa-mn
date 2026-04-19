"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Fuse from "fuse.js"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@repo/ui/components/command"
import type { SearchCategory, SearchEntry } from "@/app/_lib/search-types"

type SearchPaletteProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const CATEGORY_ORDER: SearchCategory[] = ["Pages", "Volunteer", "Events"]

const FUSE_OPTIONS = {
    includeScore: true,
    threshold: 0.4,
    ignoreLocation: true,
    keys: [
        { name: "title", weight: 0.6 },
        { name: "keywords", weight: 0.25 },
        { name: "description", weight: 0.15 },
    ],
}

export function SearchPalette({ open, onOpenChange }: SearchPaletteProps) {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [entries, setEntries] = useState<SearchEntry[] | null>(null)
    const [loading, setLoading] = useState(false)
    const fetchedRef = useRef(false)

    useEffect(() => {
        if (!open || fetchedRef.current) return
        fetchedRef.current = true
        setLoading(true)
        fetch("/api/search/manifest")
            .then((res) => res.json())
            .then((data: { entries: SearchEntry[] }) => setEntries(data.entries))
            .catch(() => setEntries([]))
            .finally(() => setLoading(false))
    }, [open])

    useEffect(() => {
        if (!open) setQuery("")
    }, [open])

    const fuse = useMemo(() => (entries ? new Fuse(entries, FUSE_OPTIONS) : null), [entries])

    const results = useMemo(() => {
        if (!entries) return []
        const trimmed = query.trim()
        if (!trimmed) return entries
        if (!fuse) return []
        return fuse.search(trimmed).map((r) => r.item)
    }, [entries, fuse, query])

    const grouped = useMemo(() => {
        const map = new Map<SearchCategory, SearchEntry[]>()
        for (const entry of results) {
            const list = map.get(entry.category) ?? []
            list.push(entry)
            map.set(entry.category, list)
        }
        return CATEGORY_ORDER.filter((c) => map.has(c)).map(
            (c) => [c, map.get(c)!] as [SearchCategory, SearchEntry[]],
        )
    }, [results])

    const handleSelect = (href: string) => {
        onOpenChange(false)
        router.push(href)
    }

    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Search"
            description="Search pages, volunteer roles, and events"
        >
            <CommandInput
                placeholder="Search pages, events, and more…"
                value={query}
                onValueChange={setQuery}
            />
            <CommandList>
                {!entries && loading && (
                    <div className="text-muted-foreground py-6 text-center text-sm">Loading…</div>
                )}
                {entries && results.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
                {grouped.map(([category, items]) => (
                    <CommandGroup key={category} heading={category}>
                        {items.map((entry) => (
                            <CommandItem
                                key={entry.id}
                                value={`${entry.title} ${entry.description ?? ""}`}
                                onSelect={() => handleSelect(entry.href)}
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-medium">{entry.title}</span>
                                    {entry.description && (
                                        <span className="text-muted-foreground text-xs">
                                            {entry.description}
                                        </span>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                ))}
            </CommandList>
        </CommandDialog>
    )
}
