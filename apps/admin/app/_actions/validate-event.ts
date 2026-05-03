import type { PaypalOption } from "@repo/database"

interface EventInput {
    recurrence?: "once" | "weekly" | "monthly_by_date" | "monthly_by_weekday" | null
    endDate?: string | null
    paypalButtonId?: string | null
    paypalButtonLabel?: string | null
    paypalButtonStyle?: "cart" | "buynow" | "donate" | null
    paypalOptions?: PaypalOption[] | null
}

export function validateEventData(data: EventInput): string[] {
    const errors: string[] = []
    const recurrence = data.recurrence ?? "once"

    if (recurrence !== "once" && !data.endDate) {
        errors.push("End date is required for recurring events")
    }

    if (data.paypalButtonId) {
        if (!data.paypalButtonLabel) {
            errors.push("PayPal button label is required when a button ID is set")
        }
        if (!data.paypalButtonStyle) {
            errors.push("PayPal button style is required when a button ID is set")
        }
        for (const [i, opt] of (data.paypalOptions ?? []).entries()) {
            if (!opt.label) {
                errors.push(`PayPal option ${i + 1}: label is required`)
            }
            if (opt.kind === "select" && opt.choices.length === 0) {
                errors.push(`PayPal option ${i + 1}: at least one choice is required`)
            }
        }
    }

    return errors
}
