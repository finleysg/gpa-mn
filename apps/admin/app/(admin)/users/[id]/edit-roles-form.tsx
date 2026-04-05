"use client"

import { useActionState } from "react"
import Link from "next/link"
import { updateUserRolesAction, type UpdateRolesState } from "@/app/_actions/users"
import { Button } from "@repo/ui/components/button"
import { Label } from "@repo/ui/components/label"

interface EditRolesFormProps {
    userId: string
    allRoles: { id: string; name: string }[]
    currentRoleIds: string[]
}

export function EditRolesForm({ userId, allRoles, currentRoleIds }: EditRolesFormProps) {
    const boundAction = updateUserRolesAction.bind(null, userId)
    const [state, action, pending] = useActionState<UpdateRolesState, FormData>(boundAction, {})

    return (
        <form action={action} className="max-w-md space-y-6">
            <div className="space-y-2">
                <Label>Roles</Label>
                <div className="space-y-2">
                    {allRoles.map((role) => (
                        <label key={role.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="roleIds"
                                value={role.id}
                                defaultChecked={currentRoleIds.includes(role.id)}
                            />
                            <span className="text-sm">{role.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}

            <div className="flex gap-2">
                <Button type="submit" disabled={pending}>
                    {pending ? "Saving..." : "Save roles"}
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/users">Back</Link>
                </Button>
            </div>
        </form>
    )
}
