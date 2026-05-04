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
