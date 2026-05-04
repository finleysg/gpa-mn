interface PaypalCartButtonsProps {
    label: string
    addToCartHtml: string
    viewCartHtml: string | null
}

export function PaypalCartButtons({ label, addToCartHtml, viewCartHtml }: PaypalCartButtonsProps) {
    return (
        <div className="space-y-3">
            <h2 className="font-heading text-xl tracking-wider uppercase">{label}</h2>
            <div
                className="paypal-cart-button"
                dangerouslySetInnerHTML={{ __html: addToCartHtml }}
            />
            {viewCartHtml && (
                <div
                    className="paypal-cart-button"
                    dangerouslySetInnerHTML={{ __html: viewCartHtml }}
                />
            )}
        </div>
    )
}
