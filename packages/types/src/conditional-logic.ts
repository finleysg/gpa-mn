import type { SectionKey } from "@repo/database"
import type { ConditionalRule } from "./applications"
import { CONDITIONAL_RULES, SECTION_CONFIG_MAP } from "./application-form-config"

type SectionsData = Partial<Record<SectionKey, Record<string, unknown>>>

function evaluateCondition(rule: ConditionalRule, sourceValue: unknown): boolean {
    switch (rule.condition) {
        case "equals":
            return sourceValue === rule.value
        case "notEquals":
            return sourceValue !== rule.value
        case "includes":
            if (Array.isArray(sourceValue)) {
                return sourceValue.includes(rule.value)
            }
            return typeof sourceValue === "string" && sourceValue.includes(String(rule.value))
        case "truthy":
            return !!sourceValue
    }
}

/**
 * Returns the set of visible field names for a given section,
 * based on the current form data and any cross-section data.
 *
 * Fields without any conditional rule are always visible.
 * Fields with multiple rules are visible if ANY rule matches (OR logic).
 */
export function getVisibleFields(
    sectionKey: SectionKey,
    currentData: Record<string, unknown>,
    allSectionsData: SectionsData = {},
): Set<string> {
    const config = SECTION_CONFIG_MAP[sectionKey]
    if (!config) return new Set()

    const allFieldNames = new Set<string>()
    for (const field of config.fields) {
        allFieldNames.add(field.name)
        if (field.subFields) {
            for (const sub of field.subFields) {
                allFieldNames.add(sub.name)
            }
        }
    }

    // Group rules by target field for this section
    const rulesByTarget = new Map<string, ConditionalRule[]>()
    for (const rule of CONDITIONAL_RULES) {
        if (rule.targetSection !== sectionKey) continue
        const existing = rulesByTarget.get(rule.targetField) ?? []
        existing.push(rule)
        rulesByTarget.set(rule.targetField, existing)
    }

    const visible = new Set<string>()

    for (const fieldName of allFieldNames) {
        const rules = rulesByTarget.get(fieldName)

        // No rules → always visible
        if (!rules || rules.length === 0) {
            visible.add(fieldName)
            continue
        }

        // OR logic: visible if any rule matches
        const isVisible = rules.some((rule) => {
            const sourceData =
                rule.sourceSection === sectionKey
                    ? currentData
                    : (allSectionsData[rule.sourceSection] ?? {})
            const sourceValue = sourceData[rule.sourceField]
            return evaluateCondition(rule, sourceValue)
        })

        if (isVisible) {
            visible.add(fieldName)
        }
    }

    return visible
}

/**
 * Returns the set of field names that are both visible AND marked as required
 * in the section config.
 */
export function getRequiredVisibleFields(
    sectionKey: SectionKey,
    currentData: Record<string, unknown>,
    allSectionsData: SectionsData = {},
): Set<string> {
    const visible = getVisibleFields(sectionKey, currentData, allSectionsData)
    const config = SECTION_CONFIG_MAP[sectionKey]
    if (!config) return new Set()

    const required = new Set<string>()
    for (const field of config.fields) {
        if (field.required && visible.has(field.name)) {
            required.add(field.name)
        }
    }

    return required
}
