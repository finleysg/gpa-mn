'use client';

import { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import type { photos } from '@repo/database';
import { deletePhotoAction, reorderPhotosAction } from '../_actions/photos';
import { PhotoUpload, type CropConfig } from './photo-upload';

type Photo = typeof photos.$inferSelect;

interface PhotoGalleryProps {
  photoType: 'event' | 'content';
  parentId: number;
  existingPhotos: Photo[];
  s3PublicUrl: string;
  cropConfig: CropConfig;
}

export function PhotoGallery({
  photoType,
  parentId,
  existingPhotos,
  s3PublicUrl,
  cropConfig,
}: PhotoGalleryProps) {
  const [photoList, setPhotoList] = useState(existingPhotos);
  const photoListRef = useRef(existingPhotos);
  const [showUpload, setShowUpload] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dragIdxRef = useRef<number | null>(null);

  function updatePhotoList(updater: (prev: Photo[]) => Photo[]) {
    setPhotoList((prev) => {
      const next = updater(prev);
      photoListRef.current = next;
      return next;
    });
  }

  function handleDelete(photoId: number) {
    startTransition(async () => {
      const result = await deletePhotoAction(photoId);
      if ('errors' in result && result.errors) {
        toast.error(result.errors[0]);
      } else {
        toast.success('Photo deleted');
        updatePhotoList((prev) => prev.filter((p) => p.id !== photoId));
      }
    });
  }

  function handleDragStart(idx: number) {
    dragIdxRef.current = idx;
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdxRef.current === null || dragIdxRef.current === idx) return;
    const from = dragIdxRef.current;
    dragIdxRef.current = idx;

    updatePhotoList((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(idx, 0, moved!);
      return next;
    });
  }

  function handleDragEnd() {
    if (dragIdxRef.current === null) return;
    dragIdxRef.current = null;

    const orderedIds = photoListRef.current.map((p) => p.id);
    startTransition(async () => {
      await reorderPhotosAction(orderedIds);
      toast.success('Order saved');
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photoList.map((photo, idx) => (
          <div
            key={photo.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            className="group relative overflow-hidden rounded-lg border border-border bg-muted/30"
          >
            <div style={{ aspectRatio: cropConfig.aspectRatio }}>
              <img
                src={`${s3PublicUrl}/${photo.s3Key}`}
                alt={photo.originalFilename}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
              <button
                type="button"
                className="cursor-grab rounded bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <GripVertical className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(photo.id)}
                disabled={isPending}
                className="rounded bg-red-600/80 p-1 text-white hover:bg-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {photoList.length} photo{photoList.length !== 1 ? 's' : ''} — drag to reorder, hover to delete
      </p>

      {showUpload ? (
        <div className="max-w-sm">
          <PhotoUpload
            photoType={photoType}
            parentId={parentId}
            variant="default"
            existingPhoto={null}
            s3PublicUrl={s3PublicUrl}
            cropConfig={cropConfig}
            label="New Hero Photo"
            onSaved={(newPhoto) => {
              updatePhotoList((prev) => [...prev, newPhoto]);
              setShowUpload(false);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setShowUpload(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setShowUpload(true)}>
          <Plus className="mr-2 size-4" />
          Add Photo
        </Button>
      )}
    </div>
  );
}
