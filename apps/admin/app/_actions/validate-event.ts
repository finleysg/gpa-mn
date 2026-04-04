interface EventInput {
    recurrence?: "once" | "weekly" | "monthly_by_date" | "monthly_by_weekday" | null
    endDate?: string | null
}

export function validateEventData(data: EventInput): string[] {
    const errors: string[] = []
    const recurrence = data.recurrence ?? "once"

    if (recurrence !== "once" && !data.endDate) {
        errors.push("End date is required for recurring events")
    }

    return errors
}
