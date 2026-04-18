import { redirect } from "next/navigation"
import { FOSTER_SECTION_KEYS, type FosterSectionKey } from "@repo/database"
import { getFosterApplicationByToken, getLatestFosterSections } from "@repo/database"
import { FOSTER_SECTION_CONFIG_MAP } from "@repo/types"
import { Badge } from "@repo/ui/components/badge"
import { getFosterApplicationCookie } from "../_lib/application-session"
import { SectionSummary } from "../_components/section-summary"

const STATUS_LABELS: Record<
    string,
    { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
    submitted: { label: "Submitted", variant: "default" },
    in_review: { label: "In Review", variant: "secondary" },
    approved: { label: "Approved", variant: "default" },
    denied: { label: "Denied", variant: "destructive" },
    on_hold: { label: "On Hold", variant: "outline" },
    draft: { label: "Draft", variant: "outline" },
}

export default async function StatusPage() {
    const token = await getFosterApplicationCookie()
    if (!token) redirect("/foster/apply")

    const result = await getFosterApplicationByToken(token)
    if (!result || new Date(result.token.expiresAt) < new Date()) {
        redirect("/foster/apply")
    }

    const { application } = result

    if (application.status === "draft") {
        redirect("/foster/apply/wizard")
    }

    const allSectionsRaw = await getLatestFosterSections(application.id)
    const allSectionsData: Partial<Record<FosterSectionKey, Record<string, unknown>>> = {}
    for (const { section } of allSectionsRaw) {
        allSectionsData[section.sectionKey as FosterSectionKey] = section.data as Record<
            string,
            unknown
        >
    }

    const statusInfo = STATUS_LABELS[application.status] ?? {
        label: application.status,
        variant: "outline" as const,
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="font-heading text-4xl tracking-wide">Your Foster Application</h1>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                    Your application has been submitted. You&apos;ll receive an email when the
                    status changes.
                </p>
            </div>

            <div className="mt-8 space-y-8">
                {FOSTER_SECTION_KEYS.map((key) => {
                    const config = FOSTER_SECTION_CONFIG_MAP[key]
                    const data = (allSectionsData[key] ?? {}) as Record<string, unknown>
                    if (!config) return null

                    return (
                        <section key={key} className="space-y-3">
                            <h2 className="font-heading text-2xl tracking-wide">{config.title}</h2>
                            <SectionSummary
                                sectionConfig={config}
                                data={data}
                                allSectionsData={allSectionsData}
                            />
                        </section>
                    )
                })}
            </div>
        </div>
    )
}
