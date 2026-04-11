"use client"

import type { ApplicationComment } from "@repo/types"
import { CommentThread } from "./comment-thread"
import { CommentForm } from "./comment-form"

interface DiscussionTabProps {
    applicationId: number
    comments: ApplicationComment[]
}

export function DiscussionTab({ applicationId, comments }: DiscussionTabProps) {
    return (
        <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">Discussion</h3>
            <CommentThread comments={comments} showCategory />
            <CommentForm applicationId={applicationId} showCategorySelect />
        </div>
    )
}
