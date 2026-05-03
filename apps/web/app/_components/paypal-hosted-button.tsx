import type { PaypalOption } from "@repo/database"

const buttonImages: Record<"cart" | "buynow" | "donate", string> = {
    cart: "https://www.paypalobjects.com/en_US/i/btn/btn_cart_LG.gif",
    buynow: "https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif",
    donate: "https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif",
}

interface PaypalHostedButtonProps {
    buttonId: string
    label: string
    style: "cart" | "buynow" | "donate"
    options: PaypalOption[] | null
}

export function PaypalHostedButton({ buttonId, label, style, options }: PaypalHostedButtonProps) {
    return (
        <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_blank"
            className="space-y-3"
        >
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value={buttonId} />
            <input type="hidden" name="currency_code" value="USD" />

            <h2 className="font-heading text-xl tracking-wider uppercase">{label}</h2>

            {(options ?? []).map((opt, i) => (
                <div key={i} className="space-y-1">
                    <input type="hidden" name={`on${i}`} value={opt.label} />
                    <label htmlFor={`paypal-os${i}`} className="block text-sm font-semibold">
                        {opt.label}
                    </label>
                    {opt.kind === "select" ? (
                        <select
                            id={`paypal-os${i}`}
                            name={`os${i}`}
                            className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                            required
                        >
                            {opt.choices.map((choice) => (
                                <option key={choice} value={choice}>
                                    {choice}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id={`paypal-os${i}`}
                            type="text"
                            name={`os${i}`}
                            maxLength={opt.maxLength ?? 200}
                            className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                        />
                    )}
                </div>
            ))}

            <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center"
                aria-label={label}
            >
                <img
                    src={buttonImages[style]}
                    alt={label}
                    width={style === "donate" ? 92 : 118}
                    height={26}
                />
            </button>
        </form>
    )
}
