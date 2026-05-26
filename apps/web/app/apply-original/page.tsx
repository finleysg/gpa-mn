import type { Metadata } from "next"
import { JotFormEmbed } from "@/app/_components/jotform-embed"

export const metadata: Metadata = {
    title: "Adoption Application | GPA-MN",
    description: "Apply to adopt a retired racing greyhound from GPA-MN.",
    robots: { index: false, follow: false },
}

export default function ApplyOriginalPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <JotFormEmbed
                formId="31196708017151"
                title="GPA MN Adoption Application 08.14.25"
                initialHeight={8113}
            />
        </div>
    )
}
