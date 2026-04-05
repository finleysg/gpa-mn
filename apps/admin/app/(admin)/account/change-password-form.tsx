"use client"

import { useState } from "react"
import { authClient } from "@/app/lib/auth-client"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"

export function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setSuccess(false)

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }

        setLoading(true)

        try {
            const { error: changeError } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            })

            if (changeError) {
                setError(changeError.message ?? "Failed to change password.")
                return
            }

            setSuccess(true)
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">Password changed successfully.</p>}
            <Button type="submit" disabled={loading}>
                {loading ? "Changing..." : "Change password"}
            </Button>
        </form>
    )
}
