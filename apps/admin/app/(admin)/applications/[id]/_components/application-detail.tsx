"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/tabs"
import { SECTION_CONFIGS } from "@repo/types"
import type { ApplicationComment, SectionKey } from "@repo/types"
import type { ApplicationStatus, Milestone } from "@repo/database"
import { EnrichmentPanel } from "./enrichment-panel"
import { SectionTab } from "./section-tab"
import { DiscussionTab } from "./discussion-tab"
import { CommentsSheet } from "./comments-sheet"

interface MilestoneData {
    milestone: {
        milestone: Milestone
        completedAt: Date
    }
    userName: string
}

interface AdoptionRep {
    id: string
    name: string
    email: string
}

interface ApplicationDetailProps {
    applicationId: number
    status: ApplicationStatus
    adoptionRep: string | null
    houndId: string | null
    houndName: string | null
    sections: Partial<Record<SectionKey, Record<string, unknown>>>
    milestones: MilestoneData[]
    comments: ApplicationComment[]
    adoptionReps: AdoptionRep[]
    isAdoptionRepOnly: boolean
}

const TAB_LABELS: Record<string, string> = {
    applicant_info: "Applicant",
    household: "Household",
    pre_adoption: "Pre-Adoption",
    home: "Home",
    current_pets: "Pets",
    your_greyhound: "Greyhound",
    vet_reference: "Vet",
    personal_references: "References",
    final_questions: "Final",
}

export function ApplicationDetail({
    applicationId,
    status,
    adoptionRep,
    houndId,
    houndName,
    sections,
    milestones,
    comments,
    adoptionReps,
    isAdoptionRepOnly,
}: ApplicationDetailProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialTab = searchParams.get("tab") ?? "applicant_info"
    const [activeTab, setActiveTab] = useState(initialTab)

    function handleTabChange(value: string) {
        setActiveTab(value)
        const params = new URLSearchParams(searchParams.toString())
        params.set("tab", value)
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="space-y-6">
            <CommentsSheet
                applicationId={applicationId}
                comments={comments}
                activeTab={activeTab}
            />
            <EnrichmentPanel
                applicationId={applicationId}
                status={status}
                adoptionRep={adoptionRep}
                adoptionReps={adoptionReps}
                houndId={houndId}
                houndName={houndName}
                milestones={milestones}
                isAdoptionRepOnly={isAdoptionRepOnly}
            />

            <Tabs defaultValue={initialTab} onValueChange={handleTabChange}>
                <TabsList className="flex-wrap">
                    {SECTION_CONFIGS.map((section) => (
                        <TabsTrigger key={section.key} value={section.key}>
                            {TAB_LABELS[section.key] ?? section.title}
                        </TabsTrigger>
                    ))}
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                </TabsList>

                {SECTION_CONFIGS.map((section) => (
                    <TabsContent
                        key={section.key}
                        value={section.key}
                        forceMount
                        className="data-[state=inactive]:hidden"
                    >
                        <SectionTab
                            applicationId={applicationId}
                            sectionKey={section.key}
                            sectionData={sections[section.key] ?? {}}
                            allSectionsData={sections}
                            comments={comments}
                        />
                    </TabsContent>
                ))}

                <TabsContent value="discussion" forceMount className="data-[state=inactive]:hidden">
                    <DiscussionTab applicationId={applicationId} comments={comments} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
