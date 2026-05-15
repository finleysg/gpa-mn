"use client"

import { useActionState } from "react"
import { updateRoleAction, type UpdateRoleState } from "@/app/_actions/roles"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Textarea } from "@repo/ui/components/textarea"

interface EditRoleFormProps {
    roleId: string
    defaultName: string
    defaultDescription: string
    defaultDisplayOrder: number
}

export function EditRoleForm({
    roleId,
    defaultName,
    defaultDescription,
    defaultDisplayOrder,
}: EditRoleFormProps) {
    const boundAction = updateRoleAction.bind(null, roleId)
    const [state, action, pending] = useActionState<UpdateRoleState, FormData>(boundAction, {})

    return (
        <form action={action} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required maxLength={50} defaultValue={defaultName} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={defaultDescription}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="displayOrder">Display order</Label>
                <Input
                    id="displayOrder"
                    name="displayOrder"
                    type="number"
                    step={1}
                    defaultValue={defaultDisplayOrder}
                    className="w-32"
                />
                <p className="text-muted-foreground text-xs">
                    Controls the order of team cards on the About page. Lower numbers appear first;
                    ties fall back to alphabetical order.
                </p>
            </div>
            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            {state.success && <p className="text-sm text-green-600">Role updated.</p>}
            <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save details"}
            </Button>
        </form>
    )
}
