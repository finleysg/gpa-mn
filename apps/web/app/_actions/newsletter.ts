"use server"

export type NewsletterState = { success: true; message: string } | { errors: string[] } | undefined

export async function subscribeToNewsletter(
    _prevState: NewsletterState,
    formData: FormData,
): Promise<NewsletterState> {
    const email = formData.get("email")

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { errors: ["Please enter a valid email address."] }
    }

    // Simulate network delay (demo — no actual storage)
    await new Promise((resolve) => setTimeout(resolve, 800))

    return { success: true, message: "You're subscribed!" }
}
