"use client"

import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/app/lib/auth-client"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await authClient.requestPasswordReset({
                email,
                redirectTo: "/reset-password",
            })
            setSubmitted(true)
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Forgot password</CardTitle>
                    <CardDescription>
                        Enter your email and we&#39;ll send you a reset link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <div className="space-y-4">
                            <p className="text-sm">
                                If an account exists for that email, we&#39;ve sent a password reset
                                link. Check your inbox.
                            </p>
                            <Link
                                href="/login"
                                className="text-muted-foreground text-sm hover:underline"
                            >
                                Back to sign in
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Sending..." : "Send reset link"}
                            </Button>
                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-muted-foreground text-sm hover:underline"
                                >
                                    Back to sign in
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
