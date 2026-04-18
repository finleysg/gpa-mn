import { notFound } from "next/navigation"
import { getUser, getRoles, userHasRolePermissions } from "@repo/database"
import { requirePermission } from "@/app/_lib/require-section-access"
import { Badge } from "@repo/ui/components/badge"
import { AlertTriangle } from "lucide-react"
import { EditRolesForm } from "./edit-roles-form"
import { AdminLoginToggle } from "./admin-login-toggle"

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await requirePermission("User Edit")
    const { id } = await params
    const [user, allRoles] = await Promise.all([getUser(id), getRoles()])

    if (!user) notFound()

    const hasRolePermissions = await userHasRolePermissions(user.id)
    const cannotLogIn = Boolean(user.deactivatedAt) || !user.adminLogin
    const showLoginGap = hasRolePermissions && cannotLogIn

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">Edit User</h1>

            {showLoginGap && (
                <div className="mb-6 flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                        <p className="font-medium">Login gap detected</p>
                        <p>
                            This user is assigned to a role with permissions, but{" "}
                            {user.deactivatedAt
                                ? "their account is deactivated"
                                : "admin login is disabled"}
                            . They will not be able to use the permissions their role grants until
                            this is resolved.
                        </p>
                    </div>
                </div>
            )}

            <div className="mb-8 max-w-md space-y-4">
                <div>
                    <p className="text-muted-foreground text-sm">Name</p>
                    <p className="font-medium">{user.name}</p>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <p className="font-medium">{user.email}</p>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm">Status</p>
                    <p>
                        {user.deactivatedAt ? (
                            <Badge variant="outline">Deactivated</Badge>
                        ) : (
                            <Badge>Active</Badge>
                        )}
                    </p>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm">Admin Login</p>
                    <p>
                        {user.adminLogin ? (
                            <Badge>Enabled</Badge>
                        ) : (
                            <Badge variant="outline">Disabled</Badge>
                        )}
                    </p>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm">Created</p>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <EditRolesForm
                userId={user.id}
                allRoles={allRoles}
                currentRoleIds={user.roles.map((r) => r.id)}
            />

            <div className="mt-8">
                <AdminLoginToggle userId={user.id} currentValue={user.adminLogin} />
            </div>
        </div>
    )
}
