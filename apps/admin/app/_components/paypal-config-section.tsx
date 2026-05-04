"use client"

import { useState } from "react"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Textarea } from "@repo/ui/components/textarea"

interface PaypalConfigSectionProps {
    initialButtonLabel?: string | null
    initialAddToCartHtml?: string | null
    initialViewCartHtml?: string | null
}

export function PaypalConfigSection({
    initialButtonLabel,
    initialAddToCartHtml,
    initialViewCartHtml,
}: PaypalConfigSectionProps) {
    const [addToCartHtml, setAddToCartHtml] = useState(initialAddToCartHtml ?? "")

    const enabled = addToCartHtml.trim().length > 0

    return (
        <div className="border-border space-y-4 rounded-lg border p-4">
            <div>
                <h3 className="text-base font-semibold">PayPal Shopping Cart (optional)</h3>
                <p className="text-muted-foreground text-sm">
                    Paste the HTML PayPal generates for the &ldquo;Add to Cart&rdquo; and
                    &ldquo;View Cart&rdquo; buttons. Leave the Add to Cart field blank to disable.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="paypalAddToCartHtml">Add to Cart HTML</Label>
                <Textarea
                    id="paypalAddToCartHtml"
                    name="paypalAddToCartHtml"
                    rows={6}
                    defaultValue={initialAddToCartHtml ?? ""}
                    onChange={(e) => setAddToCartHtml(e.target.value)}
                    placeholder='<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">…</form>'
                    className="font-mono text-xs"
                />
            </div>

            {enabled && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="paypalButtonLabel">Section Label</Label>
                        <Input
                            id="paypalButtonLabel"
                            name="paypalButtonLabel"
                            defaultValue={initialButtonLabel ?? ""}
                            placeholder="Buy T-Shirt"
                            required
                        />
                        <p className="text-muted-foreground text-xs">
                            Heading shown above the buttons in the event sidebar.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paypalViewCartHtml">View Cart HTML (optional)</Label>
                        <Textarea
                            id="paypalViewCartHtml"
                            name="paypalViewCartHtml"
                            rows={6}
                            defaultValue={initialViewCartHtml ?? ""}
                            placeholder='<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">…</form>'
                            className="font-mono text-xs"
                        />
                    </div>
                </>
            )}
        </div>
    )
}
