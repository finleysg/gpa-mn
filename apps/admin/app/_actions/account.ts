"use server"

import { revalidatePath } from "next/cache"
import { getSessionOrRedirect } from "@/app/lib/auth-utils"
import { updateUserPhone } from "@repo/database"

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
