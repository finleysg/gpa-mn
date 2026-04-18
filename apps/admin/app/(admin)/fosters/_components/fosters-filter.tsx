"use client"

import { useRouter, usePathname } from "next/navigation"
import { useTransition } from "react"
import { Input } from "@repo/ui/components/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select"
import { Search } from "lucide-react"

const STATUS_OPTIONS = [
    { value: "active", label: "All (excl. drafts)" },
    { value: "all", label: "All (incl. drafts)" },
    { value: "submitted", label: "Submitted" },
    { value: "in_review", label: "In Review" },
    { value: "approved", label: "Approved" },
    { value: "denied", label: "Denied" },
    { value: "on_hold", label: "On Hold" },
    { value: "draft", label: "Draft" },
]

interface FostersFilterProps {
    currentStatus: string
    currentSearch: string
}

export function FostersFilter({ currentStatus, currentSearch }: FostersFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [, startTransition] = useTransition()

    function updateParams(key: string, value: string) {
        const params = new URLSearchParams()
        const nextStatus = key === "status" ? value : currentStatus
        const nextSearch = key === "search" ? value : currentSearch

        if (nextStatus && nextStatus !== "active") params.set("status", nextStatus)
        if (nextSearch) params.set("search", nextSearch)

        const qs = params.toString()
        startTransition(() => {
            router.replace(qs ? `${pathname}?${qs}` : pathname)
        })
    }

    return (
        <div className="mb-4 flex items-center gap-3">
            <Select
                value={currentStatus || "active"}
                onValueChange={(value) => updateParams("status", value)}
            >
                <SelectTrigger className="w-48">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                    placeholder="Search name or email..."
                    defaultValue={currentSearch}
                    className="w-64 pl-9"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            updateParams("search", e.currentTarget.value)
                        }
                    }}
                    onBlur={(e) => {
                        if (e.target.value !== currentSearch) {
                            updateParams("search", e.target.value)
                        }
                    }}
                />
            </div>
        </div>
    )
}
