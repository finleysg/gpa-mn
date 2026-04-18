"use client"

import { useActionState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createRoleAction, type CreateRoleState } from "@/app/_actions/roles"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Textarea } from "@repo/ui/components/textarea"

export function NewRoleForm() {
    const router = useRouter()
    const [state, action, pending] = useActionState<CreateRoleState, FormData>(createRoleAction, {})

    useEffect(() => {
        if (state.roleId) {
            router.push(`/roles/${state.roleId}`)
        }
    }, [state.roleId, router])

    return (
        <form action={action} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required maxLength={50} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
            </div>

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}

            <div className="flex gap-2">
                <Button type="submit" disabled={pending}>
                    {pending ? "Creating..." : "Create role"}
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/roles">Cancel</Link>
                </Button>
            </div>
        </form>
    )
}
