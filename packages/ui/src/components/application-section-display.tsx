import type { ConditionalRule, SectionConfig } from "@repo/types"
import { getVisibleFields } from "@repo/types"

interface ApplicationSectionDisplayProps<K extends string> {
    sectionConfig: SectionConfig<K>
    data: Record<string, unknown>
    allSectionsData: Partial<Record<K, Record<string, unknown>>>
    conditionalRules: ConditionalRule<K>[]
    configMap: Record<K, SectionConfig<K>>
}

export function ApplicationSectionDisplay<K extends string>({
    sectionConfig,
    data,
    allSectionsData,
    conditionalRules,
    configMap,
}: ApplicationSectionDisplayProps<K>) {
    const visibleFields = getVisibleFields(
        sectionConfig.key,
        data,
        { ...allSectionsData, [sectionConfig.key]: data } as Partial<
            Record<K, Record<string, unknown>>
        >,
        conditionalRules,
        configMap,
    )

    return (
        <div className="space-y-3">
            {sectionConfig.fields.map((field) => {
                if (!visibleFields.has(field.name)) return null
                const value = data[field.name]
                if (value === undefined || value === null || value === "") return null

                return (
                    <div key={field.name} className="grid grid-cols-[1fr_2fr] gap-2 text-sm">
                        <dt className="text-muted-foreground">{field.label}</dt>
                        <dd>{formatValue(value)}</dd>
                    </div>
                )
            })}
        </div>
    )
}

function formatValue(value: unknown): string {
    if (Array.isArray(value)) {
        if (value.length === 0) return "\u2014"
        if (typeof value[0] === "object") {
            return value
                .map((entry: Record<string, unknown>) =>
                    Object.values(entry).filter(Boolean).join(", "),
                )
                .join(" | ")
        }
        return value.join(", ")
    }
    if (typeof value === "number") return String(value)
    if (typeof value === "string") return value
    return String(value)
}
