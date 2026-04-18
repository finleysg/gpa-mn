import { SidebarProvider, SidebarInset, SidebarTrigger } from "@repo/ui/components/sidebar"
import { AppSidebar } from "@/app/_components/app-sidebar"
import { SessionProvider } from "@/app/_components/session-provider"
import {
    getPermissionContext,
    getSessionOrRedirect,
    getUserRolesFromSession,
} from "@/app/lib/auth-utils"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSessionOrRedirect()
    const [roles, ctx] = await Promise.all([
        getUserRolesFromSession(session.user.id),
        getPermissionContext(session.user.id),
    ])

    return (
        <SessionProvider
            value={{
                user: session.user,
                roles,
                permissions: ctx.permissions,
                isSuperAdmin: ctx.isSuperAdmin,
            }}
        >
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-14 items-center border-b px-4">
                        <SidebarTrigger />
                    </header>
                    <main className="p-6">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </SessionProvider>
    )
}
