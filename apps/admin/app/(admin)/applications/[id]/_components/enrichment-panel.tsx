"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { CalendarIcon, XIcon } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Label } from "@repo/ui/components/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover"
import { Calendar } from "@repo/ui/components/calendar"
import type { Milestone } from "@repo/database"

const MILESTONES: Milestone[] = [
    "screened",
    "interviewed",
    "approved",
    "matched",
    "match_presented",
    "adopted",
]
import { StatusControls } from "./status-controls"
import { HoundSelector } from "./hound-selector"
import {
    updateAdoptionRepAction,
    setMilestoneAction,
    clearMilestoneAction,
} from "../_actions/detail-actions"
import type { ApplicationStatus } from "@repo/database"

interface MilestoneData {
    milestone: {
        milestone: Milestone
        completedAt: Date
    }
    userName: string
}

interface AdoptionRep {
    id: string
    name: string
    email: string
}

interface EnrichmentPanelProps {
    applicationId: number
    status: ApplicationStatus
    adoptionRep: string | null
    adoptionReps: AdoptionRep[]
    houndId: string | null
    houndName: string | null
    milestones: MilestoneData[]
}

const MILESTONE_LABELS: Record<Milestone, string> = {
    screened: "Screened",
    interviewed: "Interviewed",
    approved: "Approved",
    matched: "Matched",
    match_presented: "Match Presented",
    adopted: "Adopted",
}

export function EnrichmentPanel({
    applicationId,
    status,
    adoptionRep,
    adoptionReps,
    houndId,
    houndName,
    milestones,
}: EnrichmentPanelProps) {
    const [isRepPending, startRepTransition] = useTransition()

    const milestoneMap = new Map(milestones.map((m) => [m.milestone.milestone, m.milestone]))

    return (
        <div className="space-y-6 rounded-lg border p-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-1.5">
                    <Label>Status</Label>
                    <StatusControls applicationId={applicationId} currentStatus={status} />
                </div>

                <div className="space-y-1.5">
                    <Label>Adoption Rep</Label>
                    <Select
                        value={adoptionRep ?? "unassigned"}
                        onValueChange={(v) => {
                            const value = v === "unassigned" ? null : v
                            startRepTransition(async () => {
                                const result = await updateAdoptionRepAction(applicationId, value)
                                if ("errors" in result) toast.error(result.errors[0])
                            })
                        }}
                        disabled={isRepPending}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {adoptionReps.map((rep) => (
                                <SelectItem key={rep.id} value={rep.id}>
                                    {rep.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <HoundSelector
                    applicationId={applicationId}
                    currentHoundId={houndId}
                    currentHoundName={houndName}
                />
            </div>

            <div>
                <Label className="mb-2 block">Activity Dates</Label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                    {MILESTONES.map((milestone) => (
                        <MilestoneDatePicker
                            key={milestone}
                            applicationId={applicationId}
                            milestone={milestone}
                            label={MILESTONE_LABELS[milestone]}
                            currentDate={milestoneMap.get(milestone)?.completedAt ?? null}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function MilestoneDatePicker({
    applicationId,
    milestone,
    label,
    currentDate,
}: {
    applicationId: number
    milestone: Milestone
    label: string
    currentDate: Date | null
}) {
    const [isPending, startTransition] = useTransition()

    function handleSelect(date: Date | undefined) {
        if (!date) return
        startTransition(async () => {
            const result = await setMilestoneAction(applicationId, milestone, date.toISOString())
            if ("errors" in result) toast.error(result.errors[0])
        })
    }

    function handleClear() {
        startTransition(async () => {
            const result = await clearMilestoneAction(applicationId, milestone)
            if ("errors" in result) toast.error(result.errors[0])
        })
    }

    return (
        <div className="space-y-1">
            <span className="text-muted-foreground text-xs">{label}</span>
            <div className="flex items-center gap-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left text-xs font-normal"
                            disabled={isPending}
                        >
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {currentDate ? format(new Date(currentDate), "MM/dd/yy") : "Set date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={currentDate ? new Date(currentDate) : undefined}
                            onSelect={handleSelect}
                        />
                    </PopoverContent>
                </Popover>
                {currentDate && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={handleClear}
                        disabled={isPending}
                    >
                        <XIcon className="h-3 w-3" />
                    </Button>
                )}
            </div>
        </div>
    )
}
