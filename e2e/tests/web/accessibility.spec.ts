import AxeBuilder from "@axe-core/playwright"
import { test, expect } from "@playwright/test"

const pages = [
    { path: "/", name: "home" },
    { path: "/adopt", name: "adopt" },
    { path: "/adopt/available", name: "available dogs" },
    { path: "/adopt/our-process", name: "our process" },
    { path: "/adopt/why-gpa-mn", name: "why GPA-MN" },
    { path: "/adopt/support", name: "post-adoption support" },
    { path: "/volunteer", name: "volunteer" },
    { path: "/donate", name: "donate" },
    { path: "/events", name: "events" },
    { path: "/about", name: "about" },
    { path: "/about/contact", name: "contact" },
    { path: "/lost-hound", name: "lost hound" },
]

test.describe("Accessibility", () => {
    for (const { path, name } of pages) {
        test(`${name} page has no critical or serious axe violations`, async ({ page }) => {
            await page.goto(path)
            const results = await new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
                .analyze()
            const blocking = results.violations.filter(
                (v) => v.impact === "critical" || v.impact === "serious",
            )
            expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
        })
    }
})
