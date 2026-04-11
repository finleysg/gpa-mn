import { SECTION_KEYS, type SectionKey } from "@repo/database/schema"

export function toSlug(sectionKey: SectionKey): string {
    return sectionKey.replaceAll("_", "-")
}

export function toSectionKey(slug: string): SectionKey | null {
    const key = slug.replaceAll("-", "_")
    if (SECTION_KEYS.includes(key as SectionKey)) {
        return key as SectionKey
    }
    return null
}

export function getNextSectionSlug(currentKey: SectionKey): string | null {
    const index = SECTION_KEYS.indexOf(currentKey)
    if (index < 0 || index >= SECTION_KEYS.length - 1) return null
    return toSlug(SECTION_KEYS[index + 1]!)
}

export function getPreviousSectionKey(currentKey: SectionKey): SectionKey | null {
    const index = SECTION_KEYS.indexOf(currentKey)
    if (index <= 0) return null
    return SECTION_KEYS[index - 1]!
}

export function getFirstIncompleteSectionSlug(completedSections: SectionKey[]): string | null {
    for (const key of SECTION_KEYS) {
        if (!completedSections.includes(key)) {
            return toSlug(key)
        }
    }
    return null // all complete
}

export function isSectionAccessible(
    sectionKey: SectionKey,
    completedSections: SectionKey[],
): boolean {
    const index = SECTION_KEYS.indexOf(sectionKey)
    if (index === 0) return true
    // All prior sections must be complete
    for (let i = 0; i < index; i++) {
        if (!completedSections.includes(SECTION_KEYS[i]!)) {
            return false
        }
    }
    return true
}
