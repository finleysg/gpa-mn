"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { CalendarIcon, XIcon } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Label } from "@repo/ui/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover"
import { Calendar } from "@repo/ui/components/calendar"
import type { FosterApplicationStatus, FosterMilestone } from "@repo/database"
import { FOSTER_MILESTONES } from "@repo/database"
import { StatusControls } from "./status-controls"
import { setMilestoneAction, clearMilestoneAction } from "../_actions/detail-actions"

interface MilestoneData {
    milestone: {
        milestone: FosterMilestone
        completedAt: Date
    }
    userName: string
}

interface EnrichmentPanelProps {
    fosterApplicationId: number
    status: FosterApplicationStatus
    milestones: MilestoneData[]
}

const MILESTONE_LABELS: Record<FosterMilestone, string> = {
    screened: "Screened",
    interviewed: "Interviewed",
    reference_check: "References",
    home_visit: "Home Visit",
    approved: "Approved",
}

export function EnrichmentPanel({ fosterApplicationId, status, milestones }: EnrichmentPanelProps) {
    const milestoneMap = new Map(milestones.map((m) => [m.milestone.milestone, m.milestone]))

    return (
        <div className="space-y-6 rounded-lg border p-4">
            <div className="space-y-1.5">
                <Label>Status</Label>
                <StatusControls fosterApplicationId={fosterApplicationId} currentStatus={status} />
            </div>

            <div>
                <Label className="mb-2 block">Activity Dates</Label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                    {FOSTER_MILESTONES.map((milestone) => (
                        <MilestoneDatePicker
                            key={milestone}
                            fosterApplicationId={fosterApplicationId}
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
    fosterApplicationId,
    milestone,
    label,
    currentDate,
}: {
    fosterApplicationId: number
    milestone: FosterMilestone
    label: string
    currentDate: Date | null
}) {
    const [isPending, startTransition] = useTransition()

    function handleSelect(date: Date | undefined) {
        if (!date) return
        startTransition(async () => {
            const result = await setMilestoneAction(
                fosterApplicationId,
                milestone,
                date.toISOString(),
            )
            if ("errors" in result) toast.error(result.errors[0])
        })
    }

    function handleClear() {
        startTransition(async () => {
            const result = await clearMilestoneAction(fosterApplicationId, milestone)
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
