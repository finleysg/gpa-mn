"use client"

import { ApplicationSectionDisplay } from "@repo/ui/components/application-section-display"
import { Separator } from "@repo/ui/components/separator"
import { SECTION_CONFIG_MAP } from "@repo/types"
import type { ApplicationComment, SectionKey } from "@repo/types"
import { CommentThread } from "./comment-thread"
import { CommentForm } from "./comment-form"

interface SectionTabProps {
    applicationId: number
    sectionKey: SectionKey
    sectionData: Record<string, unknown>
    allSectionsData: Partial<Record<SectionKey, Record<string, unknown>>>
    comments: ApplicationComment[]
}

export function SectionTab({
    applicationId,
    sectionKey,
    sectionData,
    allSectionsData,
    comments,
}: SectionTabProps) {
    const sectionConfig = SECTION_CONFIG_MAP[sectionKey]
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
            />

            <Separator />

            <div className="space-y-4">
                <h4 className="text-sm font-medium">Comments</h4>
                <CommentThread comments={sectionComments} />
                <CommentForm applicationId={applicationId} sectionCategory={sectionKey} />
            </div>
        </div>
    )
}
