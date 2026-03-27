"use server"

import {
    createContentItem,
    updateContentItem,
    archiveContentItem,
    revertToVersion,
} from "@repo/database"
import type { ContentType } from "@repo/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { contentTypeConfigs } from "../_lib/content-config"
import { revalidateWeb } from "../_lib/revalidate-web"

const HARDCODED_USER = "admin"

const webPathMap: Record<ContentType, string[]> = {
    sectionHeader: ["/"],
    pageHeader: ["/"],
    adoptionStep: ["/adopt/our-process"],
    volunteerRole: ["/", "/volunteer"],
    donationOption: ["/donate"],
    aboutPage: ["/about"],
    beforeYouApply: ["/adopt/our-process"],
    postAdoptionSupport: ["/adopt/support"],
    lostHoundSuggestion: ["/lost-hound"],
    whyGreyhound: ["/adopt"],
}

async function revalidateWebPaths(contentType: ContentType) {
    await revalidateWeb(webPathMap[contentType])
}

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

function parseContentFormData(
    contentType: ContentType,
    formData: FormData,
): Record<string, unknown> {
    switch (contentType) {
        case "sectionHeader":
            return {
                title: formData.get("title") as string,
                description: (formData.get("description") as string) || undefined,
                location: (formData.get("location") as string) || undefined,
            }
        case "pageHeader":
            return {
                title: formData.get("title") as string,
                highlight: (formData.get("highlight") as string) || undefined,
                description: (formData.get("description") as string) || undefined,
                variant: (formData.get("variant") as string) || "default",
                location: (formData.get("location") as string) || undefined,
            }
        case "adoptionStep": {
            const details: string[] = []
            for (const [key, value] of formData.entries()) {
                if (key.startsWith("details[") && typeof value === "string" && value.trim()) {
                    details.push(value.trim())
                }
            }
            return {
                step: Number(formData.get("step")),
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                details,
                icon: formData.get("icon") as string,
            }
        }
        case "volunteerRole":
            return {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                icon: formData.get("icon") as string,
                commitment: formData.get("commitment") as string,
            }
        case "donationOption":
        case "postAdoptionSupport":
        case "lostHoundSuggestion":
        case "whyGreyhound":
            return {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                icon: formData.get("icon") as string,
            }
        case "aboutPage":
            return {
                title: formData.get("title") as string,
                body: formData.get("body") as string,
            }
        case "beforeYouApply":
            return {
                label: formData.get("label") as string,
                title: formData.get("title") as string,
                text: formData.get("text") as string,
            }
    }
}

export async function createContentAction(contentType: ContentType, formData: FormData) {
    const data = parseContentFormData(contentType, formData)
    const config = contentTypeConfigs[contentType]

    if (!data.title) {
        return { errors: ["Title is required"] }
    }

    const slug = slugify(data.title as string)
    const result = await createContentItem(contentType, slug, data, HARDCODED_USER)
    redirect(`/${config.slug}/${result.id}`)
}

export async function updateContentAction(
    contentType: ContentType,
    contentItemId: number,
    formData: FormData,
) {
    const data = parseContentFormData(contentType, formData)
    const changeNote = (formData.get("changeNote") as string) || undefined
    const config = contentTypeConfigs[contentType]

    if (!data.title) {
        return { errors: ["Title is required"] }
    }

    await updateContentItem(contentItemId, data, HARDCODED_USER, changeNote)
    revalidatePath(`/${config.slug}/${contentItemId}`)
    revalidateWebPaths(contentType)
    return { success: true as const }
}

export async function archiveContentAction(contentItemId: number, contentType: ContentType) {
    const config = contentTypeConfigs[contentType]
    await archiveContentItem(contentItemId)
    redirect(`/${config.slug}`)
}

export async function revertContentAction(
    contentType: ContentType,
    contentItemId: number,
    targetVersionId: number,
) {
    const config = contentTypeConfigs[contentType]
    await revertToVersion(contentItemId, targetVersionId, HARDCODED_USER)
    revalidatePath(`/${config.slug}/${contentItemId}`)
    revalidateWebPaths(contentType)
}
