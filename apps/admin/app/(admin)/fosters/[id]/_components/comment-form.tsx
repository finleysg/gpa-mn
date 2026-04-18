"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@repo/ui/components/button"
import { Textarea } from "@repo/ui/components/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select"
import { FOSTER_SECTION_CONFIG_MAP } from "@repo/types"
import type { FosterSectionCategory, FosterSectionKey } from "@repo/database"
import { addCommentAction } from "../_actions/detail-actions"

const FOSTER_SECTION_CATEGORIES: FosterSectionCategory[] = [
    "applicant_info",
    "household",
    "pre_foster",
    "home",
    "current_pets",
    "foster_preferences",
    "vet_reference",
    "personal_references",
    "foster_agreements",
    "final_questions",
    "general",
]

interface CommentFormProps {
    fosterApplicationId: number
    sectionCategory?: FosterSectionCategory
    showCategorySelect?: boolean
}

export function CommentForm({
    fosterApplicationId,
    sectionCategory,
    showCategorySelect,
}: CommentFormProps) {
    const [body, setBody] = useState("")
    const [category, setCategory] = useState<FosterSectionCategory>(sectionCategory ?? "general")
    const [isPending, startTransition] = useTransition()

    function handleSubmit() {
        if (!body.trim()) return
        startTransition(async () => {
            const effectiveCategory = showCategorySelect ? category : sectionCategory
            const result = await addCommentAction(fosterApplicationId, body, effectiveCategory)
            if ("errors" in result) {
                toast.error(result.errors[0])
            } else {
                setBody("")
            }
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
                        onValueChange={(v) => setCategory(v as FosterSectionCategory)}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {FOSTER_SECTION_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat === "general"
                                        ? "General"
                                        : (FOSTER_SECTION_CONFIG_MAP[cat as FosterSectionKey]
                                              ?.title ?? cat)}
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
