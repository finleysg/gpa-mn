"use client"

import { useState } from "react"
import { Button } from "@repo/ui/components/button"
import { Copy, Check } from "lucide-react"

export function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button variant="ghost" size="icon" className="size-7" onClick={handleCopy}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
    )
}
