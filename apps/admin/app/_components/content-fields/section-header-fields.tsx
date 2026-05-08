import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { MarkdownEditor } from "../markdown-editor"

interface SectionHeaderFieldsProps {
    data?: Record<string, unknown>
}

export function SectionHeaderFields({ data }: SectionHeaderFieldsProps) {
    return (
        <>
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
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    name="location"
                    defaultValue={(data?.location as string) ?? ""}
                    readOnly
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                />
                <p className="text-muted-foreground text-xs">
                    Identifier used by the public site to find this header. Managed in code; not
                    editable.
                </p>
            </div>

            <MarkdownEditor
                name="description"
                label="Description"
                value={(data?.description as string) ?? ""}
            />
        </>
    )
}
