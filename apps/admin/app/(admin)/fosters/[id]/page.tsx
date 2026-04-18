import {
    getFosterApplication,
    getLatestFosterSections,
    getFosterMilestones,
    getFosterComments,
} from "@repo/database"
import type { FosterSectionKey } from "@repo/database"
import type { FosterApplicationComment } from "@repo/types"
import { requireFostersAccess } from "@/app/_lib/require-section-access"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@repo/ui/components/button"
import { ArrowLeft } from "lucide-react"
import { FosterApplicationDetail } from "./_components/application-detail"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function FosterApplicationDetailPage({ params }: PageProps) {
    await requireFostersAccess()
    const { id } = await params
    const numericId = Number(id)

    const [application, sectionsRows, milestones, commentRows] = await Promise.all([
        getFosterApplication(numericId),
        getLatestFosterSections(numericId),
        getFosterMilestones(numericId),
        getFosterComments(numericId),
    ])

    if (!application) notFound()

    const sections: Partial<Record<FosterSectionKey, Record<string, unknown>>> = {}
    for (const row of sectionsRows) {
        sections[row.section.sectionKey] = row.section.data as Record<string, unknown>
    }

    const comments: FosterApplicationComment[] = commentRows.map((row) => ({
        id: row.comment.id,
        fosterApplicationId: row.comment.fosterApplicationId,
        userId: row.comment.userId,
        userName: row.userName,
        sectionCategory: row.comment.sectionCategory,
        body: row.comment.body,
        isSystemEvent: row.comment.isSystemEvent,
        createdAt: row.comment.createdAt,
    }))

    return (
        <div>
            <div className="mb-6 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/fosters">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">
                    {application.firstName} {application.lastName}
                </h1>
            </div>
            <Suspense>
                <FosterApplicationDetail
                    fosterApplicationId={application.id}
                    status={application.status}
                    sections={sections}
                    milestones={milestones}
                    comments={comments}
                />
            </Suspense>
        </div>
    )
}
