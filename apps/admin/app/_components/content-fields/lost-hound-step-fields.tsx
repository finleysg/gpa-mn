import { Label } from "@repo/ui/components/label"
import { Textarea } from "@repo/ui/components/textarea"

interface LostHoundStepFieldsProps {
    data?: Record<string, unknown>
}

export function LostHoundStepFields({ data }: LostHoundStepFieldsProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="text">Step text</Label>
            <Textarea
                id="text"
                name="text"
                rows={3}
                required
                defaultValue={(data?.text as string) ?? ""}
            />
        </div>
    )
}
