import { notFound, redirect } from "next/navigation"
import { type SectionKey } from "@repo/database"
import { getApplicationByToken, getLatestSections } from "@repo/database"
import { SECTION_CONFIG_MAP } from "@repo/types"
import { getApplicationCookie } from "../../_lib/application-session"
import {
    toSectionKey,
    isSectionAccessible,
    getFirstIncompleteSectionSlug,
} from "../../_lib/section-slugs"
import { WizardSectionForm } from "../../_components/wizard-section-form"

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
    const { section: slug } = await params
    const sectionKey = toSectionKey(slug)
    if (!sectionKey) notFound()

    const sectionConfig = SECTION_CONFIG_MAP[sectionKey]
    if (!sectionConfig) notFound()

    const token = await getApplicationCookie()
    if (!token) redirect("/adopt/apply")

    const result = await getApplicationByToken(token)
    if (!result || new Date(result.token.expiresAt) < new Date()) {
        redirect("/adopt/apply")
    }

    const { application } = result

    const allSectionsRaw = await getLatestSections(application.id)
    const completedSections = allSectionsRaw.map((s) => s.section.sectionKey) as SectionKey[]

    // Enforce linear progression
    if (!isSectionAccessible(sectionKey, completedSections)) {
        const firstIncomplete = getFirstIncompleteSectionSlug(completedSections)
        if (firstIncomplete) {
            redirect(`/adopt/apply/wizard/${firstIncomplete}`)
        }
    }

    // Build section data map
    const allSectionsData: Partial<Record<SectionKey, Record<string, unknown>>> = {}
    let savedData: Record<string, unknown> = {}
    for (const { section } of allSectionsRaw) {
        const data = section.data as Record<string, unknown>
        allSectionsData[section.sectionKey as SectionKey] = data
        if (section.sectionKey === sectionKey) {
            savedData = data
        }
    }

    return (
        <WizardSectionForm
            sectionConfig={sectionConfig}
            savedData={savedData}
            allSectionsData={allSectionsData}
            applicationId={application.id}
        />
    )
}
