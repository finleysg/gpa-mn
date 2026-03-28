"use client"

import { useActionState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import type { ContentType } from "@repo/types"
import { SectionHeaderFields } from "./content-fields/section-header-fields"
import { PageHeaderFields } from "./content-fields/page-header-fields"
import { AdoptionStepFields } from "./content-fields/adoption-step-fields"
import { VolunteerRoleFields } from "./content-fields/volunteer-role-fields"
import { DonationOptionFields } from "./content-fields/donation-option-fields"
import { AboutPageFields } from "./content-fields/about-page-fields"
import { BeforeYouApplyFields } from "./content-fields/before-you-apply-fields"
import { WhyChooseUsFields } from "./content-fields/why-choose-us-fields"

type ActionResult = { errors: string[] } | { success: true } | undefined

interface ContentFormProps {
    contentType: ContentType
    data?: Record<string, unknown>
    action: (formData: FormData) => Promise<ActionResult>
    backHref: string
}

const fieldComponents: Record<
    ContentType,
    React.ComponentType<{ data?: Record<string, unknown> }>
> = {
    sectionHeader: SectionHeaderFields,
    pageHeader: PageHeaderFields,
    adoptionStep: AdoptionStepFields,
    volunteerRole: VolunteerRoleFields,
    donationOption: DonationOptionFields,
    aboutPage: AboutPageFields,
    beforeYouApply: BeforeYouApplyFields,
    postAdoptionSupport: DonationOptionFields,
    lostHoundSuggestion: DonationOptionFields,
    whyGreyhound: DonationOptionFields,
    whyChooseUs: WhyChooseUsFields,
}

export function ContentForm({ contentType, data, action, backHref }: ContentFormProps) {
    const [state, formAction] = useActionState(
        async (_prev: ActionResult, formData: FormData) => action(formData),
        undefined,
    )

    const isEditing = !!data
    const FieldsComponent = fieldComponents[contentType]

    useEffect(() => {
        if (state && "success" in state) {
            toast.success("Saved successfully")
        }
    }, [state])

    return (
        <form action={formAction} className="max-w-2xl space-y-6">
            {state && "errors" in state && (
                <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                    {state.errors.map((error: string) => (
                        <p key={error}>{error}</p>
                    ))}
                </div>
            )}

            <FieldsComponent data={data} />

            {isEditing && (
                <div className="space-y-2">
                    <Label htmlFor="changeNote">Change Note</Label>
                    <Input
                        id="changeNote"
                        name="changeNote"
                        placeholder="Describe what changed (optional)"
                    />
                </div>
            )}

            <div className="flex gap-3">
                <Button type="submit">{isEditing ? "Save Changes" : "Create"}</Button>
                <Button variant="ghost" asChild>
                    <Link href={backHref}>Back</Link>
                </Button>
            </div>
        </form>
    )
}
