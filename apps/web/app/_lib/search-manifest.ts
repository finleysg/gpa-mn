import { unstable_cache } from "next/cache"
import { getEvents as dbGetEvents, getLatestVersions } from "@repo/database"
import type { PageData } from "@repo/types"
import { staticSearchEntries } from "@/app/_data/search-static"
import { volunteerRoles } from "@/app/_data/volunteer-roles"
import { SEARCH_MANIFEST_TAG, type SearchEntry } from "./search-types"

async function buildManifest(): Promise<SearchEntry[]> {
    const [events, pages] = await Promise.all([dbGetEvents(), getLatestVersions("page")])

    const eventEntries: SearchEntry[] = events.map((event) => ({
        id: `event-${event.id}`,
        title: event.title,
        description: `${event.location} — ${event.type}`,
        href: `/events/${event.id}`,
        category: "Events",
        keywords: [event.type, event.location, event.description.slice(0, 120)],
    }))

    const pageEntries: SearchEntry[] = pages.flatMap(({ item, version }) => {
        const data = version.data as PageData
        if (!data.section) return []
        return [
            {
                id: `cms-${item.id}`,
                title: data.title,
                description: data.description,
                href: `/${data.section}/${item.slug}`,
                category: "Pages",
            },
        ]
    })

    const volunteerEntries: SearchEntry[] = volunteerRoles.map((role) => ({
        id: `volunteer-${role.title.toLowerCase().replace(/\s+/g, "-")}`,
        title: role.title,
        description: role.description,
        href: "/volunteer",
        category: "Volunteer",
        keywords: [role.commitment],
    }))

    return [...staticSearchEntries, ...pageEntries, ...volunteerEntries, ...eventEntries]
}

export const getSearchManifest = unstable_cache(buildManifest, ["search-manifest"], {
    tags: [SEARCH_MANIFEST_TAG],
    revalidate: 3600,
})
