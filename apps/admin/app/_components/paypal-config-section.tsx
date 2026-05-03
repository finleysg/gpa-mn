"use client"

import { useState } from "react"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Textarea } from "@repo/ui/components/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select"
import type { PaypalOption } from "@repo/database"

const buttonStyleOptions = [
    { value: "cart", label: "Add to Cart" },
    { value: "buynow", label: "Buy Now" },
    { value: "donate", label: "Donate" },
] as const

interface PaypalConfigSectionProps {
    initialButtonId?: string | null
    initialButtonLabel?: string | null
    initialButtonStyle?: "cart" | "buynow" | "donate" | null
    initialOptions?: PaypalOption[] | null
}

export function PaypalConfigSection({
    initialButtonId,
    initialButtonLabel,
    initialButtonStyle,
    initialOptions,
}: PaypalConfigSectionProps) {
    const [buttonId, setButtonId] = useState(initialButtonId ?? "")
    const [options, setOptions] = useState<PaypalOption[]>(initialOptions ?? [])

    const enabled = buttonId.trim().length > 0

    function updateOption(index: number, next: PaypalOption) {
        setOptions((prev) => prev.map((opt, i) => (i === index ? next : opt)))
    }

    function removeOption(index: number) {
        setOptions((prev) => prev.filter((_, i) => i !== index))
    }

    function moveOption(index: number, dir: -1 | 1) {
        setOptions((prev) => {
            const next = [...prev]
            const target = index + dir
            if (target < 0 || target >= next.length) return prev
            const [item] = next.splice(index, 1)
            next.splice(target, 0, item!)
            return next
        })
    }

    function addOption(kind: "select" | "text") {
        setOptions((prev) => {
            if (prev.length >= 7) return prev
            return [
                ...prev,
                kind === "select"
                    ? { kind: "select", label: "", choices: [] }
                    : { kind: "text", label: "" },
            ]
        })
    }

    return (
        <div className="border-border space-y-4 rounded-lg border p-4">
            <div>
                <h3 className="text-base font-semibold">PayPal Hosted Button (optional)</h3>
                <p className="text-muted-foreground text-sm">
                    Embed a PayPal hosted button in the event sidebar. Leave the button ID blank to
                    disable.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="paypalButtonId">Hosted Button ID</Label>
                <Input
                    id="paypalButtonId"
                    name="paypalButtonId"
                    defaultValue={initialButtonId ?? ""}
                    placeholder="e.g. UR2ZKPCP5UMRC"
                    onChange={(e) => setButtonId(e.target.value)}
                />
            </div>

            {enabled && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="paypalButtonLabel">Button Label</Label>
                            <Input
                                id="paypalButtonLabel"
                                name="paypalButtonLabel"
                                defaultValue={initialButtonLabel ?? ""}
                                placeholder="Buy T-Shirt"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paypalButtonStyle">Button Style</Label>
                            <Select
                                name="paypalButtonStyle"
                                defaultValue={initialButtonStyle ?? "cart"}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {buttonStyleOptions.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Buyer Inputs (optional)</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addOption("select")}
                                    disabled={options.length >= 7}
                                >
                                    Add Dropdown
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addOption("text")}
                                    disabled={options.length >= 7}
                                >
                                    Add Text Field
                                </Button>
                            </div>
                        </div>

                        {options.length === 0 && (
                            <p className="text-muted-foreground text-sm">
                                No buyer inputs configured. The button will go straight to PayPal
                                checkout.
                            </p>
                        )}

                        {options.map((opt, i) => (
                            <div
                                key={i}
                                className="border-border space-y-2 rounded-md border bg-white p-3 dark:bg-transparent"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-xs uppercase">
                                        {opt.kind === "select" ? "Dropdown" : "Text Field"} #{i + 1}
                                    </span>
                                    <div className="flex gap-1">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => moveOption(i, -1)}
                                            disabled={i === 0}
                                        >
                                            ↑
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => moveOption(i, 1)}
                                            disabled={i === options.length - 1}
                                        >
                                            ↓
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => removeOption(i)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Prompt / Label</Label>
                                    <Input
                                        value={opt.label}
                                        onChange={(e) =>
                                            updateOption(i, { ...opt, label: e.target.value })
                                        }
                                        placeholder={opt.kind === "select" ? "Size" : "Name:"}
                                        required
                                    />
                                </div>

                                {opt.kind === "select" ? (
                                    <div className="space-y-2">
                                        <Label>Choices (one per line)</Label>
                                        <Textarea
                                            rows={4}
                                            value={opt.choices.join("\n")}
                                            onChange={(e) =>
                                                updateOption(i, {
                                                    ...opt,
                                                    choices: e.target.value
                                                        .split("\n")
                                                        .map((c) => c.trim())
                                                        .filter(Boolean),
                                                })
                                            }
                                            placeholder={"S - Unisex\nM - Unisex\nL - Unisex"}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label>Max Length (optional)</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={opt.maxLength ?? ""}
                                            onChange={(e) => {
                                                const v = e.target.value
                                                updateOption(i, {
                                                    ...opt,
                                                    maxLength: v ? Number(v) : undefined,
                                                })
                                            }}
                                            placeholder="200"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        <input type="hidden" name="paypalOptions" value={JSON.stringify(options)} />
                    </div>
                </>
            )}
        </div>
    )
}
