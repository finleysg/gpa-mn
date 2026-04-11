import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/app/lib/auth"

type ApiAnimal = {
    animalID: string
    animalName: string
}

type ApiResponse = {
    status: string
    data: Record<string, ApiAnimal>
}

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const response = await fetch("https://api.rescuegroups.org/http/v2.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                apikey: process.env.RESCUE_GROUPS_API_KEY,
                objectType: "animals",
                objectAction: "publicSearch",
                search: {
                    resultStart: 0,
                    resultLimit: 50,
                    resultSort: "animalName",
                    resultOrder: "asc",
                    fields: ["animalID", "animalName"],
                    filters: [
                        { fieldName: "animalStatus", operation: "equals", criteria: "Available" },
                        {
                            fieldName: "animalOrgID",
                            operation: "equals",
                            criteria: Number(process.env.RESCUE_GROUPS_ORG_ID),
                        },
                    ],
                },
            }),
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: "RescueGroups API error" },
                { status: response.status },
            )
        }

        const json = (await response.json()) as ApiResponse

        if (json.status !== "ok") {
            return NextResponse.json({ error: "RescueGroups API error" }, { status: 502 })
        }

        const hounds = Object.values(json.data).map((animal) => ({
            id: animal.animalID,
            name: animal.animalName,
        }))

        return NextResponse.json(hounds)
    } catch (error) {
        console.error("[rescue-groups] Failed:", error)
        return NextResponse.json({ error: "Failed to fetch hounds" }, { status: 500 })
    }
}
