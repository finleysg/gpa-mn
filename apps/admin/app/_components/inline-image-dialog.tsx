"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { Trash2, Upload } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { Label } from "@repo/ui/components/label"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/components/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select"
import type { photos } from "@repo/database"
import { deletePhotoAction, getInlinePhotosAction, uploadPhotoAction } from "../_actions/photos"
import { resizeImage } from "../_lib/resize-image"

type Photo = typeof photos.$inferSelect

export type InlineImageAlign = "left" | "right" | "center" | "none"
export type InlineImageSize = "small" | "medium" | "large"

export interface InlineImageInsertion {
    src: string
    alt: string
    title: string
}

interface InlineImageDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    photoType: "event" | "content"
    parentId: number
    s3PublicUrl: string
    onInsert: (data: InlineImageInsertion) => void
}

export function InlineImageDialog({
    open,
    onOpenChange,
    photoType,
    parentId,
    s3PublicUrl,
    onInsert,
}: InlineImageDialogProps) {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [altText, setAltText] = useState("")
    const [align, setAlign] = useState<InlineImageAlign>("left")
    const [size, setSize] = useState<InlineImageSize>("medium")
    const [isPending, startTransition] = useTransition()
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!open) return
        startTransition(async () => {
            const list = await getInlinePhotosAction(photoType, parentId)
            setPhotos(list)
            if (list.length > 0 && selectedId === null) {
                setSelectedId(list[0]!.id)
                setAltText(stripExt(list[0]!.originalFilename))
            }
        })
    }, [open, photoType, parentId, selectedId])

    function stripExt(filename: string): string {
        return filename.replace(/\.[^.]+$/, "")
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        if (inputRef.current) inputRef.current.value = ""

        startTransition(async () => {
            try {
                const resized = await resizeImage(file, {
                    maxWidth: 1200,
                    maxBytes: 400 * 1024,
                })
                const formData = new FormData()
                formData.set("file", resized)
                formData.set("photoType", photoType)
                formData.set("parentId", String(parentId))
                formData.set("variant", "inline")
                const result = await uploadPhotoAction(formData)
                if ("errors" in result && result.errors) {
                    toast.error(result.errors[0])
                    return
                }
                const newPhoto: Photo = {
                    id: result.id,
                    s3Key: result.s3Key,
                    photoType,
                    parentId,
                    variant: "inline",
                    originalFilename: file.name,
                    contentType: "image/webp",
                    sortOrder: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
                setPhotos((prev) => [...prev, newPhoto])
                setSelectedId(newPhoto.id)
                setAltText(stripExt(newPhoto.originalFilename))
                toast.success("Image uploaded")
            } catch {
                toast.error("Could not process image")
            }
        })
    }

    function handleDelete(id: number) {
        startTransition(async () => {
            const result = await deletePhotoAction(id)
            if ("errors" in result && result.errors) {
                toast.error(result.errors[0])
                return
            }
            setPhotos((prev) => prev.filter((p) => p.id !== id))
            if (selectedId === id) setSelectedId(null)
            toast.success("Image deleted")
        })
    }

    function handleInsert() {
        const photo = photos.find((p) => p.id === selectedId)
        if (!photo) return
        onInsert({
            src: `${s3PublicUrl}/${photo.s3Key}`,
            alt: altText || stripExt(photo.originalFilename),
            title: `${align} ${size}`,
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Insert Image</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                            disabled={isPending}
                        >
                            <Upload className="mr-2 size-4" />
                            Upload New
                        </Button>
                    </div>

                    {photos.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                            No images yet — upload one above.
                        </p>
                    ) : (
                        <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto">
                            {photos.map((p) => {
                                const url = `${s3PublicUrl}/${p.s3Key}`
                                const isSelected = selectedId === p.id
                                return (
                                    <div
                                        key={p.id}
                                        className={`group relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 ${
                                            isSelected
                                                ? "border-primary"
                                                : "hover:border-border border-transparent"
                                        }`}
                                        onClick={() => {
                                            setSelectedId(p.id)
                                            if (!altText) setAltText(stripExt(p.originalFilename))
                                        }}
                                    >
                                        <img
                                            src={url}
                                            alt={p.originalFilename}
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(p.id)
                                            }}
                                            className="absolute top-1 right-1 hidden rounded bg-black/60 p-1 text-white group-hover:block"
                                            aria-label="Delete image"
                                        >
                                            <Trash2 className="size-3" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {selectedId !== null && (
                        <div className="space-y-3 border-t pt-4">
                            <div className="space-y-1">
                                <Label htmlFor="inline-alt">Alt text</Label>
                                <input
                                    id="inline-alt"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    placeholder="Describe the image"
                                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label>Alignment</Label>
                                    <Select
                                        value={align}
                                        onValueChange={(v) => setAlign(v as InlineImageAlign)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="left">Left (text wraps)</SelectItem>
                                            <SelectItem value="right">
                                                Right (text wraps)
                                            </SelectItem>
                                            <SelectItem value="center">Center</SelectItem>
                                            <SelectItem value="none">Inline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Size</Label>
                                    <Select
                                        value={size}
                                        onValueChange={(v) => setSize(v as InlineImageSize)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="small">Small</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="large">Large</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleInsert}
                        disabled={isPending || selectedId === null}
                    >
                        Insert
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
