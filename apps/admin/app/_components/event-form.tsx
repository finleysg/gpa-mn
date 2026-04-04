"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { parse, format, addDays, getDay } from "date-fns"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Switch } from "@repo/ui/components/switch"
import { MarkdownEditor } from "./markdown-editor"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select"
import type { events } from "@repo/database"

type Event = typeof events.$inferSelect

const eventTypes = ["Annual", "Fundraiser", "Monthly", "Weekly", "Seasonal", "Special"] as const

const recurrenceOptions = [
    { value: "once", label: "Once" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly_by_date", label: "Monthly (same date)" },
    { value: "monthly_by_weekday", label: "Monthly (same weekday)" },
] as const

const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const

type ActionResult = { errors: string[] } | { success: true } | undefined

interface EventFormProps {
    event?: Event
    action: (formData: FormData) => Promise<ActionResult>
}

function getWeekdayHint(dateStr: string): string | null {
    if (!dateStr) return null
    const date = parse(dateStr, "yyyy-MM-dd", new Date())
    if (isNaN(date.getTime())) return null
    const weekNumber = Math.ceil(date.getDate() / 7)
    const ordinals = ["1st", "2nd", "3rd", "4th", "5th"]
    return `Recurs on the ${ordinals[weekNumber - 1]} ${format(date, "EEEE")} of each month`
}

function nearestDateForDay(currentDateStr: string, targetDay: number): string {
    const current = currentDateStr ? parse(currentDateStr, "yyyy-MM-dd", new Date()) : new Date()
    if (isNaN(current.getTime())) return currentDateStr
    const currentDay = getDay(current)
    const diff = (targetDay - currentDay + 7) % 7
    const target = diff === 0 ? current : addDays(current, diff)
    return format(target, "yyyy-MM-dd")
}

export function EventForm({ event, action }: EventFormProps) {
    const [state, formAction] = useActionState(
        async (_prev: ActionResult, formData: FormData) => action(formData),
        undefined,
    )
    const [showUpcoming, setShowUpcoming] = useState(event?.showUpcoming ?? true)
    const [recurrence, setRecurrence] = useState<string>(event?.recurrence ?? "once")
    const [startDate, setStartDate] = useState(event?.startDate ?? "")
    const startDateRef = useRef<HTMLInputElement>(null)

    const weeklyDay = useMemo(() => {
        if (!startDate) return "0"
        const d = parse(startDate, "yyyy-MM-dd", new Date())
        return isNaN(d.getTime()) ? "0" : String(getDay(d))
    }, [startDate])

    const weekdayHint = useMemo(() => {
        if (recurrence !== "monthly_by_weekday") return null
        return getWeekdayHint(startDate)
    }, [recurrence, startDate])

    useEffect(() => {
        if (state && "success" in state) {
            toast.success("Event saved")
        }
    }, [state])

    function handleDayChange(dayIndex: string) {
        const newDate = nearestDateForDay(startDate, parseInt(dayIndex, 10))
        setStartDate(newDate)
        if (startDateRef.current) {
            startDateRef.current.value = newDate
        }
    }

    return (
        <form action={formAction} className="max-w-2xl space-y-6">
            {state && "errors" in state && (
                <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                    {state.errors.map((error: string) => (
                        <p key={error}>{error}</p>
                    ))}
                </div>
            )}
            <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" defaultValue={event?.title} required />
                </div>
                <div className="flex items-center gap-2 pb-2">
                    <Switch
                        id="showUpcoming"
                        checked={showUpcoming}
                        onCheckedChange={setShowUpcoming}
                    />
                    <input type="hidden" name="showUpcoming" value={String(showUpcoming)} />
                    <Label htmlFor="showUpcoming" className="whitespace-nowrap">
                        Show in Upcoming
                    </Label>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        ref={startDateRef}
                        id="startDate"
                        name="startDate"
                        type="date"
                        defaultValue={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" defaultValue={event?.time} required />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="recurrence">Recurrence</Label>
                    <Select name="recurrence" value={recurrence} onValueChange={setRecurrence}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {recurrenceOptions.map((r) => (
                                <SelectItem key={r.value} value={r.value}>
                                    {r.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        defaultValue={event?.endDate ?? ""}
                    />
                </div>
            </div>

            {recurrence === "weekly" && (
                <div className="space-y-2">
                    <Label>Day of Week</Label>
                    <Select value={weeklyDay} onValueChange={handleDayChange}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {DAY_NAMES.map((name, i) => (
                                <SelectItem key={name} value={String(i)}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-xs">
                        Start date will be adjusted to match the selected day.
                    </p>
                </div>
            )}

            {recurrence === "monthly_by_weekday" && weekdayHint && (
                <p className="text-muted-foreground text-sm">{weekdayHint}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" defaultValue={event?.location} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue={event?.type ?? "Annual"}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {eventTypes.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <MarkdownEditor
                name="description"
                label="Short Description"
                value={event?.description ?? ""}
            />

            <MarkdownEditor
                name="longDescription"
                label="Long Description"
                value={event?.longDescription ?? ""}
            />

            <div className="flex gap-3">
                <Button type="submit">{event ? "Save Changes" : "Create Event"}</Button>
                <Button variant="ghost" asChild>
                    <Link href="/events">Back</Link>
                </Button>
            </div>
        </form>
    )
}
