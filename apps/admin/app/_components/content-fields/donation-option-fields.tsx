import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { MarkdownEditor } from "../markdown-editor"

interface DonationOptionFieldsProps {
    data?: Record<string, unknown>
}

export function DonationOptionFields({ data }: DonationOptionFieldsProps) {
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="icon">Icon</Label>
                    <Input
                        id="icon"
                        name="icon"
                        defaultValue={(data?.icon as string) ?? ""}
                        required
                    />
                </div>
            </div>

            <MarkdownEditor
                name="description"
                label="Description"
                value={(data?.description as string) ?? ""}
            />

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="link">Link URL (optional)</Label>
                    <Input
                        id="link"
                        name="link"
                        type="url"
                        placeholder="https://..."
                        defaultValue={(data?.link as string) ?? ""}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkLabel">Link button label (optional)</Label>
                    <Input
                        id="linkLabel"
                        name="linkLabel"
                        placeholder="Donate, Visit, etc."
                        defaultValue={(data?.linkLabel as string) ?? ""}
                    />
                </div>
            </div>
        </>
    )
}
