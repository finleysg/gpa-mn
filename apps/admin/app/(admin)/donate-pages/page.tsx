import { ContentListPage } from "@/app/_components/content-list-page"
import { getPageConfig } from "@/app/_lib/content-config"

const config = getPageConfig("donate")

export default function DonatePagesPage() {
    return (
        <ContentListPage
            config={config}
            filterFn={(data) => data.section === "donate"}
            augmentData={(data, slug) => ({ ...data, url: `/donate/${slug}` })}
        />
    )
}
