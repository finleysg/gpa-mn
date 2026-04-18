"use client"

import { useActionState } from "react"
import { updateRolePermissionsAction, type UpdateRolePermissionsState } from "@/app/_actions/roles"
import { Button } from "@repo/ui/components/button"

interface PermissionOption {
    id: string
    name: string
    description: string | null
}

interface RolePermissionsFormProps {
    roleId: string
    permissions: PermissionOption[]
    assignedIds: string[]
}

export function RolePermissionsForm({
    roleId,
    permissions,
    assignedIds,
}: RolePermissionsFormProps) {
    const boundAction = updateRolePermissionsAction.bind(null, roleId)
    const [state, action, pending] = useActionState<UpdateRolePermissionsState, FormData>(
        boundAction,
        {},
    )

    return (
        <form action={action} className="space-y-4">
            <div className="space-y-3">
                {permissions.map((p) => (
                    <label key={p.id} className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            name="permissionIds"
                            value={p.id}
                            defaultChecked={assignedIds.includes(p.id)}
                            className="mt-1"
                        />
                        <div>
                            <div className="font-medium">{p.name}</div>
                            {p.description && (
                                <div className="text-muted-foreground text-sm">{p.description}</div>
                            )}
                        </div>
                    </label>
                ))}
            </div>

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            {state.success && <p className="text-sm text-green-600">Permissions saved.</p>}

            <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save permissions"}
            </Button>
        </form>
    )
}
