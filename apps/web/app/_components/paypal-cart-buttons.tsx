"use client"

import { useEffect, useRef } from "react"

const CART_SCRIPT_SRC = "https://www.paypalobjects.com/ncp/sb/cart/cart.js"
const CART_MERCHANT_ID = "HBCXN9CGBFZLA"

interface PaypalCartButtonsProps {
    label: string
    addToCartHtml: string
    viewCartHtml: string | null
}

function injectHtml(target: HTMLElement, html: string) {
    target.innerHTML = html
    target.querySelectorAll("script").forEach((oldScript) => {
        const newScript = document.createElement("script")
        for (const attr of Array.from(oldScript.attributes)) {
            newScript.setAttribute(attr.name, attr.value)
        }
        newScript.textContent = oldScript.textContent
        oldScript.replaceWith(newScript)
    })
}

function loadCartScript(): Promise<void> {
    if (document.querySelector<HTMLScriptElement>(`script[src="${CART_SCRIPT_SRC}"]`)) {
        return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = CART_SCRIPT_SRC
        script.async = true
        script.dataset.merchantId = CART_MERCHANT_ID
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Failed to load PayPal cart.js"))
        document.body.appendChild(script)
    })
}

// PayPal's cart.js injects `<style>` tags inside the cart UI containing a global
// `.hidden { display: none !important }` rule that breaks Tailwind's responsive
// `hidden md:block`-style overrides across the app. Strip that one rule wherever we
// find it; the cart's other (scoped) styles are left alone.
function neutralizeHiddenOverride() {
    for (const styleEl of Array.from(document.querySelectorAll("style"))) {
        const sheet = styleEl.sheet
        if (!sheet) continue
        let rules: CSSRuleList
        try {
            rules = sheet.cssRules
        } catch {
            continue
        }
        for (let i = rules.length - 1; i >= 0; i--) {
            const rule = rules[i] as CSSStyleRule
            if (rule.selectorText === ".hidden" && rule.style?.display === "none") {
                try {
                    sheet.deleteRule(i)
                } catch {
                    /* ignore */
                }
            }
        }
    }
}

export function PaypalCartButtons({ label, addToCartHtml, viewCartHtml }: PaypalCartButtonsProps) {
    const addRef = useRef<HTMLDivElement>(null)
    const viewRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let cancelled = false
        loadCartScript()
            .then(() => {
                if (cancelled) return
                if (addRef.current) injectHtml(addRef.current, addToCartHtml)
                if (viewRef.current && viewCartHtml) injectHtml(viewRef.current, viewCartHtml)
                neutralizeHiddenOverride()
                const observer = new MutationObserver(() => neutralizeHiddenOverride())
                observer.observe(document.body, { childList: true, subtree: true })
                setTimeout(() => observer.disconnect(), 10000)
            })
            .catch((err) => console.error(err))
        return () => {
            cancelled = true
        }
    }, [addToCartHtml, viewCartHtml])

    return (
        <div className="space-y-3">
            <h2 className="font-heading text-xl tracking-wider uppercase">{label}</h2>
            <div ref={viewRef} className="paypal-cart-button" suppressHydrationWarning />
            <div ref={addRef} className="paypal-cart-button" suppressHydrationWarning />
        </div>
    )
}
