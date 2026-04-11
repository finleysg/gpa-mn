export type DerivedColumns = {
    pets: "Cat" | "Small Dog" | "Other" | "None" | null
    kids: "Yes" | "No" | null
    housing: string | null
    chipper: "Yes" | "No" | null
}

type SectionData = Record<string, unknown> | undefined

function derivePets(data: SectionData): DerivedColumns["pets"] {
    if (!data) return null
    if (data.hasCat === "Yes") return "Cat"
    if (data.smallAnimalNeeds === "Small Dog Friendly") return "Small Dog"
    if (data.smallAnimalNeeds === "Cat Trainable" || data.smallAnimalNeeds === "Other Small Animal")
        return "Other"
    return "None"
}

function deriveKids(data: SectionData): DerivedColumns["kids"] {
    if (!data) return null
    if (data.hasChildren5to8 === "Yes" || data.hasChildrenUnder5 === "Yes") return "Yes"
    return "No"
}

function deriveHousing(data: SectionData): DerivedColumns["housing"] {
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

function deriveChipper(data: SectionData): DerivedColumns["chipper"] {
    if (!data) return null
    const arr = data.howHeardAboutGPA
    if (Array.isArray(arr) && arr.includes("Chipper")) return "Yes"
    return "No"
}

export function deriveAllColumns(
    sections: Partial<Record<string, Record<string, unknown>>>,
): DerivedColumns {
    return {
        pets: derivePets(sections["current_pets"]),
        kids: deriveKids(sections["household"]),
        housing: deriveHousing(sections["home"]),
        chipper: deriveChipper(sections["final_questions"]),
    }
}

export function computeAgeDays(submittedAt: Date | null): number | null {
    if (!submittedAt) return null
    return Math.floor((Date.now() - new Date(submittedAt).getTime()) / (1000 * 60 * 60 * 24))
}
