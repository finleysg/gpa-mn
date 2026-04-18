import { Badge } from "@repo/ui/components/badge"
import type { FosterApplicationStatus } from "@repo/database"

const STATUS_CONFIG: Record<
    FosterApplicationStatus,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
    draft: { label: "Draft", variant: "outline" },
    submitted: { label: "Submitted", variant: "default" },
    in_review: { label: "In Review", variant: "secondary" },
    approved: { label: "Approved", variant: "default" },
    denied: { label: "Denied", variant: "destructive" },
    on_hold: { label: "On Hold", variant: "outline" },
}

export function StatusBadge({ status }: { status: FosterApplicationStatus }) {
    const config = STATUS_CONFIG[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
}
