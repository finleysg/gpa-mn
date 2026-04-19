import { NextResponse } from "next/server"
import { getSearchManifest } from "@/app/_lib/search-manifest"

export async function GET() {
    const entries = await getSearchManifest()
    return NextResponse.json(
        { entries },
        {
            headers: {
                "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
            },
        },
    )
}
