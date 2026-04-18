import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { countRoleUsers, getPermissions, getRole, getRolePermissions } from "@repo/database"
import { requirePermission } from "@/app/_lib/require-section-access"
import { Button } from "@repo/ui/components/button"
import { Badge } from "@repo/ui/components/badge"
import { EditRoleForm } from "./edit-role-form"
import { RolePermissionsForm } from "./role-permissions-form"

export default async function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await requirePermission("User Edit")
    const { id } = await params

    const [role, allPermissions, assignedPermissions, userCount] = await Promise.all([
        getRole(id),
        getPermissions(),
        getRolePermissions(id),
        countRoleUsers(id),
    ])

    if (!role) notFound()

    const assignedIds = new Set(assignedPermissions.map((p) => p.id))

    return (
        <div className="max-w-2xl space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/roles">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">{role.name}</h1>
                {role.system && <Badge variant="outline">System</Badge>}
            </div>

            <div className="text-muted-foreground text-sm">
                {userCount} assigned {userCount === 1 ? "user" : "users"}
            </div>

            {role.system ? (
                <p className="text-muted-foreground text-sm">
                    System roles are locked and cannot be edited.
                </p>
            ) : (
                <>
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">Details</h2>
                        <EditRoleForm
                            roleId={role.id}
                            defaultName={role.name}
                            defaultDescription={role.description ?? ""}
                        />
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">Permissions</h2>
                        <RolePermissionsForm
                            roleId={role.id}
                            permissions={allPermissions}
                            assignedIds={Array.from(assignedIds)}
                        />
                    </section>
                </>
            )}
        </div>
    )
}
