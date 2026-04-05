"use client"

import { useActionState } from "react"
import Link from "next/link"
import { inviteUserAction, type InviteUserState } from "@/app/_actions/users"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"

interface InviteFormProps {
    roles: { id: string; name: string }[]
}

export function InviteForm({ roles }: InviteFormProps) {
    const [state, action, pending] = useActionState<InviteUserState, FormData>(inviteUserAction, {})

    return (
        <form action={action} className="max-w-md space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoFocus />
            </div>

            <div className="space-y-2">
                <Label>Roles</Label>
                <div className="space-y-2">
                    {roles.map((role) => (
                        <label key={role.id} className="flex items-center gap-2">
                            <input type="checkbox" name="roleIds" value={role.id} />
                            <span className="text-sm">{role.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}

            <div className="flex gap-2">
                <Button type="submit" disabled={pending}>
                    {pending ? "Sending invite..." : "Send invite"}
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/users">Cancel</Link>
                </Button>
            </div>
        </form>
    )
}
