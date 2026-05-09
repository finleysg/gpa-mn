import Link from "next/link"
import { getUserIdsWithRolePermissions, getUsers } from "@repo/database"
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
import { AlertTriangle, Plus } from "lucide-react"
import { deactivateUserAction } from "@/app/_actions/users"
import { DeactivateButton } from "./_components/deactivate-button"

export default async function UsersPage() {
    await requirePermission("User Edit")
    const [users, permissionedIds] = await Promise.all([
        getUsers(),
        getUserIdsWithRolePermissions(),
    ])
    const permissionedSet = new Set(permissionedIds)

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/users/deactivated">Deactivated</Link>
                    </Button>
                </div>
                <Button asChild>
                    <Link href="/users/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create User
                    </Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-30">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        const hasRolePermissions = permissionedSet.has(user.id)
                        const showLoginGap = hasRolePermissions && !user.adminLogin
                        return (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Link
                                        href={`/users/${user.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {user.name}
                                    </Link>
                                    {showLoginGap && (
                                        <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                                            <AlertTriangle className="h-3 w-3" />
                                            <span>Has permissions but cannot log in</span>
                                        </div>
                                    )}
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
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/users/${user.id}`}>Edit</Link>
                                        </Button>
                                        <DeactivateButton
                                            name={user.name}
                                            action={deactivateUserAction.bind(null, user.id)}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {users.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-muted-foreground py-8 text-center"
                            >
                                No users yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
