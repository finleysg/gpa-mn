import { requirePermission } from "@/app/_lib/require-section-access"
import { NewRoleForm } from "./new-role-form"

export default async function NewRolePage() {
    await requirePermission("User Edit")

    return (
        <div className="max-w-xl">
            <h1 className="mb-6 text-2xl font-bold">New Role</h1>
            <NewRoleForm />
        </div>
    )
}
