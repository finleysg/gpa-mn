"use client"

import { useState, useTransition } from "react"
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
import type { ApplicationStatus } from "@repo/database"

const APPLICATION_STATUSES: ApplicationStatus[] = [
    "draft",
    "submitted",
    "in_review",
    "approved",
    "adopted",
    "denied",
    "on_hold",
]
import { changeStatusAction } from "../_actions/detail-actions"

const STATUS_LABELS: Record<ApplicationStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    in_review: "In Review",
    approved: "Approved",
    adopted: "Adopted",
    denied: "Denied",
    on_hold: "On Hold",
}

interface StatusControlsProps {
    applicationId: number
    currentStatus: ApplicationStatus
}

export function StatusControls({ applicationId, currentStatus }: StatusControlsProps) {
    const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null)
    const [isPending, startTransition] = useTransition()

    function handleConfirm() {
        if (!pendingStatus) return
        startTransition(async () => {
            await changeStatusAction(applicationId, pendingStatus)
            setPendingStatus(null)
        })
    }

    return (
        <div className="flex items-center gap-3">
            <StatusBadge status={currentStatus} />
            <Select
                value={currentStatus}
                onValueChange={(v) => setPendingStatus(v as ApplicationStatus)}
            >
                <SelectTrigger className="w-36">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {APPLICATION_STATUSES.map((status) => (
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
