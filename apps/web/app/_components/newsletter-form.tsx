const NEWSLETTER_URL = process.env.NEXT_PUBLIC_NEWSLETTER_URL

export function NewsletterForm({ variant }: { variant: "footer" | "card" }) {
    if (!NEWSLETTER_URL) return null

    if (variant === "footer") {
        return (
            <a
                href={NEWSLETTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
                Subscribe
            </a>
        )
    }

    return (
        <a
            href={NEWSLETTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(156,47,48,0.25)] transition-colors"
        >
            Subscribe
        </a>
    )
}
