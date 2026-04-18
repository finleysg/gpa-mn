import { FOSTER_SECTION_KEYS, type FosterSectionKey } from "@repo/database/schema"

export function toSlug(sectionKey: FosterSectionKey): string {
    return sectionKey.replaceAll("_", "-")
}

export function toSectionKey(slug: string): FosterSectionKey | null {
    const key = slug.replaceAll("-", "_")
    if (FOSTER_SECTION_KEYS.includes(key as FosterSectionKey)) {
        return key as FosterSectionKey
    }
    return null
}

export function getNextSectionSlug(currentKey: FosterSectionKey): string | null {
    const index = FOSTER_SECTION_KEYS.indexOf(currentKey)
    if (index < 0 || index >= FOSTER_SECTION_KEYS.length - 1) return null
    return toSlug(FOSTER_SECTION_KEYS[index + 1]!)
}

export function getPreviousSectionKey(currentKey: FosterSectionKey): FosterSectionKey | null {
    const index = FOSTER_SECTION_KEYS.indexOf(currentKey)
    if (index <= 0) return null
    return FOSTER_SECTION_KEYS[index - 1]!
}

export function getFirstIncompleteSectionSlug(
    completedSections: FosterSectionKey[],
): string | null {
    for (const key of FOSTER_SECTION_KEYS) {
        if (!completedSections.includes(key)) {
            return toSlug(key)
        }
    }
    return null
}

export function isSectionAccessible(
    sectionKey: FosterSectionKey,
    completedSections: FosterSectionKey[],
): boolean {
    const index = FOSTER_SECTION_KEYS.indexOf(sectionKey)
    if (index === 0) return true
    for (let i = 0; i < index; i++) {
        if (!completedSections.includes(FOSTER_SECTION_KEYS[i]!)) {
            return false
        }
    }
    return true
}
