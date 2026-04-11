import { redirect } from "next/navigation"
import { SECTION_KEYS, type SectionKey } from "@repo/database"
import { getApplicationByToken, getLatestSections } from "@repo/database"
import { Toaster } from "@repo/ui/components/sonner"
import { getApplicationCookie } from "../_lib/application-session"
import { ApplicationProvider } from "../_components/application-context"
import { ProgressBar } from "../_components/progress-bar"

export default async function WizardLayout({ children }: { children: React.ReactNode }) {
    const token = await getApplicationCookie()
    if (!token) redirect("/adopt/apply")

    const result = await getApplicationByToken(token)
    if (!result || new Date(result.token.expiresAt) < new Date()) {
        redirect("/adopt/apply")
    }

    const { application } = result
    if (application.status !== "draft") {
        redirect("/adopt/apply/status")
    }

    const allSections = await getLatestSections(application.id)
    const completedSections = allSections.map((s) => s.section.sectionKey) as SectionKey[]

    return (
        <ApplicationProvider
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
        </ApplicationProvider>
    )
}
