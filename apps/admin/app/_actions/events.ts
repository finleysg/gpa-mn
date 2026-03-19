'use server';

import {
  createEvent as dbCreateEvent,
  updateEvent as dbUpdateEvent,
  archiveEvent as dbArchiveEvent,
} from '@repo/database';
import type { events } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { validateEventData } from './validate-event';
import { revalidateWeb } from '../_lib/revalidate-web';

type EventInsert = typeof events.$inferInsert;

function parseEventFormData(formData: FormData): EventInsert {
  const endDate = formData.get('endDate') as string;
  return {
    title: formData.get('title') as string,
    startDate: formData.get('startDate') as string,
    endDate: endDate || null,
    recurrence: (formData.get('recurrence') as EventInsert['recurrence']) ?? 'once',
    time: formData.get('time') as string,
    location: formData.get('location') as string,
    type: formData.get('type') as EventInsert['type'],
    description: formData.get('description') as string,
    longDescription: formData.get('longDescription') as string,
    showUpcoming: formData.get('showUpcoming') === 'true',
  };
}

export async function createEventAction(formData: FormData) {
  const data = parseEventFormData(formData);

  const errors = validateEventData(data);
  if (errors.length > 0) {
    return { errors };
  }

  const result = await dbCreateEvent(data);
  revalidatePath('/events');
  await revalidateWeb(['/events']);
  redirect(`/events/${result.id}`);
}

export async function updateEventAction(id: number, formData: FormData) {
  const data = parseEventFormData(formData);

  const errors = validateEventData(data);
  if (errors.length > 0) {
    return { errors };
  }

  await dbUpdateEvent(id, data);
  revalidatePath('/events');
  await revalidateWeb(['/events']);
  return { success: true as const };
}

export async function archiveEventAction(id: number) {
  await dbArchiveEvent(id);
  revalidatePath('/events');
  await revalidateWeb(['/events']);
  redirect('/events');
}
