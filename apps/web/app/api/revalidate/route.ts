import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const { paths, tags, secret } = (await request.json()) as {
        paths?: string[]
        tags?: string[]
        secret: string
    }

    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    const revalidatedPaths: string[] = []
    const revalidatedTags: string[] = []

    if (paths) {
        for (const path of paths) {
            revalidatePath(path)
            revalidatedPaths.push(path)
        }
    }

    if (tags) {
        for (const tag of tags) {
            revalidateTag(tag, { expire: 0 })
            revalidatedTags.push(tag)
        }
    }

    return NextResponse.json({ revalidated: { paths: revalidatedPaths, tags: revalidatedTags } })
}
