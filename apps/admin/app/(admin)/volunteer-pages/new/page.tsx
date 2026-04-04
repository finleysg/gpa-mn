import { ContentForm } from "@/app/_components/content-form"
import { createContentAction } from "@/app/_actions/content"
import { getPageConfig } from "@/app/_lib/content-config"

const config = getPageConfig("volunteer")

export default function NewVolunteerPagePage() {
    const action = createContentAction.bind(null, config.contentType)

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">New {config.singular}</h1>
            <ContentForm
                contentType={config.contentType}
                action={action}
                backHref={`/${config.slug}`}
                fieldProps={{ fixedSection: "volunteer" }}
            />
        </div>
    )
}
