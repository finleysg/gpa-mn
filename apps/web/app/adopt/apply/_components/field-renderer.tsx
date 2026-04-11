"use client"

import type { FieldDef } from "@repo/types"
import { Input } from "@repo/ui/components/input"
import { Textarea } from "@repo/ui/components/textarea"
import { Label } from "@repo/ui/components/label"
import { Checkbox } from "@repo/ui/components/checkbox"
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select"
import { Button } from "@repo/ui/components/button"
import { cn } from "@repo/ui/lib/utils"
import { Plus, Trash2 } from "lucide-react"

interface FieldRendererProps {
    field: FieldDef
    value: unknown
    onChange: (name: string, value: unknown) => void
    error?: string
    /** Prefix for repeating field entry names */
    namePrefix?: string
}

export function FieldRenderer({ field, value, onChange, error, namePrefix }: FieldRendererProps) {
    const fieldName = namePrefix ? `${namePrefix}.${field.name}` : field.name
    const stringValue = value != null ? String(value) : ""

    return (
        <div className="space-y-2">
            {field.type !== "checkbox" && field.type !== "repeating" && field.type !== "scale" && (
                <Label htmlFor={fieldName}>
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}
            {field.helpText && <p className="text-muted-foreground text-sm">{field.helpText}</p>}

            {renderField(field, fieldName, value, stringValue, onChange)}

            {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
    )
}

function renderField(
    field: FieldDef,
    fieldName: string,
    value: unknown,
    stringValue: string,
    onChange: (name: string, value: unknown) => void,
) {
    switch (field.type) {
        case "text":
        case "email":
        case "phone":
            return (
                <Input
                    id={fieldName}
                    name={fieldName}
                    type={field.type === "phone" ? "tel" : field.type}
                    value={stringValue}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                />
            )

        case "number":
            return (
                <Input
                    id={fieldName}
                    name={fieldName}
                    type="number"
                    value={stringValue}
                    onChange={(e) =>
                        onChange(field.name, e.target.value ? Number(e.target.value) : undefined)
                    }
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder}
                />
            )

        case "textarea":
            return (
                <Textarea
                    id={fieldName}
                    name={fieldName}
                    value={stringValue}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                />
            )

        case "radio":
            return (
                <RadioGroup
                    name={fieldName}
                    value={stringValue}
                    onValueChange={(v) => onChange(field.name, v)}
                >
                    {field.options?.map((opt) => (
                        <div key={opt.value} className="flex items-center gap-2">
                            <RadioGroupItem value={opt.value} id={`${fieldName}-${opt.value}`} />
                            <Label htmlFor={`${fieldName}-${opt.value}`} className="font-normal">
                                {opt.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )

        case "dropdown":
            return (
                <Select
                    name={fieldName}
                    value={stringValue}
                    onValueChange={(v) => onChange(field.name, v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={field.placeholder ?? "Select..."} />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options?.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )

        case "checkbox":
            return (
                <CheckboxGroup
                    field={field}
                    fieldName={fieldName}
                    value={value}
                    onChange={onChange}
                />
            )

        case "scale":
            return (
                <ScaleInput field={field} fieldName={fieldName} value={value} onChange={onChange} />
            )

        case "repeating":
            return (
                <RepeatingField
                    field={field}
                    fieldName={fieldName}
                    value={value}
                    onChange={onChange}
                />
            )

        default:
            return null
    }
}

function CheckboxGroup({
    field,
    fieldName,
    value,
    onChange,
}: {
    field: FieldDef
    fieldName: string
    value: unknown
    onChange: (name: string, value: unknown) => void
}) {
    const selected = Array.isArray(value) ? (value as string[]) : []

    return (
        <fieldset className="space-y-2">
            <legend className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
            </legend>
            {field.options?.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                        id={`${fieldName}-${opt.value}`}
                        name={fieldName}
                        value={opt.value}
                        checked={selected.includes(opt.value)}
                        onCheckedChange={(checked) => {
                            const next = checked
                                ? [...selected, opt.value]
                                : selected.filter((v) => v !== opt.value)
                            onChange(field.name, next)
                        }}
                    />
                    <Label htmlFor={`${fieldName}-${opt.value}`} className="font-normal">
                        {opt.label}
                    </Label>
                </div>
            ))}
        </fieldset>
    )
}

function ScaleInput({
    field,
    fieldName,
    value,
    onChange,
}: {
    field: FieldDef
    fieldName: string
    value: unknown
    onChange: (name: string, value: unknown) => void
}) {
    const min = field.scaleMin ?? 1
    const max = field.scaleMax ?? 5
    const current = typeof value === "number" ? value : undefined
    const points = Array.from({ length: max - min + 1 }, (_, i) => min + i)

    return (
        <fieldset className="space-y-2">
            <legend className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
            </legend>
            <div className="flex items-center gap-1">
                {field.scaleMinLabel && (
                    <span className="text-muted-foreground mr-2 text-xs">
                        {field.scaleMinLabel}
                    </span>
                )}
                {points.map((point) => (
                    <button
                        key={point}
                        type="button"
                        onClick={() => onChange(field.name, point)}
                        className={cn(
                            "flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                            current === point
                                ? "bg-primary text-primary-foreground border-primary"
                                : "hover:bg-accent",
                        )}
                    >
                        {point}
                    </button>
                ))}
                {field.scaleMaxLabel && (
                    <span className="text-muted-foreground ml-2 text-xs">
                        {field.scaleMaxLabel}
                    </span>
                )}
                <input type="hidden" name={fieldName} value={current ?? ""} />
            </div>
        </fieldset>
    )
}

function RepeatingField({
    field,
    fieldName,
    value,
    onChange,
}: {
    field: FieldDef
    fieldName: string
    value: unknown
    onChange: (name: string, value: unknown) => void
}) {
    const entries = Array.isArray(value) ? (value as Record<string, unknown>[]) : []
    const minEntries = field.minEntries ?? 0
    const maxEntries = field.maxEntries ?? 10

    function addEntry() {
        if (entries.length >= maxEntries) return
        const newEntry: Record<string, unknown> = {}
        for (const sub of field.subFields ?? []) {
            newEntry[sub.name] = ""
        }
        onChange(field.name, [...entries, newEntry])
    }

    function removeEntry(index: number) {
        if (entries.length <= minEntries) return
        onChange(
            field.name,
            entries.filter((_, i) => i !== index),
        )
    }

    function updateEntry(index: number, subName: string, subValue: unknown) {
        const next = entries.map((entry, i) =>
            i === index ? { ...entry, [subName]: subValue } : entry,
        )
        onChange(field.name, next)
    }

    return (
        <fieldset className="space-y-3">
            <legend className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
            </legend>
            <input type="hidden" name={`${fieldName}__count`} value={entries.length} />
            {entries.map((entry, index) => (
                <div key={index} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">#{index + 1}</span>
                        {entries.length > minEntries && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => removeEntry(index)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>
                        )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {field.subFields?.map((sub) => (
                            <div key={sub.name} className="space-y-1">
                                <Label className="text-xs">{sub.label}</Label>
                                <Input
                                    name={`${fieldName}[${index}].${sub.name}`}
                                    value={String(entry[sub.name] ?? "")}
                                    onChange={(e) => updateEntry(index, sub.name, e.target.value)}
                                    placeholder={sub.placeholder}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {entries.length < maxEntries && (
                <Button type="button" variant="outline" size="sm" onClick={addEntry}>
                    <Plus className="size-3.5" />
                    Add
                </Button>
            )}
        </fieldset>
    )
}
