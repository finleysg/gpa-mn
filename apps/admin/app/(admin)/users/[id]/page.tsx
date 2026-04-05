import { notFound } from "next/navigation"
import { getUser, getRoles } from "@repo/database"
import { requireSectionAccess } from "@/app/_lib/require-section-access"
import { Badge } from "@repo/ui/components/badge"
import { EditRolesForm } from "./edit-roles-form"

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await requireSectionAccess("users")
    const { id } = await params
    const [user, allRoles] = await Promise.all([getUser(id), getRoles()])

    if (!user) notFound()

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">Edit User</h1>

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
                    <p className="text-muted-foreground text-sm">Created</p>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <EditRolesForm
                userId={user.id}
                allRoles={allRoles}
                currentRoleIds={user.roles.map((r) => r.id)}
            />
        </div>
    )
}
