import { ContentListPage } from "@/app/_components/content-list-page"
import { getPageConfig } from "@/app/_lib/content-config"

const config = getPageConfig("adopt")

export default function AdoptPagesPage() {
    return (
        <ContentListPage
            config={config}
            filterFn={(data) => data.section === "adopt"}
            augmentData={(data, slug) => ({ ...data, url: `/adopt/${slug}` })}
        />
    )
}
