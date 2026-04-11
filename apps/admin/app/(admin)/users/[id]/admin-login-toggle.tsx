"use client"

import { useActionState, useState } from "react"
import { updateAdminLoginAction, type UpdateAdminLoginState } from "@/app/_actions/users"
import { Button } from "@repo/ui/components/button"
import { Switch } from "@repo/ui/components/switch"
import { Label } from "@repo/ui/components/label"

interface AdminLoginToggleProps {
    userId: string
    currentValue: boolean
}

export function AdminLoginToggle({ userId, currentValue }: AdminLoginToggleProps) {
    const [adminLogin, setAdminLogin] = useState(currentValue)
    const boundAction = updateAdminLoginAction.bind(null, userId)
    const [state, action, pending] = useActionState<UpdateAdminLoginState, FormData>(
        boundAction,
        {},
    )

    return (
        <form action={action} className="max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Admin Login</h2>
            <div className="flex items-center gap-3">
                <Switch
                    id="adminLogin"
                    checked={adminLogin}
                    onCheckedChange={setAdminLogin}
                    disabled={pending}
                />
                <input type="hidden" name="adminLogin" value={String(adminLogin)} />
                <Label htmlFor="adminLogin">Allow this user to log into the admin panel</Label>
            </div>
            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            {state.success && <p className="text-sm text-green-600">{state.message}</p>}
            <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save"}
            </Button>
        </form>
    )
}
