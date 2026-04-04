"use client"

import { useState } from "react"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Switch } from "@repo/ui/components/switch"
import { MarkdownEditor } from "../markdown-editor"

interface PageFieldsProps {
    data?: Record<string, unknown>
    fixedSection?: string
}

export function PageFields({ data, fixedSection }: PageFieldsProps) {
    const [printable, setPrintable] = useState((data?.printable as boolean) ?? false)

    return (
        <>
            <input
                type="hidden"
                name="section"
                value={fixedSection ?? (data?.section as string) ?? "adopt"}
            />

            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={(data?.title as string) ?? ""}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (SEO)</Label>
                <Input
                    id="description"
                    name="description"
                    defaultValue={(data?.description as string) ?? ""}
                    placeholder="Short description for search engines (optional)"
                />
            </div>

            <MarkdownEditor name="body" label="Body" value={(data?.body as string) ?? ""} />

            <div className="flex items-center gap-2">
                <Switch id="printable" checked={printable} onCheckedChange={setPrintable} />
                <input type="hidden" name="printable" value={String(printable)} />
                <Label htmlFor="printable">Printable</Label>
            </div>
        </>
    )
}
