import { NextResponse } from "next/server"

export async function validateEmailRequest(request: Request) {
    const body = await request.json()
    const { secret, ...data } = body

    if (secret !== process.env.REVALIDATION_SECRET) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    }

    return { data }
}
