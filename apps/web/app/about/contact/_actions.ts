"use server"

import { CONTACT_CATEGORIES, type ContactCategoryValue } from "./_constants"

const CATEGORY_VALUES = new Set<string>(CONTACT_CATEGORIES.map((c) => c.value))

export type ContactState =
    | { success: true }
    | {
          errors: Partial<
              Record<
                  "name" | "email" | "category" | "subject" | "message" | "captcha" | "form",
                  string
              >
          >
      }
    | undefined

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY
    if (!secret) {
        console.warn("[contact] TURNSTILE_SECRET_KEY not set — skipping verification")
        return true
    }

    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.append("remoteip", ip)

    try {
        const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body,
        })
        const data = (await res.json()) as { success: boolean }
        return data.success === true
    } catch (err) {
        console.error("[contact] Turnstile verification failed:", err)
        return false
    }
}

export async function submitContactAction(
    _prev: ContactState,
    formData: FormData,
): Promise<ContactState> {
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const category = String(formData.get("category") ?? "").trim()
    const subject = String(formData.get("subject") ?? "").trim()
    const message = String(formData.get("message") ?? "").trim()
    const captchaToken = String(formData.get("cf-turnstile-response") ?? "").trim()

    const errors: NonNullable<Extract<ContactState, { errors: unknown }>>["errors"] = {}

    if (name.length === 0) errors.name = "Please enter your name."
    if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address."
    if (!CATEGORY_VALUES.has(category as ContactCategoryValue)) {
        errors.category = "Please select a category."
    }
    if (subject.length === 0) errors.subject = "Please enter a subject."
    if (message.length === 0) errors.message = "Please enter a message."

    if (Object.keys(errors).length > 0) {
        return { errors }
    }

    if (process.env.TURNSTILE_SECRET_KEY) {
        if (!captchaToken) {
            return { errors: { captcha: "Please complete the captcha." } }
        }

        const { headers } = await import("next/headers")
        const h = await headers()
        const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null

        const captchaOk = await verifyTurnstile(captchaToken, ip)
        if (!captchaOk) {
            return { errors: { captcha: "Captcha verification failed. Please try again." } }
        }
    }

    const adminUrl = process.env.ADMIN_INTERNAL_URL
    const secret = process.env.REVALIDATION_SECRET

    if (!adminUrl || !secret) {
        console.error("[contact] ADMIN_INTERNAL_URL or REVALIDATION_SECRET not set")
        return {
            errors: { form: "We couldn't send your message right now. Please try again later." },
        }
    }

    try {
        const res = await fetch(`${adminUrl}/api/email/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, name, email, subject, message, secret }),
        })
        if (!res.ok) {
            console.error("[contact] Admin API error:", res.status, await res.text())
            return {
                errors: {
                    form: "We couldn't send your message right now. Please try again later.",
                },
            }
        }
    } catch (err) {
        console.error("[contact] Admin API call failed:", err)
        return {
            errors: { form: "We couldn't send your message right now. Please try again later." },
        }
    }

    return { success: true }
}
