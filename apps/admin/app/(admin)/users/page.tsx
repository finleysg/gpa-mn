import Link from "next/link"
import { getUsers } from "@repo/database"
import { requireSectionAccess } from "@/app/_lib/require-section-access"
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
import { deactivateUserAction, reactivateUserAction } from "@/app/_actions/users"
import { DeactivateButton } from "./_components/deactivate-button"
import { ReactivateButton } from "./_components/reactivate-button"

export default async function UsersPage() {
    await requireSectionAccess("users")
    const users = await getUsers()

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/users/invitations">Invitations</Link>
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/users/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create User
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/users/invite">Invite User</Link>
                    </Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-30">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user.id}
                            className={user.deactivatedAt ? "opacity-50" : undefined}
                        >
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
                                {user.deactivatedAt ? (
                                    <Badge variant="outline">Deactivated</Badge>
                                ) : (
                                    <Badge>Active</Badge>
                                )}
                            </TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/users/${user.id}`}>Edit</Link>
                                    </Button>
                                    {user.deactivatedAt ? (
                                        <ReactivateButton
                                            action={reactivateUserAction.bind(null, user.id)}
                                        />
                                    ) : (
                                        <DeactivateButton
                                            name={user.name}
                                            action={deactivateUserAction.bind(null, user.id)}
                                        />
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {users.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={6}
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
