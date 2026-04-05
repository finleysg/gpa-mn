"use client"

import { useActionState } from "react"
import { updatePhoneAction, type UpdatePhoneState } from "@/app/_actions/account"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"

export function PhoneForm({ currentPhone }: { currentPhone: string | null }) {
    const [state, action, pending] = useActionState<UpdatePhoneState, FormData>(
        updatePhoneAction,
        {},
    )

    return (
        <form action={action} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={currentPhone ?? ""} />
            </div>
            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            {state.success && <p className="text-sm text-green-600">Phone number updated.</p>}
            <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save phone"}
            </Button>
        </form>
    )
}
