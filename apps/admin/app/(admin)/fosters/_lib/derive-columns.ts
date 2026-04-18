export type FosterDerivedColumns = {
    pets: "Yes" | "No" | null
    kids: "Yes" | "No" | null
    housing: string | null
    referral: string | null
    alsoAdopting: "Yes" | "No" | null
}

type SectionData = Record<string, unknown> | undefined

function derivePets(data: SectionData): FosterDerivedColumns["pets"] {
    if (!data) return null
    if (data.hasCurrentPets === "Yes") return "Yes"
    if (data.hasCurrentPets === "No") return "No"
    return null
}

function deriveKids(data: SectionData): FosterDerivedColumns["kids"] {
    if (!data) return null
    if (data.hasChildren5to8 === "Yes" || data.hasChildrenUnder5 === "Yes") return "Yes"
    return "No"
}

function deriveHousing(data: SectionData): FosterDerivedColumns["housing"] {
    if (!data) return null
    const homeType = data.homeType as string | undefined
    const hasFence = data.hasFencedYard as string | undefined
    if (!homeType) return null
    if (homeType === "House" && hasFence === "Yes") return "House w/ fence"
    if (homeType === "House") return "House no fence"
    if (homeType === "Apartment") return "Apartment"
    if (homeType === "Condo" || homeType === "Townhouse") return "Shared Walls"
    return homeType
}

function deriveReferral(data: SectionData): FosterDerivedColumns["referral"] {
    if (!data) return null
    const arr = data.howHeardAboutGPA
    if (!Array.isArray(arr) || arr.length === 0) return null
    return arr.join(", ")
}

function deriveAlsoAdopting(data: SectionData): FosterDerivedColumns["alsoAdopting"] {
    if (!data) return null
    if (data.alsoInterestedInAdopting === "Yes") return "Yes"
    if (data.alsoInterestedInAdopting === "No") return "No"
    return null
}

export function deriveAllColumns(
    sections: Partial<Record<string, Record<string, unknown>>>,
): FosterDerivedColumns {
    return {
        pets: derivePets(sections["current_pets"]),
        kids: deriveKids(sections["household"]),
        housing: deriveHousing(sections["home"]),
        referral: deriveReferral(sections["final_questions"]),
        alsoAdopting: deriveAlsoAdopting(sections["foster_preferences"]),
    }
}

export function computeAgeDays(submittedAt: Date | null): number | null {
    if (!submittedAt) return null
    return Math.floor((Date.now() - new Date(submittedAt).getTime()) / (1000 * 60 * 60 * 24))
}
