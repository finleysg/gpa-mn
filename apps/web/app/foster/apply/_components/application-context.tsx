"use client"

import { createContext, useContext } from "react"
import type { FosterApplicationStatus, FosterSectionKey } from "@repo/database"

interface FosterApplicationContextValue {
    applicationId: number
    status: FosterApplicationStatus
    completedSections: FosterSectionKey[]
}

const FosterApplicationContext = createContext<FosterApplicationContextValue | null>(null)

export function FosterApplicationProvider({
    children,
    value,
}: {
    children: React.ReactNode
    value: FosterApplicationContextValue
}) {
    return <FosterApplicationContext value={value}>{children}</FosterApplicationContext>
}

export function useFosterApplication() {
    const context = useContext(FosterApplicationContext)
    if (!context) {
        throw new Error("useFosterApplication must be used within a FosterApplicationProvider")
    }
    return context
}
