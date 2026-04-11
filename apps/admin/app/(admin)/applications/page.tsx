import Link from "next/link"
import { listApplications, type ApplicationStatus } from "@repo/database"
import { requireSectionAccess } from "@/app/_lib/require-section-access"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/components/table"
import { ApplicationsFilter } from "./_components/applications-filter"
import { StatusBadge } from "./_components/status-badge"

interface PageProps {
    searchParams: Promise<{ status?: string; search?: string }>
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
    await requireSectionAccess("applications")

    const params = await searchParams
    const statusFilter = params.status as ApplicationStatus | "all" | "active" | undefined
    const filters: { status?: ApplicationStatus; search?: string } = {}

    if (statusFilter && statusFilter !== "all" && statusFilter !== "active") {
        filters.status = statusFilter
    }
    if (params.search) {
        filters.search = params.search
    }

    const results = await listApplications(filters)

    // Default: exclude drafts unless a specific status is chosen
    const rows =
        statusFilter && statusFilter !== "active"
            ? results
            : results.filter((r) => r.application.status !== "draft")

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Applications</h1>
            </div>

            <ApplicationsFilter
                currentStatus={params.status ?? ""}
                currentSearch={params.search ?? ""}
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Adoption Rep</TableHead>
                        <TableHead>Hound</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(({ application, repName }) => (
                        <TableRow key={application.id}>
                            <TableCell>
                                <Link
                                    href={`/applications/${application.id}`}
                                    className="font-medium hover:underline"
                                >
                                    {application.firstName} {application.lastName}
                                </Link>
                                <div className="text-muted-foreground text-sm">
                                    {application.email}
                                </div>
                            </TableCell>
                            <TableCell>
                                {application.submittedAt
                                    ? new Date(application.submittedAt).toLocaleDateString()
                                    : "—"}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={application.status} />
                            </TableCell>
                            <TableCell>
                                {repName ?? (
                                    <span className="text-muted-foreground">Unassigned</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {application.houndName ?? (
                                    <span className="text-muted-foreground">—</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {rows.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-muted-foreground py-8 text-center"
                            >
                                No applications found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
