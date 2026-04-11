"use client"

import { useState, useTransition } from "react"
import { toggleWebsiteVisibleAction } from "@/app/_actions/roles"
import { Switch } from "@repo/ui/components/switch"

interface WebsiteVisibleToggleProps {
    roleId: string
    currentValue: boolean
}

export function WebsiteVisibleToggle({ roleId, currentValue }: WebsiteVisibleToggleProps) {
    const [checked, setChecked] = useState(currentValue)
    const [isPending, startTransition] = useTransition()

    function handleChange(value: boolean) {
        setChecked(value)
        const formData = new FormData()
        formData.set("websiteVisible", String(value))
        startTransition(async () => {
            await toggleWebsiteVisibleAction(roleId, {}, formData)
        })
    }

    return <Switch checked={checked} onCheckedChange={handleChange} disabled={isPending} />
}
