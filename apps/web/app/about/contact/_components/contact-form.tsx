"use client"

import { useActionState, useEffect, useRef } from "react"
import Script from "next/script"
import { CheckCircle2, Loader2 } from "lucide-react"
import { submitContactAction } from "../_actions"
import { CONTACT_CATEGORIES } from "../_constants"

declare global {
    interface Window {
        turnstile?: {
            reset: (widget?: HTMLElement | string) => void
            render: (el: HTMLElement | string, options: Record<string, unknown>) => string
        }
    }
}

const INPUT_CLASS =
    "border-border bg-card focus:ring-primary/30 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"

const LABEL_CLASS = "mb-1.5 block text-sm font-semibold"

const ERROR_CLASS = "mt-1 text-xs text-red-600 dark:text-red-400"

export function ContactForm() {
    const [state, formAction, isPending] = useActionState(submitContactAction, undefined)
    const captchaRef = useRef<HTMLDivElement>(null)
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

    useEffect(() => {
        if (state && "errors" in state && captchaRef.current && window.turnstile) {
            window.turnstile.reset(captchaRef.current)
        }
    }, [state])

    const errors = state && "errors" in state ? state.errors : {}

    if (state && "success" in state) {
        return (
            <div className="border-border rounded-2xl border bg-[#FAF5F0] p-8 text-center dark:bg-[#1a1715]">
                <CheckCircle2 className="mx-auto mb-3 size-10 text-green-600 dark:text-green-500" />
                <h3 className="mb-1 text-lg font-semibold">Message sent</h3>
                <p className="text-muted-foreground text-sm">
                    Thanks for reaching out — we'll get back to you as soon as we can.
                </p>
            </div>
        )
    }

    return (
        <>
            {siteKey && (
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
            )}
            <form action={formAction} className="mt-6 space-y-5" noValidate>
                <div>
                    <label htmlFor="name" className={LABEL_CLASS}>
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        className={INPUT_CLASS}
                    />
                    {errors.name && <p className={ERROR_CLASS}>{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="email" className={LABEL_CLASS}>
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        className={INPUT_CLASS}
                    />
                    {errors.email && <p className={ERROR_CLASS}>{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="category" className={LABEL_CLASS}>
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        defaultValue=""
                        required
                        className={INPUT_CLASS}
                    >
                        <option value="" disabled>
                            Select a category…
                        </option>
                        {CONTACT_CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className={ERROR_CLASS}>{errors.category}</p>}
                </div>
                <div>
                    <label htmlFor="subject" className={LABEL_CLASS}>
                        Subject
                    </label>
                    <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        placeholder="What's this about?"
                        className={INPUT_CLASS}
                    />
                    {errors.subject && <p className={ERROR_CLASS}>{errors.subject}</p>}
                </div>
                <div>
                    <label htmlFor="message" className={LABEL_CLASS}>
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us more..."
                        className={`${INPUT_CLASS} resize-none`}
                    />
                    {errors.message && <p className={ERROR_CLASS}>{errors.message}</p>}
                </div>

                {siteKey && (
                    <div>
                        <div
                            ref={captchaRef}
                            className="cf-turnstile"
                            data-sitekey={siteKey}
                            data-theme="auto"
                        />
                        {errors.captcha && <p className={ERROR_CLASS}>{errors.captcha}</p>}
                    </div>
                )}

                {errors.form && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.form}</p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending…
                        </>
                    ) : (
                        "Send Message"
                    )}
                </button>
            </form>
        </>
    )
}
