export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropOptions {
  outputWidth: number;
  outputHeight: number;
  maxSizeBytes: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to create blob'))),
      type,
      quality,
    );
  });
}

/**
 * Crop an image using explicit pixel coordinates from react-easy-crop,
 * then compress as WebP.
 */
export async function cropImage(
  imageSrc: string,
  cropArea: CropArea,
  options: CropOptions,
): Promise<File> {
  const { outputWidth, outputHeight, maxSizeBytes } = options;
  const img = await loadImage(imageSrc);

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  let quality = 0.85;
  let blob = await canvasToBlob(canvas, 'image/webp', quality);

  while (blob.size > maxSizeBytes && quality > 0.5) {
    quality -= 0.05;
    blob = await canvasToBlob(canvas, 'image/webp', quality);
  }

  return new File([blob], 'photo.webp', { type: 'image/webp' });
}
