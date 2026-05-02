import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Foster Application | GPA-MN",
    description: "Apply to foster a retired racing greyhound with GPA-MN.",
    robots: { index: false, follow: false },
}

export default function FosterApplyOriginalPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <iframe
                title="GPA MN Foster Application 8.14.25"
                src="https://form.jotform.com/31265705093149"
                allow="geolocation; microphone; camera; fullscreen; payment"
                name="31265705093149"
                id="31265705093149"
                scrolling="no"
                style={{
                    width: "10px",
                    minWidth: "100%",
                    display: "block",
                    overflow: "hidden",
                    height: "10016px",
                    border: "none",
                }}
            />
        </div>
    )
}
