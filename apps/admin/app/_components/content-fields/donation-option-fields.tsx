import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Textarea } from "@repo/ui/components/textarea"
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

            <div className="space-y-2">
                <Label htmlFor="embedHtml">Embed HTML (optional)</Label>
                <Textarea
                    id="embedHtml"
                    name="embedHtml"
                    rows={8}
                    placeholder="Paste a donate button / form / script snippet from your donation provider (e.g. PayPal, Stripe, Donorbox)."
                    defaultValue={(data?.embedHtml as string) ?? ""}
                    className="font-mono text-xs"
                />
                <p className="text-muted-foreground text-xs">
                    Rendered as-is on the public site. Any &lt;script&gt; tags will execute.
                </p>
            </div>
        </>
    )
}
