import { getInvitationByToken } from "@repo/database"
import { AcceptInviteForm } from "./accept-invite-form"

export default async function AcceptInvitePage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) {
    const { token } = await searchParams

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Invalid invitation link.</p>
            </div>
        )
    }

    const invite = await getInvitationByToken(token)

    if (!invite || invite.status !== "pending") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">This invitation is no longer valid.</p>
            </div>
        )
    }

    if (new Date(invite.expiresAt) < new Date()) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">This invitation has expired.</p>
            </div>
        )
    }

    return <AcceptInviteForm email={invite.email} token={token} />
}
