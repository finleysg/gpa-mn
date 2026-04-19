"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
    parse,
    isSameMonth,
    isSameDay,
    isToday,
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    addMonths,
    subMonths,
    getDay,
    format,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Badge } from "@repo/ui/components/badge"
import { cn } from "@repo/ui/lib/utils"
import type { WebEvent } from "@/app/_lib/content"

// ── Types ──

type ParsedEvent = WebEvent & { dates: Date[] }

type CalendarDay = {
    date: Date
    day: number
    isCurrentMonth: boolean
    isToday: boolean
    events: ParsedEvent[]
}

// ── Date parsing (unchanged) ──

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

function parseEventDates(event: WebEvent, displayMonth: Date): Date[] {
    const dateStr = event.date

    // Weekly: "Every Monday", "Every Sunday", etc.
    const weeklyMatch = dateStr.match(/^Every (\w+)$/i)
    if (weeklyMatch) {
        const dayIndex = DAY_NAMES.indexOf(weeklyMatch[1]!.toLowerCase())
        if (dayIndex >= 0) {
            const start = startOfMonth(displayMonth)
            const end = endOfMonth(displayMonth)
            return eachDayOfInterval({ start, end }).filter((d) => getDay(d) === dayIndex)
        }
    }

    // Monthly by date: "Monthly on the 15th"
    const monthlyDateMatch = dateStr.match(/^Monthly on the (\d+)/)
    if (monthlyDateMatch) {
        const dayOfMonth = parseInt(monthlyDateMatch[1]!, 10)
        const candidate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), dayOfMonth)
        if (candidate.getMonth() === displayMonth.getMonth()) {
            return [candidate]
        }
        return []
    }

    // Monthly by weekday: "3rd Sunday of each month"
    const monthlyWeekdayMatch = dateStr.match(/^(\d)(?:st|nd|rd|th) (\w+) of each month$/i)
    if (monthlyWeekdayMatch) {
        const nth = parseInt(monthlyWeekdayMatch[1]!, 10)
        const dayIndex = DAY_NAMES.indexOf(monthlyWeekdayMatch[2]!.toLowerCase())
        if (dayIndex >= 0) {
            const start = startOfMonth(displayMonth)
            const end = endOfMonth(displayMonth)
            const matchingDays = eachDayOfInterval({ start, end }).filter(
                (d) => getDay(d) === dayIndex,
            )
            const target = matchingDays[nth - 1]
            return target ? [target] : []
        }
    }

    // Date range: "March 15–17, 2026"
    const rangeMatch = dateStr.match(/^(\w+)\s+(\d+)[–-](\d+),\s*(\d{4})$/)
    if (rangeMatch) {
        const [, month, startDay, endDay, year] = rangeMatch
        const start = parse(`${month} ${startDay}, ${year}`, "MMMM d, yyyy", new Date())
        const end = parse(`${month} ${endDay}, ${year}`, "MMMM d, yyyy", new Date())
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            return eachDayOfInterval({ start, end })
        }
    }

    // Single date: "March 15, 2026"
    const single = parse(dateStr, "MMMM d, yyyy", new Date())
    if (!isNaN(single.getTime())) {
        return [single]
    }

    return []
}

function getEventsForMonth(events: WebEvent[], month: Date): ParsedEvent[] {
    return events
        .map((event) => ({
            ...event,
            dates: parseEventDates(event, month),
        }))
        .filter((e) => e.dates.some((d) => isSameMonth(d, month)))
}

// ── Build calendar grid ──

function buildCalendarDays(month: Date, parsedEvents: ParsedEvent[]): CalendarDay[][] {
    const monthStart = startOfMonth(month)
    const calStart = startOfWeek(monthStart) // Sunday

    // Generate exactly 42 days (6 weeks)
    const days: Date[] = []
    let cursor = calStart
    for (let i = 0; i < 42; i++) {
        days.push(new Date(cursor))
        cursor = new Date(cursor.getTime() + 86400000)
    }

    const weeks: CalendarDay[][] = []
    for (let w = 0; w < 6; w++) {
        const week: CalendarDay[] = []
        for (let d = 0; d < 7; d++) {
            const date = days[w * 7 + d]!
            const dayEvents = parsedEvents.filter((e) => e.dates.some((ed) => isSameDay(ed, date)))
            week.push({
                date,
                day: date.getDate(),
                isCurrentMonth: isSameMonth(date, month),
                isToday: isToday(date),
                events: dayEvents,
            })
        }
        weeks.push(week)
    }

    return weeks
}

// ── Event type colors ──

function getEventTypeColor(type: WebEvent["type"]): string {
    switch (type) {
        case "Annual":
            return "bg-primary/20 text-primary dark:bg-primary/30"
        case "Fundraiser":
            return "bg-secondary/30 text-[#2d7a81] dark:bg-secondary/20 dark:text-[#3a9da6]"
        case "Monthly":
            return "bg-amber-600/20 text-amber-900 dark:bg-amber-600/30 dark:text-amber-300"
        case "Weekly":
            return "bg-sky-600/20 text-sky-700 dark:bg-sky-600/30 dark:text-sky-400"
        case "Seasonal":
            return "bg-violet-600/20 text-violet-700 dark:bg-violet-600/30 dark:text-violet-400"
        case "Special":
            return "bg-rose-600/20 text-rose-700 dark:bg-rose-600/30 dark:text-rose-400"
        default:
            return "bg-muted text-muted-foreground"
    }
}

