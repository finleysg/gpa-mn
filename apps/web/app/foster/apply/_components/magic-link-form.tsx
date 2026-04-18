"use client"

import { useActionState } from "react"
import { CheckCircle2, Loader2, Mail } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { requestMagicLink } from "../_actions/application"

export function MagicLinkForm() {
    const [state, formAction, isPending] = useActionState(requestMagicLink, undefined)

    if (state && "success" in state) {
        return (
            <div className="rounded-lg border p-6 text-center">
                <CheckCircle2 className="mx-auto mb-3 size-10 text-green-500" />
                <h2 className="mb-1 text-lg font-semibold">Check Your Email</h2>
                <p className="text-muted-foreground text-sm">{state.message}</p>
            </div>
        )
    }

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" name="email" type="email" required placeholder="your@email.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" name="firstName" required placeholder="First" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" name="lastName" required placeholder="Last" />
                </div>
            </div>
            {state?.errors && <p className="text-destructive text-sm">{state.errors[0]}</p>}
            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <>
                        <Mail className="size-4" />
                        Send Application Link
                    </>
                )}
            </Button>
        </form>
    )
}
