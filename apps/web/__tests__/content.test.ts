import { describe, it, expect } from "vitest"
import { fixHyphens } from "@/app/_lib/content"

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

    it("corrupts URLs containing gpa-mn in the hostname", () => {
        const url = "https://gpa-mn-s3-bucket.s3.us-east-2.amazonaws.com/media/event/55.webp"
        const result = fixHyphens(url)
        // This test documents WHY image URLs must be kept out of fixHyphens:
        // it replaces the hyphen in the S3 bucket hostname, breaking the URL
        expect(result).not.toBe(url)
        expect(result).toContain("\u2011")
    })
})
