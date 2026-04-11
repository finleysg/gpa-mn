"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { createUserAction, type CreateUserState } from "@/app/_actions/users"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Switch } from "@repo/ui/components/switch"

interface CreateUserFormProps {
    roles: { id: string; name: string }[]
}

export function CreateUserForm({ roles }: CreateUserFormProps) {
    const [state, action, pending] = useActionState<CreateUserState, FormData>(createUserAction, {})
    const [sendInvitation, setSendInvitation] = useState(false)

    return (
        <form action={action} className="max-w-md space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" required autoFocus />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" name="phone" type="tel" />
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

            <div className="flex items-center gap-3">
                <Switch
                    id="sendInvitation"
                    checked={sendInvitation}
                    onCheckedChange={setSendInvitation}
                    disabled={pending}
                />
                <input type="hidden" name="sendInvitation" value={String(sendInvitation)} />
                <Label htmlFor="sendInvitation">
                    Send invitation (enables admin login and sends password setup email)
                </Label>
            </div>

            {state.error && (
                <p className="text-sm text-red-600">
                    {state.error}
                    {state.existingUserId && (
                        <>
                            {" "}
                            <Link href={`/users/${state.existingUserId}`} className="underline">
                                View existing user
                            </Link>
                        </>
                    )}
                </p>
            )}

            <div className="flex gap-2">
                <Button type="submit" disabled={pending}>
                    {pending ? "Creating..." : "Create user"}
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/users">Cancel</Link>
                </Button>
            </div>
        </form>
    )
}
