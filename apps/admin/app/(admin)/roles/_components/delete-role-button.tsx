"use client"

import { useState, useTransition } from "react"
import { Button } from "@repo/ui/components/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog"
import { deleteRoleAction } from "@/app/_actions/roles"

interface DeleteRoleButtonProps {
    roleId: string
    name: string
    disabled?: boolean
}

export function DeleteRoleButton({ roleId, name, disabled }: DeleteRoleButtonProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    function handleConfirm() {
        setError(null)
        startTransition(async () => {
            try {
                await deleteRoleAction(roleId)
                setOpen(false)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to delete role")
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" disabled={disabled}>
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This removes the role and all of its permission assignments. Users currently
                        assigned must be reassigned first.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
