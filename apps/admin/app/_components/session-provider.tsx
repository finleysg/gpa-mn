"use client"

import { createContext, useContext } from "react"
import type { PermissionName, RoleName } from "@repo/database"

interface SessionContextValue {
    user: { id: string; name: string; email: string }
    roles: RoleName[]
    permissions: PermissionName[]
    isSuperAdmin: boolean
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({
    children,
    value,
}: {
    children: React.ReactNode
    value: SessionContextValue
}) {
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
    const ctx = useContext(SessionContext)
    if (!ctx) throw new Error("useSession must be used within a SessionProvider")
    return ctx
}
