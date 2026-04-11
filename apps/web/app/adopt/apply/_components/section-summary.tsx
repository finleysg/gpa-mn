import type { SectionConfig } from "@repo/types"
import { getVisibleFields } from "@repo/types"
import type { SectionKey } from "@repo/database"

interface SectionSummaryProps {
    sectionConfig: SectionConfig
    data: Record<string, unknown>
    allSectionsData: Partial<Record<SectionKey, Record<string, unknown>>>
}

export function SectionSummary({ sectionConfig, data, allSectionsData }: SectionSummaryProps) {
    const visibleFields = getVisibleFields(sectionConfig.key, data, {
        ...allSectionsData,
        [sectionConfig.key]: data,
    })

    return (
        <div className="space-y-3">
            {sectionConfig.fields.map((field) => {
                if (!visibleFields.has(field.name)) return null
                const value = data[field.name]
                if (value === undefined || value === null || value === "") return null

                return (
                    <div key={field.name} className="grid grid-cols-[1fr_2fr] gap-2 text-sm">
                        <dt className="text-muted-foreground">{field.label}</dt>
                        <dd>{formatValue(value, field.type)}</dd>
                    </div>
                )
            })}
        </div>
    )
}

function formatValue(value: unknown, type: string): string {
    if (Array.isArray(value)) {
        if (value.length === 0) return "—"
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
