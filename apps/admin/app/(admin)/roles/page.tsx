import Link from "next/link"
import { getRolesWithUsage } from "@repo/database"
import { requirePermission } from "@/app/_lib/require-section-access"
import { Button } from "@repo/ui/components/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/components/table"
import { Badge } from "@repo/ui/components/badge"
import { Plus } from "lucide-react"
import { WebsiteVisibleToggle } from "./_components/website-visible-toggle"
import { DeleteRoleButton } from "./_components/delete-role-button"

export default async function RolesPage() {
    await requirePermission("User Edit")
    const roles = await getRolesWithUsage()

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Roles</h1>
                <Button asChild>
                    <Link href="/roles/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Role
                    </Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Website Visible</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <Link href={`/roles/${role.id}`} className="hover:underline">
                                        {role.name}
                                    </Link>
                                    {role.system && <Badge variant="outline">System</Badge>}
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {role.description || "—"}
                            </TableCell>
                            <TableCell>{Number(role.userCount)}</TableCell>
                            <TableCell>{Number(role.permissionCount)}</TableCell>
                            <TableCell>
                                <WebsiteVisibleToggle
                                    roleId={role.id}
                                    currentValue={role.websiteVisible}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                    {!role.system && (
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/roles/${role.id}`}>Edit</Link>
                                        </Button>
                                    )}
                                    <DeleteRoleButton
                                        roleId={role.id}
                                        name={role.name}
                                        disabled={role.system || Number(role.userCount) > 0}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
