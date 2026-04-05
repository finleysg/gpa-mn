import { getRoles } from "@repo/database"
import { requireSectionAccess } from "@/app/_lib/require-section-access"
import { InviteForm } from "./invite-form"

export default async function InviteUserPage() {
    await requireSectionAccess("users")
    const roles = await getRoles()

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">Invite User</h1>
            <InviteForm roles={roles} />
        </div>
    )
}
