"use client"

import { createContext, useContext } from "react"
import type { ApplicationStatus, SectionKey } from "@repo/database"

interface ApplicationContextValue {
    applicationId: number
    status: ApplicationStatus
    completedSections: SectionKey[]
}

const ApplicationContext = createContext<ApplicationContextValue | null>(null)

export function ApplicationProvider({
    children,
    value,
}: {
    children: React.ReactNode
    value: ApplicationContextValue
}) {
    return <ApplicationContext value={value}>{children}</ApplicationContext>
}

export function useApplication() {
    const context = useContext(ApplicationContext)
    if (!context) {
        throw new Error("useApplication must be used within an ApplicationProvider")
    }
    return context
}
