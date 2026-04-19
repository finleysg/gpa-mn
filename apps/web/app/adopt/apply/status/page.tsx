import { redirect } from "next/navigation"
import { SECTION_KEYS, type SectionKey } from "@repo/database"
import { getApplicationByToken, getLatestSections } from "@repo/database"
import { SECTION_CONFIG_MAP } from "@repo/types"
import { Badge } from "@repo/ui/components/badge"
import { getApplicationCookie } from "../_lib/application-session"
import { SectionSummary } from "../_components/section-summary"

const STATUS_LABELS: Record<
    string,
    { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
    submitted: { label: "Submitted", variant: "default" },
    in_review: { label: "In Review", variant: "secondary" },
    approved: { label: "Approved", variant: "default" },
    adopted: { label: "Adopted", variant: "default" },
    denied: { label: "Denied", variant: "destructive" },
    on_hold: { label: "On Hold", variant: "outline" },
    draft: { label: "Draft", variant: "outline" },
}

export default async function StatusPage() {
    const token = await getApplicationCookie()
    if (!token) redirect("/adopt/apply")

    const result = await getApplicationByToken(token)
    if (!result || new Date(result.token.expiresAt) < new Date()) {
        redirect("/adopt/apply")
    }

    const { application } = result

    if (application.status === "draft") {
        redirect("/adopt/apply/wizard")
    }

    const allSectionsRaw = await getLatestSections(application.id)
    const allSectionsData: Partial<Record<SectionKey, Record<string, unknown>>> = {}
    for (const { section } of allSectionsRaw) {
        allSectionsData[section.sectionKey as SectionKey] = section.data as Record<string, unknown>
    }

    const statusInfo = STATUS_LABELS[application.status] ?? {
        label: application.status,
        variant: "outline" as const,
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="font-heading text-4xl tracking-wide">Your Application</h1>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                    Your application has been submitted. You&apos;ll receive an email when the
                    status changes.
                </p>
            </div>

            <div className="mt-8 space-y-8">
                {SECTION_KEYS.map((key) => {
                    const config = SECTION_CONFIG_MAP[key]
                    const data = (allSectionsData[key] ?? {}) as Record<string, unknown>
                    if (!config) return null

                    return (
                        <section
                            key={key}
                            aria-labelledby={`status-section-${key}`}
                            className="space-y-3"
                        >
                            <h2
                                id={`status-section-${key}`}
                                className="font-heading text-2xl tracking-wide"
                            >
                                {config.title}
                            </h2>
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
