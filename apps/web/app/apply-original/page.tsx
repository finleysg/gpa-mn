import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Adoption Application | GPA-MN",
    description: "Apply to adopt a retired racing greyhound from GPA-MN.",
    robots: { index: false, follow: false },
}

export default function ApplyOriginalPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <iframe
                title="GPA MN Adoption Application 08.14.25"
                src="https://form.jotform.com/31196708017151"
                allow="geolocation; microphone; camera; fullscreen; payment"
                name="31196708017151"
                id="31196708017151"
                scrolling="no"
                style={{
                    width: "10px",
                    minWidth: "100%",
                    display: "block",
                    overflow: "hidden",
                    height: "8113px",
                    border: "none",
                }}
            />
        </div>
    )
}
