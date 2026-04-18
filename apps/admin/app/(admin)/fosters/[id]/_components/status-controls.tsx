"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@repo/ui/components/alert-dialog"
import { StatusBadge } from "../../_components/status-badge"
import type { FosterApplicationStatus } from "@repo/database"
import { changeStatusAction } from "../_actions/detail-actions"

const FOSTER_APPLICATION_STATUSES: FosterApplicationStatus[] = [
    "draft",
    "submitted",
    "in_review",
    "approved",
    "denied",
    "on_hold",
]

const STATUS_LABELS: Record<FosterApplicationStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    in_review: "In Review",
    approved: "Approved",
    denied: "Denied",
    on_hold: "On Hold",
}

interface StatusControlsProps {
    fosterApplicationId: number
    currentStatus: FosterApplicationStatus
}

export function StatusControls({ fosterApplicationId, currentStatus }: StatusControlsProps) {
    const [pendingStatus, setPendingStatus] = useState<FosterApplicationStatus | null>(null)
    const [isPending, startTransition] = useTransition()

    function handleConfirm() {
        if (!pendingStatus) return
        startTransition(async () => {
            const result = await changeStatusAction(fosterApplicationId, pendingStatus)
            if ("errors" in result) {
                toast.error(result.errors[0])
            }
            setPendingStatus(null)
        })
    }

    return (
        <div className="flex items-center gap-3">
            <StatusBadge status={currentStatus} />
            <Select
                value={currentStatus}
                onValueChange={(v) => setPendingStatus(v as FosterApplicationStatus)}
            >
                <SelectTrigger className="w-36">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {FOSTER_APPLICATION_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                            {STATUS_LABELS[status]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <AlertDialog open={!!pendingStatus} onOpenChange={() => setPendingStatus(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Status</AlertDialogTitle>
                        <AlertDialogDescription>
                            Change status from <strong>{STATUS_LABELS[currentStatus]}</strong> to{" "}
                            <strong>{pendingStatus ? STATUS_LABELS[pendingStatus] : ""}</strong>?
                            This will be recorded in the application timeline.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
                            {isPending ? "Changing..." : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
