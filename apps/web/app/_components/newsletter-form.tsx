"use client"

import { useActionState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { subscribeToNewsletter } from "@/app/_actions/newsletter"

export function NewsletterForm({ variant }: { variant: "footer" | "card" }) {
    const [state, formAction, isPending] = useActionState(subscribeToNewsletter, undefined)

    if (state && "success" in state) {
        return (
            <div
                className={`flex items-center gap-2 ${variant === "footer" ? "text-white/80" : "text-foreground"}`}
            >
                <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                <p className="text-sm">{state.message}</p>
            </div>
        )
    }

    if (variant === "footer") {
        return (
            <form action={formAction} className="space-y-2">
                <div className="flex gap-2">
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="your@email.com"
                        className="min-w-0 flex-1 rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary hover:bg-primary/90 flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-70"
                    >
                        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Subscribe"}
                    </button>
                </div>
                {state?.errors && <p className="text-xs text-red-400">{state.errors[0]}</p>}
            </form>
        )
    }

    return (
        <form action={formAction} className="mt-4 space-y-3">
            <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="border-border bg-card focus:ring-primary/30 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
            />
            <button
                type="submit"
                disabled={isPending}
                className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors disabled:opacity-70"
            >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : "Subscribe"}
            </button>
            {state?.errors && <p className="text-destructive text-sm">{state.errors[0]}</p>}
        </form>
    )
}
