"use server"

import { randomBytes } from "crypto"
import { redirect } from "next/navigation"
import { SECTION_KEYS, type SectionKey } from "@repo/database"
import {
    createApplication,
    createApplicationToken,
    deleteApplicationTokens,
    getApplicationByEmail,
    getApplicationByToken,
    getLatestSections,
    saveSection,
    submitApplication,
} from "@repo/database"
import { SECTION_CONFIG_MAP, getVisibleFields, getRequiredVisibleFields } from "@repo/types"
import { getApplicationCookie } from "../_lib/application-session"

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

// === Types ===

export type MagicLinkState = { success: true; message: string } | { errors: string[] } | undefined

export type SaveSectionState = { success: true } | { errors: Record<string, string> } | undefined

export type SubmitState = { success: true } | { error: string } | undefined

// === Magic Link ===

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

    // Find or create application
    const existing = await getApplicationByEmail(email)
    let applicationId: number
    if (existing) {
        applicationId = existing.id
    } else {
        const result = await createApplication({
            email,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
        })
        applicationId = result.id
    }

    // Invalidate old tokens and generate a new one
    await deleteApplicationTokens(applicationId)
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    await createApplicationToken(applicationId, token, expiresAt)

    // Send magic link email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    const url = `${baseUrl}/adopt/apply/callback?token=${token}`
    await sendAdminEmail("magic-link", {
        to: email,
        firstName: firstName.trim(),
        url,
    })

    return {
        success: true,
        message: "Check your email! We've sent you a link to access your application.",
    }
}

// === Get application from cookie ===

export async function getApplicationFromCookie() {
    const token = await getApplicationCookie()
    if (!token) return null

    const result = await getApplicationByToken(token)
    if (!result) return null

    const { application, token: tokenRecord } = result
    if (new Date(tokenRecord.expiresAt) < new Date()) return null

    return application
}

// === Save Section ===

function parseSectionFormData(formData: FormData, sectionKey: SectionKey): Record<string, unknown> {
    const config = SECTION_CONFIG_MAP[sectionKey]
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
    sectionKey: SectionKey,
    _prevState: SaveSectionState,
    formData: FormData,
): Promise<SaveSectionState> {
    // Parse form data
    const data = parseSectionFormData(formData, sectionKey)

    // Load all sections for cross-section conditional evaluation
    const allSectionsRaw = await getLatestSections(applicationId)
    const allSectionsData: Partial<Record<SectionKey, Record<string, unknown>>> = {}
    for (const { section } of allSectionsRaw) {
        allSectionsData[section.sectionKey as SectionKey] = section.data as Record<string, unknown>
    }
    // Include current form data for the section being saved
    allSectionsData[sectionKey] = data

    // Determine visible and required fields
    const visibleFields = getVisibleFields(sectionKey, data, allSectionsData)
    const requiredFields = getRequiredVisibleFields(sectionKey, data, allSectionsData)

    // Validate required visible fields
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

    // Strip hidden fields
    const visibleData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
        if (visibleFields.has(key)) {
            visibleData[key] = value
        }
    }

    await saveSection(applicationId, sectionKey, visibleData)
    return { success: true }
}

// === Submit Application ===

export async function submitApplicationAction(applicationId: number): Promise<SubmitState> {
    // Verify all sections are saved
    const allSections = await getLatestSections(applicationId)
    const savedKeys = new Set(allSections.map((s) => s.section.sectionKey))
    const missing = SECTION_KEYS.filter((key) => !savedKeys.has(key))

    if (missing.length > 0) {
        return { error: "Please complete all sections before submitting." }
    }

    await submitApplication(applicationId)

    // Fire-and-forget: send emails
    const application = await getApplicationFromCookie()
    if (application) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001"

        Promise.all([
            sendAdminEmail("submission-confirmation", {
                to: application.email,
                firstName: application.firstName,
                applicationUrl: `${baseUrl}/adopt/apply`,
            }),
            sendAdminEmail("admin-new-submission", {
                applicantName: `${application.firstName} ${application.lastName}`,
                applicationId: application.id,
                adminUrl: `${adminUrl}/applications/${application.id}`,
            }),
        ]).catch(() => {
            // Email failures shouldn't affect the user
        })
    }

    redirect("/adopt/apply/status")
}
