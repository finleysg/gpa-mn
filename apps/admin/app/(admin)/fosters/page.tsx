import Link from "next/link"
import {
    listFosterApplications,
    getLatestFosterSectionsForApplications,
    type FosterApplicationStatus,
} from "@repo/database"
import { requireSectionAccess } from "@/app/_lib/require-section-access"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/components/table"
import { FostersFilter } from "./_components/fosters-filter"
import { StatusBadge } from "./_components/status-badge"
import { deriveAllColumns, computeAgeDays, type FosterDerivedColumns } from "./_lib/derive-columns"

interface PageProps {
    searchParams: Promise<{ status?: string; search?: string }>
}

export default async function FostersPage({ searchParams }: PageProps) {
    await requireSectionAccess("fosters")

    const params = await searchParams
    const statusFilter = params.status as FosterApplicationStatus | "all" | "active" | undefined
    const filters: { status?: FosterApplicationStatus; search?: string } = {}

    if (statusFilter && statusFilter !== "all" && statusFilter !== "active") {
        filters.status = statusFilter
    }
    if (params.search) {
        filters.search = params.search
    }

    const results = await listFosterApplications(filters)

    // Default: exclude drafts unless a specific status is chosen
    const rows =
        statusFilter && statusFilter !== "active"
            ? results
            : results.filter((r) => r.application.status !== "draft")

    // Batch-fetch section data for derived columns
    const applicationIds = rows.map((r) => r.application.id)
    const sectionRows = await getLatestFosterSectionsForApplications(applicationIds, [
        "current_pets",
        "household",
        "home",
        "final_questions",
        "foster_preferences",
    ])

    const sectionMap = new Map<number, Partial<Record<string, Record<string, unknown>>>>()
    for (const row of sectionRows) {
        if (!sectionMap.has(row.fosterApplicationId)) {
            sectionMap.set(row.fosterApplicationId, {})
        }
        sectionMap.get(row.fosterApplicationId)![row.sectionKey] = row.data as Record<
            string,
            unknown
        >
    }

    const derivedMap = new Map<number, FosterDerivedColumns>()
    for (const { application } of rows) {
        derivedMap.set(application.id, deriveAllColumns(sectionMap.get(application.id) ?? {}))
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Foster Applications</h1>
            </div>

            <FostersFilter
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
                        <TableHead>Pets</TableHead>
                        <TableHead>Kids</TableHead>
                        <TableHead>Housing</TableHead>
                        <TableHead>Referral</TableHead>
                        <TableHead>Also Adopting?</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(({ application }) => {
                        const derived = derivedMap.get(application.id)
                        const ageDays = computeAgeDays(application.submittedAt)
                        return (
                            <TableRow key={application.id}>
                                <TableCell>
                                    <Link
                                        href={`/fosters/${application.id}`}
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
                                <TableCell>{derived?.pets ?? "—"}</TableCell>
                                <TableCell>{derived?.kids ?? "—"}</TableCell>
                                <TableCell>{derived?.housing ?? "—"}</TableCell>
                                <TableCell>{derived?.referral ?? "—"}</TableCell>
                                <TableCell>{derived?.alsoAdopting ?? "—"}</TableCell>
                            </TableRow>
                        )
                    })}
                    {rows.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                className="text-muted-foreground py-8 text-center"
                            >
                                No foster applications found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
