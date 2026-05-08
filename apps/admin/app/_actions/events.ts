"use server"

import {
    createEvent as dbCreateEvent,
    updateEvent as dbUpdateEvent,
    archiveEvent as dbArchiveEvent,
    restoreEvent as dbRestoreEvent,
    countFeaturedEventsExcluding,
    getMaxFeaturedOrder,
    getFeaturedEvents,
    swapFeaturedOrder,
} from "@repo/database"
import type { events } from "@repo/database"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { validateEventData } from "./validate-event"
import { revalidateWeb } from "../_lib/revalidate-web"

const MAX_FEATURED = 4

type EventInsert = typeof events.$inferInsert

function parseEventFormData(formData: FormData): EventInsert {
    const endDate = formData.get("endDate") as string
    const paypalAddToCartHtml = (formData.get("paypalAddToCartHtml") as string)?.trim() || null
    const paypalViewCartHtml = (formData.get("paypalViewCartHtml") as string)?.trim() || null
    const paypalButtonLabel = (formData.get("paypalButtonLabel") as string)?.trim() || null

    return {
        title: formData.get("title") as string,
        startDate: formData.get("startDate") as string,
        endDate: endDate || null,
        recurrence: (formData.get("recurrence") as EventInsert["recurrence"]) ?? "once",
        time: formData.get("time") as string,
        location: formData.get("location") as string,
        type: formData.get("type") as EventInsert["type"],
        description: formData.get("description") as string,
        longDescription: formData.get("longDescription") as string,
        showUpcoming: formData.get("showUpcoming") === "true",
        featured: formData.get("featured") === "true",
        paypalButtonLabel: paypalAddToCartHtml ? paypalButtonLabel : null,
        paypalAddToCartHtml,
        paypalViewCartHtml: paypalAddToCartHtml ? paypalViewCartHtml : null,
    }
}

export async function createEventAction(formData: FormData) {
    const data = parseEventFormData(formData)

    const errors = validateEventData(data)
    if (errors.length > 0) {
        return { errors }
    }

    if (data.featured) {
        const existing = await countFeaturedEventsExcluding()
        if (existing >= MAX_FEATURED) {
            return { errors: [`Cannot feature more than ${MAX_FEATURED} events`] }
        }
        data.featuredOrder = (await getMaxFeaturedOrder()) + 1
    }

    const result = await dbCreateEvent(data)
    revalidatePath("/events")
    await revalidateWeb(["/", "/events"], ["search-manifest"])
    redirect(`/events/${result.id}`)
}

export async function updateEventAction(id: number, formData: FormData) {
    const data = parseEventFormData(formData)

    const errors = validateEventData(data)
    if (errors.length > 0) {
        return { errors }
    }

    if (data.featured) {
        const existing = await countFeaturedEventsExcluding(id)
        if (existing >= MAX_FEATURED) {
            return { errors: [`Cannot feature more than ${MAX_FEATURED} events`] }
        }
        const featuredEvents = await getFeaturedEvents()
        const isAlreadyFeatured = featuredEvents.some((e) => e.id === id)
        if (!isAlreadyFeatured) {
            data.featuredOrder = (await getMaxFeaturedOrder()) + 1
        }
    } else {
        data.featuredOrder = 0
    }

    await dbUpdateEvent(id, data)
    revalidatePath("/events")
    await revalidateWeb(["/", "/events"], ["search-manifest"])
    return { success: true as const }
}

export async function archiveEventAction(id: number) {
    await dbArchiveEvent(id)
    revalidatePath("/events")
    await revalidateWeb(["/", "/events"], ["search-manifest"])
    redirect("/events")
}

export async function restoreEventAction(id: number) {
    await dbRestoreEvent(id)
    revalidatePath("/events")
    await revalidateWeb(["/", "/events"], ["search-manifest"])
}

export async function moveFeaturedEventUpAction(id: number) {
    const featured = await getFeaturedEvents()
    const index = featured.findIndex((e) => e.id === id)
    if (index <= 0) return
    const above = featured[index - 1]
    if (!above) return
    await swapFeaturedOrder(id, above.id)
    revalidatePath("/events")
    await revalidateWeb(["/"])
}

export async function moveFeaturedEventDownAction(id: number) {
    const featured = await getFeaturedEvents()
    const index = featured.findIndex((e) => e.id === id)
    if (index < 0 || index >= featured.length - 1) return
    const below = featured[index + 1]
    if (!below) return
    await swapFeaturedOrder(id, below.id)
    revalidatePath("/events")
    await revalidateWeb(["/"])
}
