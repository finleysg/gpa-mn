import { ContentListPage } from "@/app/_components/content-list-page"
import { getPageConfig } from "@/app/_lib/content-config"

const config = getPageConfig("volunteer")

export default function VolunteerPagesPage() {
    return (
        <ContentListPage
            config={config}
            filterFn={(data) => data.section === "volunteer"}
            augmentData={(data, slug) => ({ ...data, url: `/volunteer/${slug}` })}
        />
    )
}
