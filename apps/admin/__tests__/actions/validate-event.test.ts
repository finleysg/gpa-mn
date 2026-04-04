import { describe, it, expect } from "vitest"
import { validateEventData } from "@/app/_actions/validate-event"

describe("validateEventData", () => {
    const validEvent = {
        title: "Sunday Walk",
        startDate: "2026-03-22",
        endDate: null,
        recurrence: "once" as const,
        time: "10:00 AM",
        location: "Como Park",
        type: "Weekly" as const,
        description: "A walk",
        longDescription: "A longer walk",
        showUpcoming: true,
    }

    it("returns error when weekly recurrence has no endDate", () => {
        const errors = validateEventData({ ...validEvent, recurrence: "weekly", endDate: null })
        expect(errors).toContain("End date is required for recurring events")
    })

    it("returns error when monthly_by_date recurrence has no endDate", () => {
        const errors = validateEventData({
            ...validEvent,
            recurrence: "monthly_by_date",
            endDate: null,
        })
        expect(errors).toContain("End date is required for recurring events")
    })

    it("returns error when monthly_by_weekday recurrence has no endDate", () => {
        const errors = validateEventData({
            ...validEvent,
            recurrence: "monthly_by_weekday",
            endDate: null,
        })
        expect(errors).toContain("End date is required for recurring events")
    })

    it("passes when recurring event has an endDate", () => {
        const errors = validateEventData({
            ...validEvent,
            recurrence: "weekly",
            endDate: "2026-12-31",
        })
        expect(errors).toHaveLength(0)
    })

    it("passes when one-time event has no endDate", () => {
        const errors = validateEventData({ ...validEvent, recurrence: "once", endDate: null })
        expect(errors).toHaveLength(0)
    })
})
