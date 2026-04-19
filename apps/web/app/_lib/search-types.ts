export type SearchCategory = "Pages" | "Volunteer" | "Events"

export type SearchEntry = {
    id: string
    title: string
    description?: string
    href: string
    category: SearchCategory
    keywords?: string[]
}

export const SEARCH_MANIFEST_TAG = "search-manifest"
