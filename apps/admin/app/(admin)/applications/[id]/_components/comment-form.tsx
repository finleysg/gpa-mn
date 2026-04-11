"use client"

import { useState, useTransition } from "react"
import { Button } from "@repo/ui/components/button"
import { Textarea } from "@repo/ui/components/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select"
import { SECTION_CONFIG_MAP } from "@repo/types"
import type { SectionCategory, SectionKey } from "@repo/database"

const SECTION_CATEGORIES: SectionCategory[] = [
    "applicant_info",
    "household",
    "pre_adoption",
    "home",
    "current_pets",
    "your_greyhound",
    "vet_reference",
    "personal_references",
    "final_questions",
    "general",
]
import { addCommentAction } from "../_actions/detail-actions"

interface CommentFormProps {
    applicationId: number
    sectionCategory?: SectionCategory
    showCategorySelect?: boolean
}

export function CommentForm({
    applicationId,
    sectionCategory,
    showCategorySelect,
}: CommentFormProps) {
    const [body, setBody] = useState("")
    const [category, setCategory] = useState<SectionCategory>(sectionCategory ?? "general")
    const [isPending, startTransition] = useTransition()

    function handleSubmit() {
        if (!body.trim()) return
        startTransition(async () => {
            const effectiveCategory = showCategorySelect ? category : sectionCategory
            await addCommentAction(applicationId, body, effectiveCategory)
            setBody("")
        })
    }

    return (
        <div className="space-y-3">
            <Textarea
                placeholder="Add a comment..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
            />
            <div className="flex items-center gap-2">
                {showCategorySelect && (
                    <Select
                        value={category}
                        onValueChange={(v) => setCategory(v as SectionCategory)}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SECTION_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat === "general"
                                        ? "General"
                                        : (SECTION_CONFIG_MAP[cat as SectionKey]?.title ?? cat)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <Button onClick={handleSubmit} disabled={isPending || !body.trim()} size="sm">
                    {isPending ? "Posting..." : "Post Comment"}
                </Button>
            </div>
        </div>
    )
}
