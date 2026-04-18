"use client"

import { ApplicationSectionDisplay } from "@repo/ui/components/application-section-display"
import { Separator } from "@repo/ui/components/separator"
import { FOSTER_CONDITIONAL_RULES, FOSTER_SECTION_CONFIG_MAP } from "@repo/types"
import type { FosterApplicationComment } from "@repo/types"
import type { FosterSectionKey } from "@repo/database"
import { CommentThread } from "./comment-thread"
import { CommentForm } from "./comment-form"

interface SectionTabProps {
    fosterApplicationId: number
    sectionKey: FosterSectionKey
    sectionData: Record<string, unknown>
    allSectionsData: Partial<Record<FosterSectionKey, Record<string, unknown>>>
    comments: FosterApplicationComment[]
}

export function SectionTab({
    fosterApplicationId,
    sectionKey,
    sectionData,
    allSectionsData,
    comments,
}: SectionTabProps) {
    const sectionConfig = FOSTER_SECTION_CONFIG_MAP[sectionKey]
    const sectionComments = comments.filter((c) => c.sectionCategory === sectionKey)

    return (
        <div className="space-y-6 pt-4">
            <div>
                <h3 className="text-lg font-semibold">{sectionConfig.title}</h3>
                {sectionConfig.description && (
                    <p className="text-muted-foreground text-sm">{sectionConfig.description}</p>
                )}
            </div>

            <ApplicationSectionDisplay
                sectionConfig={sectionConfig}
                data={sectionData}
                allSectionsData={allSectionsData}
                conditionalRules={FOSTER_CONDITIONAL_RULES}
                configMap={FOSTER_SECTION_CONFIG_MAP}
            />

            <Separator />

            <div className="space-y-4">
                <h4 className="text-sm font-medium">Comments</h4>
                <CommentThread comments={sectionComments} />
                <CommentForm
                    fosterApplicationId={fosterApplicationId}
                    sectionCategory={sectionKey}
                />
            </div>
        </div>
    )
}
