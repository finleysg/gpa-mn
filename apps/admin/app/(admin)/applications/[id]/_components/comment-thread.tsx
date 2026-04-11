"use client"

import { formatDistanceToNow } from "date-fns"
import { Badge } from "@repo/ui/components/badge"
import { SECTION_CONFIG_MAP } from "@repo/types"
import type { ApplicationComment } from "@repo/types"
import type { SectionKey } from "@repo/database"

interface CommentThreadProps {
    comments: ApplicationComment[]
    showCategory?: boolean
}

export function CommentThread({ comments, showCategory }: CommentThreadProps) {
    if (comments.length === 0) {
        return <p className="text-muted-foreground text-sm">No comments yet.</p>
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">
                            {comment.isSystemEvent ? "System" : comment.userName}
                        </span>
                        <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                        {showCategory && comment.sectionCategory && (
                            <Badge variant="outline" className="text-xs">
                                {comment.sectionCategory === "general"
                                    ? "General"
                                    : (SECTION_CONFIG_MAP[comment.sectionCategory as SectionKey]
                                          ?.title ?? comment.sectionCategory)}
                            </Badge>
                        )}
                    </div>
                    <p
                        className={`text-sm ${comment.isSystemEvent ? "text-muted-foreground italic" : ""}`}
                    >
                        {comment.body}
                    </p>
                </div>
            ))}
        </div>
    )
}
