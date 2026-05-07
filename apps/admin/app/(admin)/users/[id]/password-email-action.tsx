"use client"

import { useActionState } from "react"
import { sendPasswordEmailAction, type SendPasswordEmailState } from "@/app/_actions/users"
import { Button } from "@repo/ui/components/button"

interface PasswordEmailActionProps {
    userId: string
    hasPassword: boolean
}

export function PasswordEmailAction({ userId, hasPassword }: PasswordEmailActionProps) {
    const boundAction = sendPasswordEmailAction.bind(null, userId)
    const [state, action, pending] = useActionState<SendPasswordEmailState, FormData>(
        boundAction,
        {},
    )

    const label = hasPassword ? "Send password reset email" : "Send password setup email"
    const helper = hasPassword
        ? "Sends a password reset link to this user's email."
        : "This user has no password yet. Send them a link to set one up."

    return (
        <form action={action} className="max-w-md space-y-3">
            <h2 className="text-lg font-semibold">Password</h2>
            <p className="text-muted-foreground text-sm">{helper}</p>
            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            {state.success && <p className="text-sm text-green-600">{state.message}</p>}
            <Button type="submit" variant="outline" disabled={pending}>
                {pending ? "Sending..." : label}
            </Button>
        </form>
    )
}
