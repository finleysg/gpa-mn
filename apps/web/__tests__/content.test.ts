import { describe, it, expect } from "vitest"
import { format } from "date-fns"
import { fixHyphens, computeNextOccurrence } from "@/app/_lib/content"

// Minimal stub matching the fields computeNextOccurrence reads.
type EventStub = { startDate: string; recurrence: string }
const stub = (e: EventStub) => e as unknown as Parameters<typeof computeNextOccurrence>[0]
const iso = (d: Date) => format(d, "yyyy-MM-dd")

describe("fixHyphens", () => {
    it('replaces hyphens in "GPA-MN" with non-breaking hyphens', () => {
        expect(fixHyphens("Welcome to GPA-MN")).toBe("Welcome to GPA\u2011MN")
    })

    it("is case-insensitive", () => {
        expect(fixHyphens("gpa-mn rocks")).toBe("gpa\u2011mn rocks")
    })

    it("processes object values recursively", () => {
        const result = fixHyphens({ title: "GPA-MN Event", count: 5 })
        expect(result).toEqual({ title: "GPA\u2011MN Event", count: 5 })
    })

    it("leaves URLs containing gpa-mn untouched", () => {
        const url = "https://gpa-mn-s3-bucket.s3.us-east-2.amazonaws.com/media/event/55.webp"
        expect(fixHyphens(url)).toBe(url)
    })

    it("substitutes prose mentions but preserves URLs in mixed strings", () => {
        const md = 'See ![v](https://gpa-mn-s3.example.com/x.webp "left medium") on GPA-MN.'
        expect(fixHyphens(md)).toBe(
            'See ![v](https://gpa-mn-s3.example.com/x.webp "left medium") on GPA\u2011MN.',
        )
    })
})

describe("computeNextOccurrence", () => {
    // Today = Tuesday, May 19, 2026. (Local time; tests should be timezone-agnostic
    // since both `today` and origins are constructed via Date with local fields.)
    const today = new Date(2026, 4, 19)

    it("returns the stored date for a one-time event", () => {
        const result = computeNextOccurrence(
            stub({ startDate: "2026-08-15", recurrence: "once" }),
            today,
        )
        expect(iso(result)).toBe("2026-08-15")
    })

    it("projects a weekly event to the next matching weekday on or after today", () => {
        // Origin is a Sunday in 2020; next Sunday on/after 2026-05-19 (Tue) is 2026-05-24.
        const result = computeNextOccurrence(
            stub({ startDate: "2020-01-05", recurrence: "weekly" }),
            today,
        )
        expect(iso(result)).toBe("2026-05-24")
    })

    it("returns today when a weekly event falls on today's weekday", () => {
        // Origin Tuesday 2024-01-02; today is Tuesday 2026-05-19.
        const result = computeNextOccurrence(
            stub({ startDate: "2024-01-02", recurrence: "weekly" }),
            today,
        )
        expect(iso(result)).toBe("2026-05-19")
    })

    it("projects monthly_by_date to the next occurrence", () => {
        // The 25th of the month: from May 19, the next 25th is May 25.
        const may25 = computeNextOccurrence(
            stub({ startDate: "2024-03-25", recurrence: "monthly_by_date" }),
            today,
        )
        expect(iso(may25)).toBe("2026-05-25")

        // The 5th of the month: from May 19, May 5 is past, so next is June 5.
        const jun5 = computeNextOccurrence(
            stub({ startDate: "2024-03-05", recurrence: "monthly_by_date" }),
            today,
        )
        expect(iso(jun5)).toBe("2026-06-05")
    })

    it("projects monthly_by_weekday to the next nth weekday", () => {
        // 3rd Sunday: origin 2024-01-21 (3rd Sunday of Jan 2024).
        // May 2026's 3rd Sunday is May 17, which is past (today=May 19).
        // June 2026's 3rd Sunday is June 21.
        const result = computeNextOccurrence(
            stub({ startDate: "2024-01-21", recurrence: "monthly_by_weekday" }),
            today,
        )
        expect(iso(result)).toBe("2026-06-21")
    })

    it("returns this month's nth weekday when it is on or after today", () => {
        // 4th Tuesday: origin 2024-01-23. May 2026's 4th Tuesday is May 26 (>= today).
        const result = computeNextOccurrence(
            stub({ startDate: "2024-01-23", recurrence: "monthly_by_weekday" }),
            today,
        )
        expect(iso(result)).toBe("2026-05-26")
    })
})
