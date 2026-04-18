import { getPermissionContext, getSessionOrRedirect } from "@/app/lib/auth-utils"
import { canViewAllAdoptions, canViewFosters } from "@/app/_lib/require-section-access"
import { getUser } from "@repo/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { ChangeEmailForm } from "./change-email-form"
import { PhoneForm } from "./phone-form"
import { ChangePasswordForm } from "./change-password-form"
import { NotificationSettingsForm } from "./notification-settings-form"

export default async function AccountPage() {
    const session = await getSessionOrRedirect()
    const [userData, ctx] = await Promise.all([
        getUser(session.user.id),
        getPermissionContext(session.user.id),
    ])

    const showSubmission = canViewAllAdoptions(ctx)
    const showAssignment = userData?.roles.some((r) => r.name === "Adoption Rep") ?? false
    const showFosterSubmission = canViewFosters(ctx)
    const showNotifications = showSubmission || showAssignment || showFosterSubmission

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
                            notifyOnFosterSubmission={userData?.notifyOnFosterSubmission ?? true}
                            showSubmission={showSubmission}
                            showAssignment={showAssignment}
                            showFosterSubmission={showFosterSubmission}
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
