"use client"

import { useActionState } from "react"
import Link from "next/link"
import { createUserAction, type CreateUserState } from "@/app/_actions/users"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"

interface CreateUserFormProps {
    roles: { id: string; name: string }[]
}

export function CreateUserForm({ roles }: CreateUserFormProps) {
    const [state, action, pending] = useActionState<CreateUserState, FormData>(createUserAction, {})

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

            <div className="space-y-2">
                <Label htmlFor="tempPassword">Temporary password (optional)</Label>
                <Input
                    id="tempPassword"
                    name="tempPassword"
                    type="text"
                    minLength={8}
                    autoComplete="off"
                />
                <p className="text-muted-foreground text-xs">
                    Leave blank to create a data-only user with no admin login. If set, share it
                    with the user out-of-band; they can change it after signing in.
                </p>
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
