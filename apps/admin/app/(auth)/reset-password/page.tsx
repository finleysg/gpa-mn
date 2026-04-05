"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { authClient } from "@/app/lib/auth-client"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"

export default function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }

        setLoading(true)

        try {
            const { error: resetError } = await authClient.resetPassword({
                newPassword: password,
                token: token ?? "",
            })

            if (resetError) {
                setError(
                    resetError.message ?? "Failed to reset password. The link may have expired.",
                )
                return
            }

            setSuccess(true)
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Invalid link</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm">
                            This password reset link is invalid or has expired.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="text-muted-foreground text-sm hover:underline"
                        >
                            Request a new reset link
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Reset password</CardTitle>
                    <CardDescription>Enter your new password</CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="space-y-4">
                            <p className="text-sm">Your password has been reset successfully.</p>
                            <Link href="/login" className="text-sm font-medium hover:underline">
                                Sign in with your new password
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    autoFocus
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
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Resetting..." : "Reset password"}
                            </Button>
                            <div className="text-center">
                                <Link
                                    href="/forgot-password"
                                    className="text-muted-foreground text-sm hover:underline"
                                >
                                    Request a new link
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
