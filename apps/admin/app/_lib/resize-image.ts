interface ResizeOptions {
    maxWidth: number
    maxBytes: number
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create blob"))),
            type,
            quality,
        )
    })
}

export async function resizeImage(file: File, options: ResizeOptions): Promise<File> {
    const url = URL.createObjectURL(file)
    try {
        const img = await loadImage(url)
        const scale = Math.min(1, options.maxWidth / img.naturalWidth)
        const width = Math.round(img.naturalWidth * scale)
        const height = Math.round(img.naturalHeight * scale)

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0, width, height)

        let quality = 0.9
        let blob = await canvasToBlob(canvas, "image/webp", quality)
        while (blob.size > options.maxBytes && quality > 0.4) {
            quality -= 0.1
            blob = await canvasToBlob(canvas, "image/webp", quality)
        }

        const baseName = file.name.replace(/\.[^.]+$/, "")
        return new File([blob], `${baseName}.webp`, { type: "image/webp" })
    } finally {
        URL.revokeObjectURL(url)
    }
}
