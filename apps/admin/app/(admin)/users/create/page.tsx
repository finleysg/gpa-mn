import { getRoles } from "@repo/database"
import { requirePermission } from "@/app/_lib/require-section-access"
import { CreateUserForm } from "./create-user-form"

export default async function CreateUserPage() {
    await requirePermission("User Edit")
    const roles = await getRoles()

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">Create User</h1>
            <CreateUserForm roles={roles} />
        </div>
    )
}
