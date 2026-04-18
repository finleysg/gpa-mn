import {
    getApplication,
    getLatestSections,
    getMilestones,
    getComments,
    getUsersByRole,
} from "@repo/database"
import type { SectionKey } from "@repo/database"
import type { ApplicationComment } from "@repo/types"
import { canViewAllAdoptions, requireAdoptionsAccess } from "@/app/_lib/require-section-access"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@repo/ui/components/button"
import { ArrowLeft } from "lucide-react"
import { ApplicationDetail } from "./_components/application-detail"

interface PageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ tab?: string }>
}

export default async function ApplicationDetailPage({ params }: PageProps) {
    const { session, ctx } = await requireAdoptionsAccess()
    const { id } = await params
    const numericId = Number(id)

    const isAdoptionRepOnly = !canViewAllAdoptions(ctx)

    const [application, sectionsRows, milestones, commentRows, adoptionReps] = await Promise.all([
        getApplication(numericId),
        getLatestSections(numericId),
        getMilestones(numericId),
        getComments(numericId),
        getUsersByRole("Adoption Rep"),
    ])

    if (!application) notFound()

    // Adoption Reps can only view applications assigned to them
    if (isAdoptionRepOnly && application.adoptionRep !== session.user.id) notFound()

    const sections: Partial<Record<SectionKey, Record<string, unknown>>> = {}
    for (const row of sectionsRows) {
        sections[row.section.sectionKey] = row.section.data as Record<string, unknown>
    }

    const comments: ApplicationComment[] = commentRows.map((row) => ({
        id: row.comment.id,
        applicationId: row.comment.applicationId,
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
                    <Link href="/applications">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">
                    {application.firstName} {application.lastName}
                </h1>
            </div>
            <Suspense>
                <ApplicationDetail
                    applicationId={application.id}
                    status={application.status}
                    adoptionRep={application.adoptionRep}
                    houndId={application.houndId}
                    houndName={application.houndName}
                    sections={sections}
                    milestones={milestones}
                    comments={comments}
                    adoptionReps={adoptionReps}
                    isAdoptionRepOnly={isAdoptionRepOnly}
                />
            </Suspense>
        </div>
    )
}
