import { notFound, redirect } from "next/navigation"
import type { FosterSectionKey } from "@repo/database"
import { getFosterApplicationByToken, getLatestFosterSections } from "@repo/database"
import { FOSTER_SECTION_CONFIG_MAP } from "@repo/types"
import { getFosterApplicationCookie } from "../../_lib/application-session"
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

    const sectionConfig = FOSTER_SECTION_CONFIG_MAP[sectionKey]
    if (!sectionConfig) notFound()

    const token = await getFosterApplicationCookie()
    if (!token) redirect("/foster/apply")

    const result = await getFosterApplicationByToken(token)
    if (!result || new Date(result.token.expiresAt) < new Date()) {
        redirect("/foster/apply")
    }

    const { application } = result

    const allSectionsRaw = await getLatestFosterSections(application.id)
    const completedSections = allSectionsRaw.map((s) => s.section.sectionKey) as FosterSectionKey[]

    if (!isSectionAccessible(sectionKey, completedSections)) {
        const firstIncomplete = getFirstIncompleteSectionSlug(completedSections)
        if (firstIncomplete) {
            redirect(`/foster/apply/wizard/${firstIncomplete}`)
        }
    }

    const allSectionsData: Partial<Record<FosterSectionKey, Record<string, unknown>>> = {}
    let savedData: Record<string, unknown> = {}
    for (const { section } of allSectionsRaw) {
        const data = section.data as Record<string, unknown>
        allSectionsData[section.sectionKey as FosterSectionKey] = data
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
