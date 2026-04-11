"use client"

import { useState, useTransition, useEffect } from "react"
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxEmpty,
} from "@repo/ui/components/combobox"
import { Label } from "@repo/ui/components/label"
import { updateHoundAction } from "../_actions/detail-actions"

interface Hound {
    id: string
    name: string
}

interface HoundSelectorProps {
    applicationId: number
    currentHoundId: string | null
    currentHoundName: string | null
}

export function HoundSelector({
    applicationId,
    currentHoundId,
    currentHoundName,
}: HoundSelectorProps) {
    const [hounds, setHounds] = useState<Hound[]>([])
    const [fetched, setFetched] = useState(false)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (!fetched) {
            fetch("/api/rescue-groups")
                .then((res) => res.json())
                .then((data: unknown) => {
                    setHounds(Array.isArray(data) ? data : [])
                    setFetched(true)
                })
                .catch(() => setFetched(true))
        }
    }, [fetched])

    function handleSelect(id: string, name: string) {
        startTransition(async () => {
            await updateHoundAction(applicationId, id, name)
        })
    }

    const selectedValue = currentHoundId
        ? { value: currentHoundId, label: currentHoundName ?? currentHoundId }
        : null

    return (
        <div className="space-y-1.5">
            <Label>Hound</Label>
            <Combobox
                value={selectedValue?.value ?? null}
                onValueChange={(value) => {
                    if (!value) {
                        startTransition(async () => {
                            await updateHoundAction(applicationId, null, null)
                        })
                        return
                    }
                    const hound = hounds.find((h) => h.id === value)
                    if (hound) handleSelect(hound.id, hound.name)
                }}
            >
                <ComboboxInput
                    placeholder={isPending ? "Saving..." : "Search hounds..."}
                    showClear={!!currentHoundId}
                    disabled={isPending}
                />
                <ComboboxContent>
                    <ComboboxList>
                        {hounds.map((hound) => (
                            <ComboboxItem key={hound.id} value={hound.id}>
                                {hound.name}
                            </ComboboxItem>
                        ))}
                        <ComboboxEmpty>{fetched ? "No hounds found" : "Loading..."}</ComboboxEmpty>
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    )
}
