import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Textarea } from "@repo/ui/components/textarea"

interface RequiredReadingFieldsProps {
    data?: Record<string, unknown>
}

export function RequiredReadingFields({ data }: RequiredReadingFieldsProps) {
    return (
        <>
            <div className="grid grid-cols-[1fr_auto] gap-4">
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
                    <Label htmlFor="order">Order</Label>
                    <Input
                        id="order"
                        name="order"
                        type="number"
                        min={0}
                        step={1}
                        className="w-24"
                        defaultValue={(data?.order as number) ?? 0}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                    id="author"
                    name="author"
                    defaultValue={(data?.author as string) ?? ""}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={(data?.description as string) ?? ""}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="purchaseUrl">Purchase URL</Label>
                <Input
                    id="purchaseUrl"
                    name="purchaseUrl"
                    type="url"
                    placeholder="https://www.amazon.com/..."
                    defaultValue={(data?.purchaseUrl as string) ?? ""}
                    required
                />
                <p className="text-muted-foreground text-xs">
                    Typically an Amazon product page. Opens in a new tab.
                </p>
            </div>
        </>
    )
}
