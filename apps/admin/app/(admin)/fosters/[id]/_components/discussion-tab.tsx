"use client"

import type { FosterApplicationComment } from "@repo/types"
import { CommentThread } from "./comment-thread"
import { CommentForm } from "./comment-form"

interface DiscussionTabProps {
    fosterApplicationId: number
    comments: FosterApplicationComment[]
}

export function DiscussionTab({ fosterApplicationId, comments }: DiscussionTabProps) {
    return (
        <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">Discussion</h3>
            <CommentThread comments={comments} showCategory />
            <CommentForm fosterApplicationId={fosterApplicationId} showCategorySelect />
        </div>
    )
}
