"use client"

import { ApplicationSectionDisplay } from "@repo/ui/components/application-section-display"
import { CONDITIONAL_RULES, SECTION_CONFIG_MAP } from "@repo/types"
import type { SectionKey } from "@repo/types"

interface SectionTabProps {
    sectionKey: SectionKey
    sectionData: Record<string, unknown>
    allSectionsData: Partial<Record<SectionKey, Record<string, unknown>>>
}

export function SectionTab({ sectionKey, sectionData, allSectionsData }: SectionTabProps) {
    const sectionConfig = SECTION_CONFIG_MAP[sectionKey]

    return (
        <div className="space-y-6 pt-4">
            <div>
                <h3 className="text-lg font-semibold">{sectionConfig.title}</h3>
                {sectionConfig.description && (
                    <p className="text-muted-foreground text-sm">{sectionConfig.description}</p>
                )}
            </div>

            <ApplicationSectionDisplay
                sectionConfig={sectionConfig}
                data={sectionData}
                allSectionsData={allSectionsData}
                conditionalRules={CONDITIONAL_RULES}
                configMap={SECTION_CONFIG_MAP}
            />
        </div>
    )
}
