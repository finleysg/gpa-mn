"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/tabs"
import { FOSTER_SECTION_CONFIGS } from "@repo/types"
import type { FosterApplicationComment } from "@repo/types"
import type { FosterApplicationStatus, FosterMilestone, FosterSectionKey } from "@repo/database"
import { EnrichmentPanel } from "./enrichment-panel"
import { SectionTab } from "./section-tab"
import { DiscussionTab } from "./discussion-tab"
import { CommentsSheet } from "./comments-sheet"

interface MilestoneData {
    milestone: {
        milestone: FosterMilestone
        completedAt: Date
    }
    userName: string
}

interface FosterApplicationDetailProps {
    fosterApplicationId: number
    status: FosterApplicationStatus
    sections: Partial<Record<FosterSectionKey, Record<string, unknown>>>
    milestones: MilestoneData[]
    comments: FosterApplicationComment[]
}

const TAB_LABELS: Record<string, string> = {
    applicant_info: "Applicant",
    household: "Household",
    pre_foster: "Pre-Foster",
    home: "Home",
    current_pets: "Pets",
    foster_preferences: "Foster",
    vet_reference: "Vet",
    personal_references: "References",
    foster_agreements: "Agreements",
    final_questions: "Final",
}

export function FosterApplicationDetail({
    fosterApplicationId,
    status,
    sections,
    milestones,
    comments,
}: FosterApplicationDetailProps) {
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
                fosterApplicationId={fosterApplicationId}
                comments={comments}
                activeTab={activeTab}
            />
            <EnrichmentPanel
                fosterApplicationId={fosterApplicationId}
                status={status}
                milestones={milestones}
            />

            <Tabs defaultValue={initialTab} onValueChange={handleTabChange}>
                <TabsList className="flex-wrap">
                    {FOSTER_SECTION_CONFIGS.map((section) => (
                        <TabsTrigger key={section.key} value={section.key}>
                            {TAB_LABELS[section.key] ?? section.title}
                        </TabsTrigger>
                    ))}
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                </TabsList>

                {FOSTER_SECTION_CONFIGS.map((section) => (
                    <TabsContent
                        key={section.key}
                        value={section.key}
                        forceMount
                        className="data-[state=inactive]:hidden"
                    >
                        <SectionTab
                            sectionKey={section.key}
                            sectionData={sections[section.key] ?? {}}
                            allSectionsData={sections}
                        />
                    </TabsContent>
                ))}

                <TabsContent value="discussion" forceMount className="data-[state=inactive]:hidden">
                    <DiscussionTab fosterApplicationId={fosterApplicationId} comments={comments} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
