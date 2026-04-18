import { redirect } from "next/navigation"
import type { FosterSectionKey } from "@repo/database"
import { getFosterApplicationByToken, getLatestFosterSections } from "@repo/database"
import { Toaster } from "@repo/ui/components/sonner"
import { getFosterApplicationCookie } from "../_lib/application-session"
import { FosterApplicationProvider } from "../_components/application-context"
import { ProgressBar } from "../_components/progress-bar"

export default async function WizardLayout({ children }: { children: React.ReactNode }) {
    const token = await getFosterApplicationCookie()
    if (!token) redirect("/foster/apply")

    const result = await getFosterApplicationByToken(token)
    if (!result || new Date(result.token.expiresAt) < new Date()) {
        redirect("/foster/apply")
    }

    const { application } = result
    if (application.status !== "draft") {
        redirect("/foster/apply/status")
    }

    const allSections = await getLatestFosterSections(application.id)
    const completedSections = allSections.map((s) => s.section.sectionKey) as FosterSectionKey[]

    return (
        <FosterApplicationProvider
            value={{
                applicationId: application.id,
                status: application.status,
                completedSections,
            }}
        >
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <ProgressBar />
                <div className="mt-8">{children}</div>
            </div>
            <Toaster position="top-center" />
        </FosterApplicationProvider>
    )
}