// ── Components ──

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function CalendarHeader({
    month,
    onPrev,
    onNext,
}: {
    month: Date
    onPrev: () => void
    onNext: () => void
}) {
    return (
        <div className="mb-4 flex items-center justify-between">
            <button
                type="button"
                onClick={onPrev}
                className="hover:bg-accent flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                aria-label="Previous month"
            >
                <ChevronLeftIcon className="size-4" />
            </button>
            <h3 className="font-heading text-xl tracking-wider uppercase">
                {format(month, "MMMM yyyy")}
            </h3>
            <button
                type="button"
                onClick={onNext}
                className="hover:bg-accent flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                aria-label="Next month"
            >
                <ChevronRightIcon className="size-4" />
            </button>
        </div>
    )
}

function CalendarEventLink({ event }: { event: ParsedEvent }) {
    return (
        <Link
            href={`/events/${event.id}`}
            className={cn(
                "block truncate rounded px-1.5 py-0.5 text-xs leading-tight font-medium transition-opacity hover:opacity-80",
                getEventTypeColor(event.type),
            )}
            title={`${event.title} — ${event.time}`}
        >
            {event.title}
        </Link>
    )
}

function CalendarGrid({ weeks }: { weeks: CalendarDay[][] }) {
    return (
        <div className="border-border overflow-hidden rounded-xl border">
            {/* Weekday headers */}
            <div className="grid grid-cols-7">
                {WEEKDAYS.map((day) => (
                    <div
                        key={day}
                        className="text-muted-foreground bg-muted/50 border-border border-b py-2 text-center text-xs font-semibold"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                    {week.map((day) => (
                        <div
                            key={day.date.toISOString()}
                            className={cn(
                                "border-border min-h-24 border-r border-b p-1.5 last:border-r-0",
                                !day.isCurrentMonth && "bg-muted/30",
                            )}
                        >
                            <div
                                className={cn(
                                    "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs",
                                    day.isToday
                                        ? "bg-primary font-bold text-white"
                                        : day.isCurrentMonth
                                          ? "text-foreground"
                                          : "text-muted-foreground",
                                )}
                            >
                                {day.day}
                            </div>
                            <div className="space-y-0.5">
                                {day.events.map((event) => (
                                    <CalendarEventLink key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

// ── Main component ──

export function EventCalendar({ events }: { events: WebEvent[] }) {
    const [month, setMonth] = useState(() => new Date(2026, 2)) // March 2026 to match demo data

    const monthEvents = useMemo(() => getEventsForMonth(events, month), [events, month])

    const weeks = useMemo(() => buildCalendarDays(month, monthEvents), [month, monthEvents])

    return (
        <div>
            {/* Desktop: calendar grid + event list side by side */}
            <div className="hidden md:grid md:grid-cols-[7fr_3fr] md:items-start md:gap-10">
                <div>
                    <CalendarHeader
                        month={month}
                        onPrev={() => setMonth((m) => subMonths(m, 1))}
                        onNext={() => setMonth((m) => addMonths(m, 1))}
                    />
                    <CalendarGrid weeks={weeks} />
                </div>

                <div className="space-y-3">
                    <h3 className="font-heading mb-4 text-xl tracking-wider uppercase">Events</h3>
                    {monthEvents.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No events this month.</p>
                    ) : (
                        monthEvents.map((event) => <EventListItem key={event.id} event={event} />)
                    )}
                </div>
            </div>

            {/* Mobile: list only */}
            <div className="space-y-3 md:hidden">
                {events.map((event) => (
                    <EventListItem
                        key={event.id}
                        event={{ ...event, dates: parseEventDates(event, new Date()) }}
                    />
                ))}
            </div>
        </div>
    )
}

function EventListItem({ event }: { event: ParsedEvent }) {
    return (
        <Link
            href={`/events/${event.id}`}
            className="bg-card border-border flex items-start gap-4 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
        >
            <div className="bg-primary/10 flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl">
                {event.dates[0] ? (
                    <>
                        <span className="text-primary text-[0.6rem] leading-none font-bold uppercase">
                            {format(event.dates[0], "MMM")}
                        </span>
                        <span className="text-primary text-sm leading-tight font-bold">
                            {format(event.dates[0], "d")}
                        </span>
                    </>
                ) : (
                    <span className="text-primary text-[0.6rem] font-bold">TBD</span>
                )}
            </div>
            <div className="min-w-0">
                <div className="mb-0.5 flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold">{event.title}</h4>
                    <Badge
                        variant="secondary"
                        className="bg-secondary/30 dark:bg-secondary/20 shrink-0 rounded-full text-[0.6rem] font-bold tracking-wider text-[#2d7a81] uppercase dark:text-[#3a9da6]"
                    >
                        {event.type}
                    </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                    {event.date} &middot; {event.time}
                </p>
            </div>
        </Link>
    )
}
