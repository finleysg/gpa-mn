"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@repo/ui/components/sheet"
import type { ApplicationComment } from "@repo/types"
import type { SectionCategory } from "@repo/database"
import { CommentThread } from "./comment-thread"
import { CommentForm } from "./comment-form"

interface CommentsSheetProps {
    applicationId: number
    comments: ApplicationComment[]
    activeTab: string
}

export function CommentsSheet({ applicationId, comments, activeTab }: CommentsSheetProps) {
    const [open, setOpen] = useState(false)
    const isDiscussion = activeTab === "discussion"
    const filteredComments = isDiscussion
        ? comments
        : comments.filter((c) => c.sectionCategory === activeTab)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-background hover:bg-accent fixed top-1/2 right-0 z-40 flex -translate-y-1/2 items-center gap-1.5 rounded-l-md border border-r-0 px-2 py-3 shadow-md transition-colors"
                style={{ writingMode: "vertical-rl" }}
            >
                <MessageSquare className="size-4 rotate-90" />
                <span className="text-sm font-medium">Comments</span>
            </button>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="flex w-1/3 min-w-80 flex-col sm:max-w-none">
                    <SheetHeader>
                        <SheetTitle>Comments</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-4">
                        <CommentThread comments={filteredComments} showCategory={isDiscussion} />
                    </div>
                    <div className="border-t p-4">
                        <CommentForm
                            applicationId={applicationId}
                            sectionCategory={
                                isDiscussion ? undefined : (activeTab as SectionCategory)
                            }
                            showCategorySelect={isDiscussion}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
