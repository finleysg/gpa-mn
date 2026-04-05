"use client"

import { useState } from "react"
import { authClient } from "@/app/lib/auth-client"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"

export function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
    const [newEmail, setNewEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setSuccess(false)
        setLoading(true)

        try {
            const { error: changeError } = await authClient.changeEmail({
                newEmail,
                callbackURL: "/account",
            })

            if (changeError) {
                setError(changeError.message ?? "Failed to update email.")
                return
            }

            setSuccess(true)
            setNewEmail("")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="currentEmail">Current email</Label>
                <Input id="currentEmail" type="email" value={currentEmail} disabled />
            </div>
            <div className="space-y-2">
                <Label htmlFor="newEmail">New email</Label>
                <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && (
                <p className="text-sm text-green-600">
                    Verification email sent. Check your new email to confirm the change.
                </p>
            )}
            <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update email"}
            </Button>
        </form>
    )
}
