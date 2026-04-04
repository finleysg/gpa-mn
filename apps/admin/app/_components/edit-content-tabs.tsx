"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/tabs"
import { ContentForm } from "./content-form"
import { VersionHistory } from "./version-history"
import type { ContentType } from "@repo/types"
import type { contentVersions } from "@repo/database"

type ContentVersion = typeof contentVersions.$inferSelect
type ActionResult = { errors: string[] } | { success: true } | undefined

interface EditContentTabsProps {
    contentType: ContentType
    data: Record<string, unknown>
    versions: ContentVersion[]
    currentVersion: number
    formAction: (formData: FormData) => Promise<ActionResult>
    revertAction: (targetVersionId: number) => Promise<void>
    backHref: string
    fieldProps?: Record<string, unknown>
}

export function EditContentTabs({
    contentType,
    data,
    versions,
    currentVersion,
    formAction,
    revertAction,
    backHref,
    fieldProps,
}: EditContentTabsProps) {
    return (
        <Tabs defaultValue="details">
            <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">Version History</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
                <ContentForm
                    contentType={contentType}
                    data={data}
                    action={formAction}
                    backHref={backHref}
                    fieldProps={fieldProps}
                />
            </TabsContent>

            <TabsContent value="history">
                <VersionHistory
                    versions={versions}
                    currentVersion={currentVersion}
                    revertAction={revertAction}
                />
            </TabsContent>
        </Tabs>
    )
}
