import { redirect } from "next/navigation"
import { type SectionKey } from "@repo/database"
import { getApplicationByToken, getLatestSections } from "@repo/database"
import { getApplicationCookie } from "../_lib/application-session"
import { getFirstIncompleteSectionSlug, toSlug } from "../_lib/section-slugs"

export default async function WizardIndexPage() {
    const token = await getApplicationCookie()
    if (!token) redirect("/adopt/apply")

    const result = await getApplicationByToken(token)
    if (!result || new Date(result.token.expiresAt) < new Date()) {
        redirect("/adopt/apply")
    }

    const allSections = await getLatestSections(result.application.id)
    const completedSections = allSections.map((s) => s.section.sectionKey) as SectionKey[]

    const firstIncompleteSlug = getFirstIncompleteSectionSlug(completedSections)
    if (firstIncompleteSlug) {
        redirect(`/adopt/apply/wizard/${firstIncompleteSlug}`)
    }

    // All sections complete → go to review
    redirect("/adopt/apply/review")
}
