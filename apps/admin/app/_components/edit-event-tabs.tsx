'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/components/tabs';
import { EventForm } from './event-form';
import { PhotoUpload } from './photo-upload';
import type { events, photos } from '@repo/database';

type Event = typeof events.$inferSelect;
type Photo = typeof photos.$inferSelect;

type ActionResult = { errors: string[] } | { success: true } | undefined;

interface EditEventTabsProps {
  event: Event;
  desktopPhoto: Photo | null;
  mobilePhoto: Photo | null;
  action: (formData: FormData) => Promise<ActionResult>;
  s3PublicUrl: string;
}

export function EditEventTabs({
  event,
  desktopPhoto,
  mobilePhoto,
  action,
  s3PublicUrl,
}: EditEventTabsProps) {
  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <EventForm event={event} action={action} />
      </TabsContent>

      <TabsContent value="photos" forceMount className="data-[state=inactive]:hidden">
        <div className="max-w-2xl space-y-8 pt-2">
          <PhotoUpload
            photoType="event"
            parentId={event.id}
            variant="desktop"
            existingPhoto={desktopPhoto}
            s3PublicUrl={s3PublicUrl}
            cropConfig={{ aspectRatio: 4, outputWidth: 1200, outputHeight: 300, maxSizeBytes: 358400 }}
            label="Desktop Photo"
          />
          <div className="max-w-sm">
            <PhotoUpload
              photoType="event"
              parentId={event.id}
              variant="mobile"
              existingPhoto={mobilePhoto}
              s3PublicUrl={s3PublicUrl}
              cropConfig={{ aspectRatio: 2, outputWidth: 600, outputHeight: 300, maxSizeBytes: 204800 }}
              label="Mobile Photo"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
