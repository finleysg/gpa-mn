"use client"

import { useActionState } from "react"
import { acceptInviteAction, type AcceptInviteState } from "@/app/_actions/accept-invite"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"

export function AcceptInviteForm({ email, token }: { email: string; token: string }) {
    const [state, action, pending] = useActionState<AcceptInviteState, FormData>(
        acceptInviteAction,
        {},
    )

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Complete your registration to access GPA‑MN Admin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <input type="hidden" name="token" value={token} />
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" type="text" required autoFocus />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={8}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={8}
                            />
                        </div>
                        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
                        <Button type="submit" className="w-full" disabled={pending}>
                            {pending ? "Creating account..." : "Create account"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
