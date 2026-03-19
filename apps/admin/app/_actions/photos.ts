'use server';

import {
  createPhoto,
  deletePhoto as dbDeletePhoto,
  getPhoto,
  reorderPhotos,
} from '@repo/database';
import { uploadToS3, deleteFromS3 } from '../lib/s3';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB (client resizes before upload)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function uploadPhotoAction(formData: FormData) {
  const file = formData.get('file') as File;
  const photoType = formData.get('photoType') as 'event' | 'content';
  const parentId = Number(formData.get('parentId'));
  const variant = (formData.get('variant') as 'desktop' | 'mobile' | 'default') ?? 'default';

  if (!file || !photoType || !parentId) {
    return { errors: ['Missing required fields'] };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { errors: ['File type not allowed. Use JPEG, PNG, WebP, or GIF.'] };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { errors: ['File too large. Maximum size is 1MB.'] };
  }

  const ext = file.name.split('.').pop() ?? 'jpg';
  const key = `${photoType}/${parentId}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const s3Key = await uploadToS3(buffer, key, file.type);

  const result = await createPhoto({
    photoType,
    parentId,
    variant,
    s3Key,
    originalFilename: file.name,
    contentType: file.type,
  });

  return { success: true as const, id: result.id, s3Key };
}

export async function deletePhotoAction(id: number) {
  const photo = await getPhoto(id);
  if (!photo) {
    return { errors: ['Photo not found'] };
  }

  await deleteFromS3(photo.s3Key);
  await dbDeletePhoto(id);
  return { success: true as const };
}

export async function reorderPhotosAction(orderedIds: number[]) {
  await reorderPhotos(orderedIds);
  return { success: true as const };
}
