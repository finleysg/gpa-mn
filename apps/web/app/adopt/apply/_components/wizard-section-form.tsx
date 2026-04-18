"use client"

import { useActionState, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import type { SectionKey } from "@repo/database"
import type { SectionConfig } from "@repo/types"
import { CONDITIONAL_RULES, SECTION_CONFIG_MAP, getVisibleFields } from "@repo/types"
import { Button } from "@repo/ui/components/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { saveSectionAction, type SaveSectionState } from "../_actions/application"
import { FieldRenderer } from "./field-renderer"
import { getNextSectionSlug } from "../_lib/section-slugs"

interface WizardSectionFormProps {
    sectionConfig: SectionConfig<SectionKey>
    savedData: Record<string, unknown>
    allSectionsData: Partial<Record<SectionKey, Record<string, unknown>>>
    applicationId: number
}

export function WizardSectionForm({
    sectionConfig,
    savedData,
    allSectionsData,
    applicationId,
}: WizardSectionFormProps) {
    const router = useRouter()
    const [formData, setFormData] = useState<Record<string, unknown>>(savedData)
    const intentRef = useRef<"save" | "continue">("continue")

    const visibleFields = getVisibleFields(
        sectionConfig.key,
        formData,
        {
            ...allSectionsData,
            [sectionConfig.key]: formData,
        },
        CONDITIONAL_RULES,
        SECTION_CONFIG_MAP,
    )

    const boundAction = saveSectionAction.bind(null, applicationId, sectionConfig.key)

    const [state, formAction, isPending] = useActionState(
        async (prevState: SaveSectionState, fd: FormData) => {
            const result = await boundAction(prevState, fd)
            if (result && "success" in result) {
                if (intentRef.current === "continue") {
                    const nextSlug = getNextSectionSlug(sectionConfig.key)
                    if (nextSlug) {
                        router.push(`/adopt/apply/wizard/${nextSlug}`)
                    } else {
                        router.push("/adopt/apply/review")
                    }
                } else {
                    toast.success("Progress saved")
                }
            }
            return result
        },
        undefined,
    )

    const handleChange = useCallback((name: string, value: unknown) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }, [])

    const errors = state && "errors" in state ? state.errors : {}
    const nextSlug = getNextSectionSlug(sectionConfig.key)
    const isLastSection = !nextSlug

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl tracking-wide">{sectionConfig.title}</h1>
                {sectionConfig.description && (
                    <p className="text-muted-foreground mt-1 text-sm">
                        {sectionConfig.description}
                    </p>
                )}
            </div>

            <form action={formAction} className="space-y-6">
                {sectionConfig.fields.map((field) => {
                    if (!visibleFields.has(field.name)) return null
                    return (
                        <FieldRenderer
                            key={field.name}
                            field={field}
                            value={formData[field.name]}
                            onChange={handleChange}
                            error={errors[field.name]}
                        />
                    )
                })}

                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        onClick={() => {
                            intentRef.current = "continue"
                        }}
                    >
                        {isPending && intentRef.current === "continue" ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : isLastSection ? (
                            "Save & Review"
                        ) : (
                            "Save & Continue"
                        )}
                    </Button>
                    <Button
                        type="submit"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => {
                            intentRef.current = "save"
                        }}
                    >
                        {isPending && intentRef.current === "save" ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
