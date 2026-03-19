'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/components/tabs';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { MarkdownEditor } from './markdown-editor';
import { PhotoGallery } from './photo-gallery';
import type { photos } from '@repo/database';

type Photo = typeof photos.$inferSelect;
type ActionResult = { errors: string[] } | { success: true } | undefined;

interface EditHomeTabsProps {
  data: Record<string, unknown>;
  formAction: (formData: FormData) => Promise<ActionResult>;
  existingPhotos: Photo[];
  parentId: number;
  s3PublicUrl: string;
}

export function EditHomeTabs({
  data,
  formAction,
  existingPhotos,
  parentId,
  s3PublicUrl,
}: EditHomeTabsProps) {
  const [state, action] = useActionState(
    async (_prev: ActionResult, formData: FormData) => formAction(formData),
    undefined,
  );

  useEffect(() => {
    if (state && 'success' in state) {
      toast.success('Saved successfully');
    }
  }, [state]);

  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <form action={action} className="max-w-2xl space-y-6">
          {state && 'errors' in state && (
            <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {state.errors.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={(data?.title as string) ?? ''} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlight">Highlight</Label>
            <Input
              id="highlight"
              name="highlight"
              defaultValue={(data?.highlight as string) ?? ''}
              placeholder="Word or phrase from the title to highlight"
            />
          </div>

          <MarkdownEditor name="description" label="Description" value={(data?.description as string) ?? ''} />

          <div className="space-y-2">
            <Label htmlFor="changeNote">Change Note</Label>
            <Input id="changeNote" name="changeNote" placeholder="Describe what changed (optional)" />
          </div>

          <input type="hidden" name="badge" value={(data?.badge as string) ?? ''} />
          <input type="hidden" name="variant" value={(data?.variant as string) ?? 'default'} />
          <input type="hidden" name="location" value={(data?.location as string) ?? ''} />

          <Button type="submit">Save Changes</Button>
        </form>
      </TabsContent>

      <TabsContent value="photos">
        <PhotoGallery
          photoType="content"
          parentId={parentId}
          existingPhotos={existingPhotos}
          s3PublicUrl={s3PublicUrl}
          cropConfig={{
            aspectRatio: 1,
            outputWidth: 800,
            outputHeight: 800,
            maxSizeBytes: 500 * 1024,
          }}
        />
      </TabsContent>
    </Tabs>
  );
}
