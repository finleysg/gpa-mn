"use client"

import { ApplicationSectionDisplay } from "@repo/ui/components/application-section-display"
import { FOSTER_CONDITIONAL_RULES, FOSTER_SECTION_CONFIG_MAP } from "@repo/types"
import type { FosterSectionKey } from "@repo/database"

interface SectionTabProps {
    sectionKey: FosterSectionKey
    sectionData: Record<string, unknown>
    allSectionsData: Partial<Record<FosterSectionKey, Record<string, unknown>>>
}

export function SectionTab({ sectionKey, sectionData, allSectionsData }: SectionTabProps) {
    const sectionConfig = FOSTER_SECTION_CONFIG_MAP[sectionKey]

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
                conditionalRules={FOSTER_CONDITIONAL_RULES}
                configMap={FOSTER_SECTION_CONFIG_MAP}
            />
        </div>
    )
}
