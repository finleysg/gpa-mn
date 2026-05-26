import type { Metadata } from "next"
import { JotFormEmbed } from "@/app/_components/jotform-embed"

export const metadata: Metadata = {
    title: "Foster Application | GPA-MN",
    description: "Apply to foster a retired racing greyhound with GPA-MN.",
    robots: { index: false, follow: false },
}

export default function FosterApplyOriginalPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <JotFormEmbed
                formId="31265705093149"
                title="GPA MN Foster Application 8.14.25"
                initialHeight={10016}
            />
        </div>
    )
}
