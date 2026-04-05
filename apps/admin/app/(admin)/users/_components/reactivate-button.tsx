"use client"

import { Button } from "@repo/ui/components/button"

interface ReactivateButtonProps {
    action: () => Promise<void>
}

export function ReactivateButton({ action }: ReactivateButtonProps) {
    return (
        <form action={action}>
            <Button variant="ghost" size="sm" type="submit">
                Reactivate
            </Button>
        </form>
    )
}
