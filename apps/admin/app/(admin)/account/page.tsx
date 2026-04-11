import { getSessionOrRedirect } from "@/app/lib/auth-utils"
import { getUser } from "@repo/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { ChangeEmailForm } from "./change-email-form"
import { PhoneForm } from "./phone-form"
import { ChangePasswordForm } from "./change-password-form"
import { NotificationSettingsForm } from "./notification-settings-form"

const SUBMISSION_ROLES = [
    "Super Admin",
    "User Admin",
    "Content Admin",
    "Adoption Matcher",
    "Adoption Coordinator",
    "Adoption Observer",
]

export default async function AccountPage() {
    const session = await getSessionOrRedirect()
    const userData = await getUser(session.user.id)

    const roleNames = userData?.roles.map((r) => r.name) ?? []
    const showSubmission = roleNames.some((r) => SUBMISSION_ROLES.includes(r))
    const showAssignment = roleNames.includes("Adoption Rep")
    const showNotifications = showSubmission || showAssignment

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <h1 className="text-2xl font-semibold">Account Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Email</CardTitle>
                    <CardDescription>
                        Update your email address. A verification link will be sent to the new
                        address.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangeEmailForm currentEmail={session.user.email} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Phone</CardTitle>
                    <CardDescription>Add or update your phone number.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PhoneForm currentPhone={userData?.phone ?? null} />
                </CardContent>
            </Card>

            {showNotifications && (
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            Choose which email notifications you receive.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NotificationSettingsForm
                            notifyOnSubmission={userData?.notifyOnSubmission ?? true}
                            notifyOnAssignment={userData?.notifyOnAssignment ?? true}
                            showSubmission={showSubmission}
                            showAssignment={showAssignment}
                        />
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                        Change your password. All other sessions will be signed out.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    )
}
