import type { MetadataRoute } from "next"
import { getLatestVersions } from "@repo/database"
import type { PageData } from "@repo/types"
import { getEvents } from "./_lib/content"
import { fetchDogs } from "./_lib/rescue-groups"

export const revalidate = 3600

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:6000"

const staticRoutes: {
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
    priority: number
}[] = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: "/adopt", changeFrequency: "weekly", priority: 0.9 },
    { path: "/adopt/available", changeFrequency: "daily", priority: 0.9 },
    { path: "/adopt/why-gpa-mn", changeFrequency: "monthly", priority: 0.7 },
    { path: "/adopt/our-process", changeFrequency: "monthly", priority: 0.7 },
    { path: "/adopt/support", changeFrequency: "monthly", priority: 0.6 },
    { path: "/volunteer", changeFrequency: "weekly", priority: 0.8 },
    { path: "/donate", changeFrequency: "weekly", priority: 0.8 },
    { path: "/events", changeFrequency: "weekly", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about/contact", changeFrequency: "yearly", priority: 0.6 },
    { path: "/lost-hound", changeFrequency: "yearly", priority: 0.5 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    const [pages, events, dogs] = await Promise.all([
        safe(() => getLatestVersions("page"), []),
        safe(() => getEvents(), []),
        safe(() => fetchDogs(), []),
    ])

    const cmsEntries: MetadataRoute.Sitemap = pages.map((p) => {
        const data = p.version.data as PageData
        return {
            url: `${siteUrl}/${data.section}/${p.item.slug}`,
            lastModified: p.version.createdAt ?? now,
            changeFrequency: "monthly",
            priority: 0.6,
        }
    })

    const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
        url: `${siteUrl}/events/${event.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
    }))

    const dogEntries: MetadataRoute.Sitemap = dogs.map((dog) => ({
        url: `${siteUrl}/adopt/available/${dog.id}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.5,
    }))

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
        url: `${siteUrl}${r.path}`,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }))

    return [...staticEntries, ...cmsEntries, ...eventEntries, ...dogEntries]
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try {
        return await fn()
    } catch {
        return fallback
    }
}
