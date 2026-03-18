'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  parse,
  isSameMonth,
  isSameDay,
  isToday,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSunday,
  format,
  getDay,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Badge } from '@repo/ui/components/badge';
import type { Event } from '@/app/_data/events';

// ── Types ──

type ParsedEvent = Event & { dates: Date[] };

type CalendarDay = {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: ParsedEvent[];
};

// ── Date parsing (unchanged) ──

function parseEventDates(event: Event, displayMonth: Date): Date[] {
  const dateStr = event.date;

  if (dateStr.toLowerCase().startsWith('every sunday')) {
    const start = startOfMonth(displayMonth);
    const end = endOfMonth(displayMonth);
    return eachDayOfInterval({ start, end }).filter((d) => isSunday(d));
  }

  const rangeMatch = dateStr.match(/^(\w+)\s+(\d+)[–-](\d+),\s*(\d{4})$/);
  if (rangeMatch) {
    const [, month, startDay, endDay, year] = rangeMatch;
    const start = parse(`${month} ${startDay}, ${year}`, 'MMMM d, yyyy', new Date());
    const end = parse(`${month} ${endDay}, ${year}`, 'MMMM d, yyyy', new Date());
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      return eachDayOfInterval({ start, end });
    }
  }

  const single = parse(dateStr, 'MMMM d, yyyy', new Date());
  if (!isNaN(single.getTime())) {
    return [single];
  }

  return [];
}

function getEventsForMonth(events: Event[], month: Date): ParsedEvent[] {
  return events
    .map((event) => ({
      ...event,
      dates: parseEventDates(event, month),
    }))
    .filter((e) => e.dates.some((d) => isSameMonth(d, month)));
}

// ── Build calendar grid ──

function buildCalendarDays(month: Date, parsedEvents: ParsedEvent[]): CalendarDay[][] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart); // Sunday
  const calEnd = endOfWeek(endOfWeek(addMonths(monthStart, 0))); // ensure we get enough weeks

  // Build 6 weeks (42 days) to keep grid consistent
  const allDays = eachDayOfInterval({
    start: calStart,
    end: eachDayOfInterval({ start: calStart, end: addMonths(calStart, 0) }).length >= 42
      ? calStart
      : calStart,
  });

  // Generate exactly 42 days (6 weeks)
  const days: Date[] = [];
  let cursor = calStart;
  for (let i = 0; i < 42; i++) {
    days.push(new Date(cursor));
    cursor = new Date(cursor.getTime() + 86400000);
  }

  const weeks: CalendarDay[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = days[w * 7 + d]!;
      const dayEvents = parsedEvents.filter((e) =>
        e.dates.some((ed) => isSameDay(ed, date))
      );
      week.push({
        date,
        day: date.getDate(),
        isCurrentMonth: isSameMonth(date, month),
        isToday: isToday(date),
        events: dayEvents,
      });
    }
    weeks.push(week);
  }

  return weeks;
}

// ── Event type colors ──

function getEventTypeColor(type: Event['type']): string {
  switch (type) {
    case 'Annual':
      return 'bg-primary/20 text-primary dark:bg-primary/30';
    case 'Fundraiser':
      return 'bg-secondary/30 text-[#2d7a81] dark:bg-secondary/20 dark:text-[#3a9da6]';
    case 'Monthly':
      return 'bg-amber-600/20 text-amber-700 dark:bg-amber-600/30 dark:text-amber-500';
    case 'Weekly':
      return 'bg-sky-600/20 text-sky-700 dark:bg-sky-600/30 dark:text-sky-400';
    case 'Seasonal':
      return 'bg-violet-600/20 text-violet-700 dark:bg-violet-600/30 dark:text-violet-400';
    case 'Special':
      return 'bg-rose-600/20 text-rose-700 dark:bg-rose-600/30 dark:text-rose-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

// ── Components ──

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CalendarHeader({
  month,
  onPrev,
  onNext,
}: {
  month: Date;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        type="button"
        onClick={onPrev}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeftIcon className="size-4" />
      </button>
      <h3 className="font-heading text-xl tracking-wider uppercase">
        {format(month, 'MMMM yyyy')}
      </h3>
      <button
        type="button"
        onClick={onNext}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Next month"
      >
        <ChevronRightIcon className="size-4" />
      </button>
    </div>
  );
}

function CalendarEventLink({ event }: { event: ParsedEvent }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className={`block rounded px-1.5 py-0.5 text-xs leading-tight font-medium truncate hover:opacity-80 transition-opacity ${getEventTypeColor(event.type)}`}
      title={`${event.title} — ${event.time}`}
    >
      {event.title}
    </Link>
  );
}

function CalendarGrid({ weeks }: { weeks: CalendarDay[][] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-muted-foreground bg-muted/50 border-b border-border"
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
              className={`min-h-24 p-1.5 border-b border-r border-border last:border-r-0 ${
                !day.isCurrentMonth ? 'bg-muted/30 opacity-40' : ''
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${
                  day.isToday
                    ? 'bg-primary text-white font-bold'
                    : 'text-foreground'
                }`}
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
  );
}

// ── Main component ──

export function EventCalendar({ events }: { events: Event[] }) {
  const [month, setMonth] = useState(() => new Date(2026, 2)); // March 2026 to match demo data

  const monthEvents = useMemo(() => getEventsForMonth(events, month), [events, month]);

  const weeks = useMemo(() => buildCalendarDays(month, monthEvents), [month, monthEvents]);

  return (
    <div>
      {/* Desktop: calendar grid + event list side by side */}
      <div className="hidden md:grid md:grid-cols-[7fr_3fr] md:gap-10 md:items-start">
        <div>
          <CalendarHeader
            month={month}
            onPrev={() => setMonth((m) => subMonths(m, 1))}
            onNext={() => setMonth((m) => addMonths(m, 1))}
          />
          <CalendarGrid weeks={weeks} />
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-xl tracking-wider uppercase mb-4">
            Events
          </h3>
          {monthEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events this month.</p>
          ) : (
            monthEvents.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))
          )}
        </div>
      </div>

      {/* Mobile: list only */}
      <div className="md:hidden space-y-3">
        {events.map((event) => (
          <EventListItem
            key={event.id}
            event={{ ...event, dates: parseEventDates(event, new Date()) }}
          />
        ))}
      </div>
    </div>
  );
}

function EventListItem({ event }: { event: ParsedEvent }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex items-start gap-4 bg-card rounded-2xl p-4 border border-border hover:-translate-y-0.5 hover:shadow-sm transition-all"
    >
      <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
        {event.dates[0] ? (
          <>
            <span className="text-[0.6rem] font-bold uppercase text-primary leading-none">
              {format(event.dates[0], 'MMM')}
            </span>
            <span className="text-sm font-bold text-primary leading-tight">
              {format(event.dates[0], 'd')}
            </span>
          </>
        ) : (
          <span className="text-[0.6rem] font-bold text-primary">TBD</span>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="font-semibold text-sm truncate">{event.title}</h4>
          <Badge
            variant="secondary"
            className="rounded-full text-[0.6rem] font-bold uppercase tracking-wider bg-secondary/30 text-[#2d7a81] dark:bg-secondary/20 dark:text-[#3a9da6] shrink-0"
          >
            {event.type}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{event.date} &middot; {event.time}</p>
      </div>
    </Link>
  );
}
