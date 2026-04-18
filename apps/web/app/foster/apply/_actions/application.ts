"use server"

import { randomBytes } from "crypto"
import { redirect } from "next/navigation"
import { FOSTER_SECTION_KEYS, type FosterSectionKey } from "@repo/database"
import {
    createFosterApplication,
    createFosterApplicationToken,
    deleteFosterApplicationTokens,
    getFosterApplicationByEmail,
    getFosterApplicationByToken,
    getLatestFosterSections,
    saveFosterSection,
    submitFosterApplication,
} from "@repo/database"
import {
    FOSTER_CONDITIONAL_RULES,
    FOSTER_SECTION_CONFIG_MAP,
    getVisibleFields,
    getRequiredVisibleFields,
} from "@repo/types"
import { getFosterApplicationCookie } from "../_lib/application-session"

async function sendAdminEmail(endpoint: string, data: Record<string, unknown>) {
    const adminUrl = process.env.ADMIN_INTERNAL_URL
    const secret = process.env.REVALIDATION_SECRET

    if (!adminUrl || !secret) {
        console.warn("[email] ADMIN_INTERNAL_URL or REVALIDATION_SECRET not set — skipping email")
        return
    }

    const res = await fetch(`${adminUrl}/api/email/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, secret }),
    })

    if (!res.ok) {
        throw new Error(`Email API failed: ${res.status} ${await res.text()}`)
    }
}

export type MagicLinkState = { success: true; message: string } | { errors: string[] } | undefined

export type SaveSectionState = { success: true } | { errors: Record<string, string> } | undefined

export type SubmitState = { success: true } | { error: string } | undefined

export async function requestMagicLink(
    _prevState: MagicLinkState,
    formData: FormData,
): Promise<MagicLinkState> {
    const email = formData.get("email")
    const firstName = formData.get("firstName")
    const lastName = formData.get("lastName")

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { errors: ["Please enter a valid email address."] }
    }
    if (!firstName || typeof firstName !== "string" || firstName.trim().length === 0) {
        return { errors: ["Please enter your first name."] }
    }
    if (!lastName || typeof lastName !== "string" || lastName.trim().length === 0) {
        return { errors: ["Please enter your last name."] }
    }

    const existing = await getFosterApplicationByEmail(email)
    let applicationId: number
    if (existing) {
        applicationId = existing.id
    } else {
        const result = await createFosterApplication({
            email,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
        })
        applicationId = result.id
    }

    await deleteFosterApplicationTokens(applicationId)
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    await createFosterApplicationToken(applicationId, token, expiresAt)

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    const url = `${baseUrl}/foster/apply/callback?token=${token}`
    await sendAdminEmail("foster-magic-link", {
        to: email,
        firstName: firstName.trim(),
        url,
    })

    return {
        success: true,
        message: "Check your email! We've sent you a link to access your application.",
    }
}

export async function getFosterApplicationFromCookie() {
    const token = await getFosterApplicationCookie()
    if (!token) return null

    const result = await getFosterApplicationByToken(token)
    if (!result) return null

    const { application, token: tokenRecord } = result
    if (new Date(tokenRecord.expiresAt) < new Date()) return null

    return application
}

function parseSectionFormData(
    formData: FormData,
    sectionKey: FosterSectionKey,
): Record<string, unknown> {
    const config = FOSTER_SECTION_CONFIG_MAP[sectionKey]
    if (!config) return {}

    const data: Record<string, unknown> = {}

    for (const field of config.fields) {
        if (field.type === "checkbox") {
            data[field.name] = formData.getAll(field.name)
        } else if (field.type === "repeating" && field.subFields) {
            const entries: Record<string, unknown>[] = []
            const countStr = formData.get(`${field.name}__count`)
            const count = countStr ? parseInt(String(countStr), 10) : 0
            for (let i = 0; i < count; i++) {
                const entry: Record<string, unknown> = {}
                for (const sub of field.subFields) {
                    const val = formData.get(`${field.name}[${i}].${sub.name}`)
                    entry[sub.name] = val ? String(val) : ""
                }
                entries.push(entry)
            }
            data[field.name] = entries
        } else if (field.type === "number" || field.type === "scale") {
            const val = formData.get(field.name)
            data[field.name] = val ? Number(val) : undefined
        } else {
            const val = formData.get(field.name)
            data[field.name] = val ? String(val) : undefined
        }
    }

    return data
}

export async function saveSectionAction(
    applicationId: number,
    sectionKey: FosterSectionKey,
    _prevState: SaveSectionState,
    formData: FormData,
): Promise<SaveSectionState> {
    const data = parseSectionFormData(formData, sectionKey)

    const allSectionsRaw = await getLatestFosterSections(applicationId)
    const allSectionsData: Partial<Record<FosterSectionKey, Record<string, unknown>>> = {}
    for (const { section } of allSectionsRaw) {
        allSectionsData[section.sectionKey as FosterSectionKey] = section.data as Record<
            string,
            unknown
        >
    }
    allSectionsData[sectionKey] = data

    const visibleFields = getVisibleFields(
        sectionKey,
        data,
        allSectionsData,
        FOSTER_CONDITIONAL_RULES,
        FOSTER_SECTION_CONFIG_MAP,
    )
    const requiredFields = getRequiredVisibleFields(
        sectionKey,
        data,
        allSectionsData,
        FOSTER_CONDITIONAL_RULES,
        FOSTER_SECTION_CONFIG_MAP,
    )

    const errors: Record<string, string> = {}
    for (const fieldName of requiredFields) {
        const value = data[fieldName]
        if (value === undefined || value === null || value === "") {
            errors[fieldName] = "This field is required."
        } else if (Array.isArray(value) && value.length === 0) {
            errors[fieldName] = "Please select at least one option."
        }
    }

    if (Object.keys(errors).length > 0) {
        return { errors }
    }

    const visibleData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
        if (visibleFields.has(key)) {
            visibleData[key] = value
        }
    }

    await saveFosterSection(applicationId, sectionKey, visibleData)
    return { success: true }
}

export async function submitApplicationAction(applicationId: number): Promise<SubmitState> {
    const allSections = await getLatestFosterSections(applicationId)
    const savedKeys = new Set(allSections.map((s) => s.section.sectionKey))
    const missing = FOSTER_SECTION_KEYS.filter((key) => !savedKeys.has(key))

    if (missing.length > 0) {
        return { error: "Please complete all sections before submitting." }
    }

    await submitFosterApplication(applicationId)

    const application = await getFosterApplicationFromCookie()
    if (application) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001"

        Promise.all([
            sendAdminEmail("foster-submission-confirmation", {
                to: application.email,
                firstName: application.firstName,
                applicationUrl: `${baseUrl}/foster/apply`,
            }),
            sendAdminEmail("foster-admin-new-submission", {
                applicantName: `${application.firstName} ${application.lastName}`,
                fosterApplicationId: application.id,
                adminUrl: `${adminUrl}/fosters/${application.id}`,
            }),
        ]).catch(() => {
            // Email failures shouldn't affect the user
        })
    }

    redirect("/foster/apply/status")
}
