interface EventInput {
    recurrence?: "once" | "weekly" | "monthly_by_date" | "monthly_by_weekday" | null
    endDate?: string | null
    paypalButtonLabel?: string | null
    paypalAddToCartHtml?: string | null
    paypalViewCartHtml?: string | null
}

export function validateEventData(data: EventInput): string[] {
    const errors: string[] = []
    const recurrence = data.recurrence ?? "once"

    if (recurrence !== "once" && !data.endDate) {
        errors.push("End date is required for recurring events")
    }

    if (data.paypalAddToCartHtml && !data.paypalButtonLabel) {
        errors.push("PayPal section label is required when Add to Cart HTML is set")
    }
    if (data.paypalViewCartHtml && !data.paypalAddToCartHtml) {
        errors.push("View Cart HTML requires Add to Cart HTML")
    }

    return errors
}
