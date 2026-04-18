"use client"

import { useActionState, useState } from "react"
import {
    updateNotificationSettingsAction,
    type UpdateNotificationSettingsState,
} from "@/app/_actions/account"
import { Button } from "@repo/ui/components/button"
import { Switch } from "@repo/ui/components/switch"
import { Label } from "@repo/ui/components/label"

export function NotificationSettingsForm({
    notifyOnSubmission,
    notifyOnAssignment,
    notifyOnFosterSubmission,
    showSubmission,
    showAssignment,
    showFosterSubmission,
}: {
    notifyOnSubmission: boolean
    notifyOnAssignment: boolean
    notifyOnFosterSubmission: boolean
    showSubmission: boolean
    showAssignment: boolean
    showFosterSubmission: boolean
}) {
    const [submission, setSubmission] = useState(notifyOnSubmission)
    const [assignment, setAssignment] = useState(notifyOnAssignment)
    const [fosterSubmission, setFosterSubmission] = useState(notifyOnFosterSubmission)
    const [state, action, pending] = useActionState<UpdateNotificationSettingsState, FormData>(
        updateNotificationSettingsAction,
        {},
    )

    return (
        <form action={action} className="space-y-4">
            {showSubmission && (
                <div className="flex items-center gap-3">
                    <Switch
                        id="notifyOnSubmission"
                        checked={submission}
                        onCheckedChange={setSubmission}
                        disabled={pending}
                    />
                    <input type="hidden" name="notifyOnSubmission" value={String(submission)} />
                    <Label htmlFor="notifyOnSubmission">
                        Notify me when an adoption application is submitted
                    </Label>
                </div>
            )}
            {showAssignment && (
                <div className="flex items-center gap-3">
                    <Switch
                        id="notifyOnAssignment"
                        checked={assignment}
                        onCheckedChange={setAssignment}
                        disabled={pending}
                    />
                    <input type="hidden" name="notifyOnAssignment" value={String(assignment)} />
                    <Label htmlFor="notifyOnAssignment">
                        Notify me when I am assigned to an application
                    </Label>
                </div>
            )}
            {showFosterSubmission && (
                <div className="flex items-center gap-3">
                    <Switch
                        id="notifyOnFosterSubmission"
                        checked={fosterSubmission}
                        onCheckedChange={setFosterSubmission}
                        disabled={pending}
                    />
                    <input
                        type="hidden"
                        name="notifyOnFosterSubmission"
                        value={String(fosterSubmission)}
                    />
                    <Label htmlFor="notifyOnFosterSubmission">
                        Notify me when a foster application is submitted
                    </Label>
                </div>
            )}
            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            {state.success && (
                <p className="text-sm text-green-600">Notification settings updated.</p>
            )}
            <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save"}
            </Button>
        </form>
    )
}
