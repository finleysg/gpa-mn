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

interface DeactivateButtonProps {
    name: string
    action: () => Promise<void>
}

export function DeactivateButton({ name, action }: DeactivateButtonProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    Deactivate
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Deactivate user</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to deactivate &ldquo;{name}&rdquo;? They will no
                        longer be able to sign in.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <form action={action}>
                        <Button variant="destructive" type="submit">
                            Deactivate
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
