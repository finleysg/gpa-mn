"use client"

import { useState } from "react"
import { Button } from "@repo/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/dialog"

interface RestoreButtonProps {
    title: string
    entityName?: string
    action: () => Promise<void>
}

export function RestoreButton({ title, entityName = "item", action }: RestoreButtonProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    Restore
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Restore {entityName}</DialogTitle>
                    <DialogDescription>
                        Restore &ldquo;{title}&rdquo;? It will appear on the public site again.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <form action={action}>
                        <Button type="submit">Restore</Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
