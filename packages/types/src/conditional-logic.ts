import type { ConditionalRule, SectionConfig } from "./applications"

type SectionsData<K extends string> = Partial<Record<K, Record<string, unknown>>>

function evaluateCondition(rule: ConditionalRule<string>, sourceValue: unknown): boolean {
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
export function getVisibleFields<K extends string>(
    sectionKey: K,
    currentData: Record<string, unknown>,
    allSectionsData: SectionsData<K>,
    rules: ConditionalRule<K>[],
    configMap: Record<K, SectionConfig<K>>,
): Set<string> {
    const config = configMap[sectionKey]
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

    const rulesByTarget = new Map<string, ConditionalRule<K>[]>()
    for (const rule of rules) {
        if (rule.targetSection !== sectionKey) continue
        const existing = rulesByTarget.get(rule.targetField) ?? []
        existing.push(rule)
        rulesByTarget.set(rule.targetField, existing)
    }

    const visible = new Set<string>()

    for (const fieldName of allFieldNames) {
        const fieldRules = rulesByTarget.get(fieldName)

        if (!fieldRules || fieldRules.length === 0) {
            visible.add(fieldName)
            continue
        }

        const isVisible = fieldRules.some((rule) => {
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
export function getRequiredVisibleFields<K extends string>(
    sectionKey: K,
    currentData: Record<string, unknown>,
    allSectionsData: SectionsData<K>,
    rules: ConditionalRule<K>[],
    configMap: Record<K, SectionConfig<K>>,
): Set<string> {
    const visible = getVisibleFields(sectionKey, currentData, allSectionsData, rules, configMap)
    const config = configMap[sectionKey]
    if (!config) return new Set()

    const required = new Set<string>()
    for (const field of config.fields) {
        if (field.required && visible.has(field.name)) {
            required.add(field.name)
        }
    }

    return required
}
