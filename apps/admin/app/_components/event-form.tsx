'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Switch } from '@repo/ui/components/switch';
import { Textarea } from '@repo/ui/components/textarea';
import { MarkdownEditor } from './markdown-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import type { events } from '@repo/database';

type Event = typeof events.$inferSelect;

const eventTypes = ['Annual', 'Fundraiser', 'Monthly', 'Weekly', 'Seasonal', 'Special'] as const;
const recurrenceOptions = ['once', 'weekly', 'monthly'] as const;

type ActionResult = { errors: string[] } | { success: true } | undefined;

interface EventFormProps {
  event?: Event;
  action: (formData: FormData) => Promise<ActionResult>;
}

export function EventForm({ event, action }: EventFormProps) {
  const [state, formAction] = useActionState(
    async (_prev: ActionResult, formData: FormData) => action(formData),
    undefined,
  );
  const [showUpcoming, setShowUpcoming] = useState(event?.showUpcoming ?? true);

  useEffect(() => {
    if (state && 'success' in state) {
      toast.success('Event saved');
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state && 'errors' in state && (
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
          <Label htmlFor="showUpcoming" className="whitespace-nowrap">Show in Upcoming</Label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={event?.startDate} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" defaultValue={event?.time} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="recurrence">Recurrence</Label>
          <Select name="recurrence" defaultValue={event?.recurrence ?? 'once'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {recurrenceOptions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={event?.endDate ?? ''} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={event?.location} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={event?.type ?? 'Annual'}>
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

      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea id="description" name="description" defaultValue={event?.description} required rows={3} />
      </div>

      <MarkdownEditor name="longDescription" label="Long Description" value={event?.longDescription ?? ''} />

      <div className="flex gap-3">
        <Button type="submit">{event ? 'Save Changes' : 'Create Event'}</Button>
        <Button variant="ghost" asChild>
          <Link href="/events">Back</Link>
        </Button>
      </div>
    </form>
  );
}
