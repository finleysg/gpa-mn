import Link from "next/link"
import {
    listApplications,
    getLatestSectionsForApplications,
    type ApplicationStatus,
} from "@repo/database"
import { canViewAllAdoptions, requireAdoptionsAccess } from "@/app/_lib/require-section-access"
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
import { deriveAllColumns, computeAgeDays, type DerivedColumns } from "./_lib/derive-columns"

interface PageProps {
    searchParams: Promise<{ status?: string; search?: string }>
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
    const { session, ctx } = await requireAdoptionsAccess()
    const canSeeAll = canViewAllAdoptions(ctx)
    const isAdoptionRepOnly = !canSeeAll
    const showHound = !isAdoptionRepOnly

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

    // Adoption Reps only see applications assigned to them
    const visibleRows = isAdoptionRepOnly
        ? rows.filter((r) => r.application.adoptionRep === session.user.id)
        : rows

    // Batch-fetch section data for derived columns
    const applicationIds = visibleRows.map((r) => r.application.id)
    const sectionRows = await getLatestSectionsForApplications(applicationIds, [
        "current_pets",
        "household",
        "home",
        "final_questions",
    ])

    const sectionMap = new Map<number, Partial<Record<string, Record<string, unknown>>>>()
    for (const row of sectionRows) {
        if (!sectionMap.has(row.applicationId)) {
            sectionMap.set(row.applicationId, {})
        }
        sectionMap.get(row.applicationId)![row.sectionKey] = row.data as Record<string, unknown>
    }

    const derivedMap = new Map<number, DerivedColumns>()
    for (const { application } of visibleRows) {
        derivedMap.set(application.id, deriveAllColumns(sectionMap.get(application.id) ?? {}))
    }

    const columnCount = showHound ? 10 : 9

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
                        <TableHead>Age</TableHead>
                        <TableHead>Adoption Rep</TableHead>
                        {showHound && <TableHead>Hound</TableHead>}
                        <TableHead>Pets</TableHead>
                        <TableHead>Kids</TableHead>
                        <TableHead>Housing</TableHead>
                        <TableHead>Chipper</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visibleRows.map(({ application, repName }) => {
                        const derived = derivedMap.get(application.id)
                        const ageDays = computeAgeDays(application.submittedAt)
                        return (
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
                                    {ageDays !== null ? (
                                        `${ageDays}d`
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {repName ?? (
                                        <span className="text-muted-foreground">Unassigned</span>
                                    )}
                                </TableCell>
                                {showHound && (
                                    <TableCell>
                                        {application.houndName ?? (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                )}
                                <TableCell>{derived?.pets ?? "—"}</TableCell>
                                <TableCell>{derived?.kids ?? "—"}</TableCell>
                                <TableCell>{derived?.housing ?? "—"}</TableCell>
                                <TableCell>{derived?.chipper ?? "—"}</TableCell>
                            </TableRow>
                        )
                    })}
                    {visibleRows.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={columnCount}
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
