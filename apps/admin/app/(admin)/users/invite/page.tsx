import { getRoles } from "@repo/database"
import { requirePermission } from "@/app/_lib/require-section-access"
import { InviteForm } from "./invite-form"

export default async function InviteUserPage() {
    await requirePermission("User Edit")
    const roles = await getRoles()

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">Invite User</h1>
            <InviteForm roles={roles} />
        </div>
    )
}
