'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import Cropper from 'react-easy-crop';
import { toast } from 'sonner';
import { Check, ImageIcon, Pencil, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { Label } from '@repo/ui/components/label';
import type { photos } from '@repo/database';
import { uploadPhotoAction, deletePhotoAction } from '../_actions/photos';
import { cropImage, type CropArea } from '../_lib/crop-image';

type Photo = typeof photos.$inferSelect;

export interface CropConfig {
  aspectRatio: number;
  outputWidth: number;
  outputHeight: number;
  maxSizeBytes: number;
}

interface PhotoUploadProps {
  photoType: 'event' | 'content';
  parentId: number;
  variant: 'desktop' | 'mobile' | 'default';
  existingPhoto: Photo | null;
  s3PublicUrl: string;
  cropConfig: CropConfig;
  label: string;
  onSaved?: (photo: Photo) => void;
}

type Mode = 'empty' | 'cropping' | 'staged' | 'saved';

export function PhotoUpload({
  photoType,
  parentId,
  variant,
  existingPhoto,
  s3PublicUrl,
  cropConfig,
  label,
  onSaved,
}: PhotoUploadProps) {
  const [photo, setPhoto] = useState(existingPhoto);
  const [mode, setMode] = useState<Mode>(existingPhoto ? 'saved' : 'empty');

  // Cropping state
  const [originalImageUrl, setOriginalImageUrlState] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  // Staged state
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedPreviewUrl, setStagedPreviewUrlState] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const originalImageUrlRef = useRef<string | null>(null);
  const stagedPreviewUrlRef = useRef<string | null>(null);

  function setOriginalImageUrl(url: string | null) {
    originalImageUrlRef.current = url;
    setOriginalImageUrlState(url);
  }

  function setStagedPreviewUrl(url: string | null) {
    stagedPreviewUrlRef.current = url;
    setStagedPreviewUrlState(url);
  }

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (originalImageUrlRef.current) URL.revokeObjectURL(originalImageUrlRef.current);
      if (stagedPreviewUrlRef.current) URL.revokeObjectURL(stagedPreviewUrlRef.current);
    };
  }, []);

  const onCropComplete = useCallback((_: unknown, pixels: CropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up previous state
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
    setStagedFile(null);
    setStagedPreviewUrl(null);

    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setMode('cropping');

    if (inputRef.current) inputRef.current.value = '';
  }

  function handleCropDone() {
    if (!originalImageUrl || !croppedAreaPixels) return;

    startTransition(async () => {
      const file = await cropImage(originalImageUrl, croppedAreaPixels, {
        outputWidth: cropConfig.outputWidth,
        outputHeight: cropConfig.outputHeight,
        maxSizeBytes: cropConfig.maxSizeBytes,
      });

      if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
      const previewUrl = URL.createObjectURL(file);

      setStagedFile(file);
      setStagedPreviewUrl(previewUrl);
      setMode('staged');
    });
  }

  function handleRecrop() {
    if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
    setStagedFile(null);
    setStagedPreviewUrl(null);
    setMode('cropping');
  }

  function handleSave() {
    if (!stagedFile) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set('file', stagedFile);
      formData.set('photoType', photoType);
      formData.set('parentId', String(parentId));
      formData.set('variant', variant);

      if (photo) {
        await deletePhotoAction(photo.id);
      }

      const result = await uploadPhotoAction(formData);
      if ('errors' in result && result.errors) {
        toast.error(result.errors[0]);
        return;
      }

      toast.success('Photo saved');
      const newPhoto: Photo = {
        id: result.id,
        s3Key: result.s3Key,
        photoType,
        parentId,
        variant,
        originalFilename: stagedFile.name,
        contentType: stagedFile.type,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Clean up
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
      if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
      setOriginalImageUrl(null);
      setStagedFile(null);
      setStagedPreviewUrl(null);

      if (onSaved) {
        onSaved(newPhoto);
        setMode('empty');
      } else {
        setPhoto(newPhoto);
        setMode('saved');
      }
    });
  }

  function handleCancel() {
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
    setOriginalImageUrl(null);
    setStagedFile(null);
    setStagedPreviewUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setMode(photo ? 'saved' : 'empty');
  }

  function handleDelete() {
    if (!photo) return;
    startTransition(async () => {
      const result = await deletePhotoAction(photo.id);
      if ('errors' in result && result.errors) {
        toast.error(result.errors[0]);
      } else {
        toast.success('Photo deleted');
        setPhoto(null);
        setMode('empty');
      }
    });
  }

  const aspectRatioStr = `${cropConfig.aspectRatio}/1`;

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <div
        className="border-input relative w-full overflow-hidden rounded-lg border"
        style={{ aspectRatio: aspectRatioStr }}
      >
        {mode === 'cropping' && originalImageUrl ? (
          <Cropper
            image={originalImageUrl}
            crop={crop}
            zoom={zoom}
            aspect={cropConfig.aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { position: 'absolute', inset: 0 },
            }}
          />
        ) : mode === 'staged' && stagedPreviewUrl ? (
          <img
            src={stagedPreviewUrl}
            alt={label}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : mode === 'saved' && photo ? (
          <img
            src={`${s3PublicUrl}/${photo.s3Key}`}
            alt={photo.originalFilename}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="bg-muted/30 flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-transparent">
            <ImageIcon className="text-muted-foreground/40 size-10" />
            <p className="text-muted-foreground/60 text-sm">No photo uploaded</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />

        {mode === 'cropping' ? (
          <>
            <Button type="button" variant="outline" size="sm" onClick={handleCropDone} disabled={isPending}>
              <Check className="mr-2 size-4" />
              {isPending ? 'Processing...' : 'Done'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isPending}>
              <X className="mr-2 size-4" />
              Cancel
            </Button>
          </>
        ) : mode === 'staged' ? (
          <>
            <Button type="button" variant="outline" size="sm" onClick={handleSave} disabled={isPending}>
              <Check className="mr-2 size-4" />
              {isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleRecrop} disabled={isPending}>
              <Pencil className="mr-2 size-4" />
              Re-crop
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isPending}>
              <X className="mr-2 size-4" />
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
            >
              <Upload className="mr-2 size-4" />
              {photo ? 'Replace' : 'Upload'}
            </Button>
            {photo && (
              <Button type="button" variant="outline" size="sm" onClick={handleDelete} disabled={isPending}>
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
