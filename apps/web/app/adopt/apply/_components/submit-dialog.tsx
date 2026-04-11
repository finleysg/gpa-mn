"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
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
import { submitApplicationAction } from "../_actions/application"

interface SubmitDialogProps {
    applicationId: number
}

export function SubmitDialog({ applicationId }: SubmitDialogProps) {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit() {
        setIsPending(true)
        setError(null)
        const result = await submitApplicationAction(applicationId)
        // If we get here, it means there was an error (success redirects)
        if (result && "error" in result) {
            setError(result.error)
        }
        setIsPending(false)
    }

    return (
        <div className="space-y-2">
            {error && <p className="text-destructive text-sm">{error}</p>}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="lg" className="w-full">
                        Submit Application
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit your application?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Once submitted, you won&apos;t be able to make changes to your
                            application. Please make sure all information is correct before
                            proceeding.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit} disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                "Yes, Submit"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
