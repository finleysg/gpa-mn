import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { MarkdownEditor } from "../markdown-editor"

interface WhyChooseUsFieldsProps {
    data?: Record<string, unknown>
}

export function WhyChooseUsFields({ data }: WhyChooseUsFieldsProps) {
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

            <MarkdownEditor name="body" label="Body" value={(data?.body as string) ?? ""} />
        </>
    )
}
