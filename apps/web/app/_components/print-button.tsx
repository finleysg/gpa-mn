"use client"

import { Button } from "@repo/ui/components/button"
import { Printer } from "lucide-react"

export function PrintButton() {
    return (
        <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
            <Printer className="mr-2 size-4" />
            Print this page
        </Button>
    )
}
