import Link from "next/link"
import { getUsers } from "@repo/database"
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
import { reactivateUserAction } from "@/app/_actions/users"
import { ReactivateButton } from "../_components/reactivate-button"

export default async function DeactivatedUsersPage() {
    await requirePermission("User Edit")
    const users = await getUsers({ deactivated: true })

    return (
        <div>
            <div className="mb-6 flex items-center gap-4">
                <h1 className="text-2xl font-bold">Deactivated Users</h1>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/users">Back to Users</Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Deactivated</TableHead>
                        <TableHead className="w-30">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="opacity-75">
                            <TableCell>
                                <Link
                                    href={`/users/${user.id}`}
                                    className="font-medium hover:underline"
                                >
                                    {user.name}
                                </Link>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {user.roles.map((role) => (
                                        <Badge key={role.id} variant="secondary">
                                            {role.name}
                                        </Badge>
                                    ))}
                                    {user.roles.length === 0 && (
                                        <span className="text-muted-foreground text-sm">
                                            No roles
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                {user.deactivatedAt
                                    ? new Date(user.deactivatedAt).toLocaleDateString()
                                    : "—"}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/users/${user.id}`}>Edit</Link>
                                    </Button>
                                    <ReactivateButton
                                        action={reactivateUserAction.bind(null, user.id)}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {users.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-muted-foreground py-8 text-center"
                            >
                                No deactivated users.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
