import Link from "next/link"
import { getInvitations } from "@repo/database"
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
import { resendInviteAction, revokeInviteAction } from "@/app/_actions/users"

export default async function InvitationsPage() {
    await requirePermission("User Edit")
    const invitations = await getInvitations()

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Invitations</h1>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/users">Users</Link>
                    </Button>
                </div>
                <Button asChild>
                    <Link href="/users/invite">
                        <Plus className="mr-2 h-4 w-4" />
                        Invite User
                    </Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Invited By</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-30">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invitations.map((invite) => {
                        const isExpired =
                            invite.status === "pending" && new Date(invite.expiresAt) < new Date()
                        return (
                            <TableRow
                                key={invite.id}
                                className={
                                    invite.status !== "pending" || isExpired
                                        ? "opacity-50"
                                        : undefined
                                }
                            >
                                <TableCell className="font-medium">{invite.email}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {invite.roles.map((role) => (
                                            <Badge key={role.id} variant="secondary">
                                                {role.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{invite.invitedByName}</TableCell>
                                <TableCell>
                                    {new Date(invite.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {isExpired ? (
                                        <Badge variant="outline">Expired</Badge>
                                    ) : invite.status === "accepted" ? (
                                        <Badge>Accepted</Badge>
                                    ) : invite.status === "revoked" ? (
                                        <Badge variant="outline">Revoked</Badge>
                                    ) : (
                                        <Badge variant="secondary">Pending</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {invite.status === "pending" && (
                                        <div className="flex gap-1">
                                            <form action={resendInviteAction.bind(null, invite.id)}>
                                                <Button variant="ghost" size="sm" type="submit">
                                                    Resend
                                                </Button>
                                            </form>
                                            <form action={revokeInviteAction.bind(null, invite.id)}>
                                                <Button variant="ghost" size="sm" type="submit">
                                                    Revoke
                                                </Button>
                                            </form>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {invitations.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-muted-foreground py-8 text-center"
                            >
                                No invitations yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
