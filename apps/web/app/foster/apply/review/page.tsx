import { redirect } from "next/navigation"
import Link from "next/link"
import { FOSTER_SECTION_KEYS, type FosterSectionKey } from "@repo/database"
import { getFosterApplicationByToken, getLatestFosterSections } from "@repo/database"
import { FOSTER_SECTION_CONFIG_MAP } from "@repo/types"
import { Toaster } from "@repo/ui/components/sonner"
import { getFosterApplicationCookie } from "../_lib/application-session"
import { toSlug, getFirstIncompleteSectionSlug } from "../_lib/section-slugs"
import { SectionSummary } from "../_components/section-summary"
import { SubmitDialog } from "../_components/submit-dialog"

export default async function ReviewPage() {
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

    const allSectionsRaw = await getLatestFosterSections(application.id)
    const completedSections = allSectionsRaw.map((s) => s.section.sectionKey) as FosterSectionKey[]

    const firstIncomplete = getFirstIncompleteSectionSlug(completedSections)
    if (firstIncomplete) {
        redirect(`/foster/apply/wizard/${firstIncomplete}`)
    }

    const allSectionsData: Partial<Record<FosterSectionKey, Record<string, unknown>>> = {}
    for (const { section } of allSectionsRaw) {
        allSectionsData[section.sectionKey as FosterSectionKey] = section.data as Record<
            string,
            unknown
        >
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <div className="space-y-2">
                <h1 className="font-heading text-4xl tracking-wide">Review Your Application</h1>
                <p className="text-muted-foreground text-sm">
                    Please review your answers below. You can edit any section before submitting.
                </p>
            </div>

            <div className="mt-8 space-y-8">
                {FOSTER_SECTION_KEYS.map((key) => {
                    const config = FOSTER_SECTION_CONFIG_MAP[key]
                    const data = (allSectionsData[key] ?? {}) as Record<string, unknown>
                    if (!config) return null

                    return (
                        <section
                            key={key}
                            aria-labelledby={`foster-review-section-${key}`}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <h2
                                    id={`foster-review-section-${key}`}
                                    className="font-heading text-2xl tracking-wide"
                                >
                                    {config.title}
                                </h2>
                                <Link
                                    href={`/foster/apply/wizard/${toSlug(key)}`}
                                    className="text-primary text-sm hover:underline"
                                >
                                    Edit
                                </Link>
                            </div>
                            <SectionSummary
                                sectionConfig={config}
                                data={data}
                                allSectionsData={allSectionsData}
                            />
                        </section>
                    )
                })}
            </div>

            <div className="mt-10">
                <SubmitDialog applicationId={application.id} />
            </div>
            <Toaster position="top-center" />
        </div>
    )
}
