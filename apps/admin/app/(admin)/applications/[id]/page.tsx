import { getApplication } from "@repo/database"
import { requireSectionAccess } from "@/app/_lib/require-section-access"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@repo/ui/components/button"
import { ArrowLeft } from "lucide-react"
import { StatusBadge } from "../_components/status-badge"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ApplicationDetailPage({ params }: PageProps) {
    await requireSectionAccess("applications")
    const { id } = await params
    const application = await getApplication(Number(id))
    if (!application) notFound()

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
                <StatusBadge status={application.status} />
            </div>
            <p className="text-muted-foreground">Application detail page coming soon.</p>
        </div>
    )
}
