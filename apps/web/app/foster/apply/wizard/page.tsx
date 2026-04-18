import { redirect } from "next/navigation"
import type { FosterSectionKey } from "@repo/database"
import { getFosterApplicationByToken, getLatestFosterSections } from "@repo/database"
import { getFosterApplicationCookie } from "../_lib/application-session"
import { getFirstIncompleteSectionSlug } from "../_lib/section-slugs"

export default async function WizardIndexPage() {
    const token = await getFosterApplicationCookie()
    if (!token) redirect("/foster/apply")

    const result = await getFosterApplicationByToken(token)
    if (!result || new Date(result.token.expiresAt) < new Date()) {
        redirect("/foster/apply")
    }

    const allSections = await getLatestFosterSections(result.application.id)
    const completedSections = allSections.map((s) => s.section.sectionKey) as FosterSectionKey[]

    const firstIncompleteSlug = getFirstIncompleteSectionSlug(completedSections)
    if (firstIncompleteSlug) {
        redirect(`/foster/apply/wizard/${firstIncompleteSlug}`)
    }

    redirect("/foster/apply/review")
}
