import Link from "next/link"
import { getLatestVersions } from "@repo/database"
import { Button } from "@repo/ui/components/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/components/table"
import { Plus } from "lucide-react"
import { archiveContentAction } from "@/app/_actions/content"
import { ArchiveButton } from "@/app/_components/archive-button"
import { CopyButton } from "@/app/_components/copy-button"
import type { ContentTypeConfig } from "@/app/_lib/content-config"

interface ContentListPageProps {
    config: ContentTypeConfig
    filterFn?: (data: Record<string, unknown>) => boolean
    augmentData?: (data: Record<string, unknown>, slug: string) => Record<string, unknown>
}

export async function ContentListPage({ config, filterFn, augmentData }: ContentListPageProps) {
    const rawItems = await getLatestVersions(config.contentType)
    const sorted = config.sortBy
        ? [...rawItems].sort((a, b) => {
              const aVal = String((a.version.data as Record<string, unknown>)[config.sortBy!] ?? "")
              const bVal = String((b.version.data as Record<string, unknown>)[config.sortBy!] ?? "")
              return aVal.localeCompare(bVal)
          })
        : rawItems
    const items = filterFn
        ? sorted.filter(({ version }) => filterFn(version.data as Record<string, unknown>))
        : sorted

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">{config.plural}</h1>
                {config.allowCreate !== false && (
                    <Button asChild>
                        <Link href={`/${config.slug}/new`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New {config.singular}
                        </Link>
                    </Button>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {config.tableColumns.map((col) => (
                            <TableHead key={col.key}>{col.label}</TableHead>
                        ))}
                        <TableHead>Version</TableHead>
                        <TableHead className="w-30">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map(({ item, version }) => {
                        const rawData = version.data as Record<string, unknown>
                        const data = augmentData ? augmentData(rawData, item.slug) : rawData
                        return (
                            <TableRow key={item.id}>
                                {config.tableColumns.map((col, colIndex) => (
                                    <TableCell key={col.key}>
                                        {colIndex === 0 ? (
                                            <Link
                                                href={`/${config.slug}/${item.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {String(data[col.key] ?? "")}
                                            </Link>
                                        ) : col.copyable ? (
                                            <span className="flex items-center gap-1">
                                                <span>{String(data[col.key] ?? "")}</span>
                                                <CopyButton value={String(data[col.key] ?? "")} />
                                            </span>
                                        ) : (
                                            String(data[col.key] ?? "")
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell>v{version.version}</TableCell>
                                <TableCell>
                                    <ArchiveButton
                                        title={String(
                                            data.title ?? data[config.tableColumns[0]!.key] ?? "",
                                        )}
                                        entityName={config.singular.toLowerCase()}
                                        action={archiveContentAction.bind(
                                            null,
                                            item.id,
                                            config.contentType,
                                            config.slug,
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {items.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={config.tableColumns.length + 2}
                                className="text-muted-foreground py-8 text-center"
                            >
                                No {config.plural.toLowerCase()} yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
