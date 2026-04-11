"use server"

import { revalidatePath } from "next/cache"
import { getSessionOrRedirect } from "@/app/lib/auth-utils"
import { updateUserPhone, updateUserNotificationPreferences } from "@repo/database"

export type UpdatePhoneState = {
    error?: string
    success?: boolean
}

export async function updatePhoneAction(
    _prev: UpdatePhoneState,
    formData: FormData,
): Promise<UpdatePhoneState> {
    const session = await getSessionOrRedirect()
    const phone = (formData.get("phone") as string)?.trim() || null

    if (phone && phone.length > 32) {
        return { error: "Phone number is too long." }
    }

    await updateUserPhone(session.user.id, phone)
    revalidatePath("/account")

    return { success: true }
}

export type UpdateNotificationSettingsState = {
    error?: string
    success?: boolean
}

export async function updateNotificationSettingsAction(
    _prev: UpdateNotificationSettingsState,
    formData: FormData,
): Promise<UpdateNotificationSettingsState> {
    const session = await getSessionOrRedirect()

    const preferences: { notifyOnSubmission?: boolean; notifyOnAssignment?: boolean } = {}

    if (formData.has("notifyOnSubmission")) {
        preferences.notifyOnSubmission = formData.get("notifyOnSubmission") === "true"
    }
    if (formData.has("notifyOnAssignment")) {
        preferences.notifyOnAssignment = formData.get("notifyOnAssignment") === "true"
    }

    await updateUserNotificationPreferences(session.user.id, preferences)
    revalidatePath("/account")

    return { success: true }
}
