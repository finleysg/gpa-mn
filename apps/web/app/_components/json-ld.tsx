type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[]
type JsonLdObject = { [key: string]: JsonLdValue | undefined }

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:6000"

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, "\\u003c"),
            }}
        />
    )
}

export function breadcrumbList(crumbs: { name: string; path: string }[]): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `${siteUrl}${c.path}`,
        })),
    }
}
