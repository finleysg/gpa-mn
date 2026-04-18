export type {
    FosterApplicationStatus,
    FosterSectionKey,
    FosterSectionCategory,
    FosterMilestone,
} from "@repo/database"

import type { FosterSectionCategory } from "@repo/database"

// Applicant & household data reuses the same shapes as adoption since
// the questions are identical in those sections.

export interface FosterHouseholdMember {
    name: string
    age: string
    relationship: string
}

export interface FosterCurrentPetEntry {
    breed: string
    age: string
    gender: string
}

export interface FosterApplicantInfoData {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    phone: string
    phoneType: "Cell" | "Home" | "Work"
    occupation: string
    email: string
    hasCoApplicant: "Yes" | "No"
    coApplicantFirstName?: string
    coApplicantLastName?: string
    coApplicantOccupation?: string
    coApplicantEmail?: string
    coApplicantPhone?: string
    coApplicantPhoneType?: "Cell" | "Home" | "Work"
    relationship?: string
}

export interface FosterHouseholdData {
    hasOtherMembers: "Yes" | "No"
    householdMembers?: FosterHouseholdMember[]
    hasChildren5to8: "Yes" | "No" | "Other"
    hasChildrenUnder5: "Yes" | "No" | "Other"
    expectYoungChildren: "Yes" | "No" | "Maybe"
    childInteractionCircumstances?: string
}

export interface FosterPreFosterData {
    bookRead: string
    completedChildrenReading?: "Yes" | "No"
    meetAndGreetAttended: string
}

export interface FosterHomeData {
    homeType: string
    ownOrRent: "Own" | "Rent"
    landlordInfo?: string
    petLimitations?: string
    openToHomeVisit: "Yes" | "No"
    homeVisitExplanation?: string
    hasFencedYard: "Yes" | "No"
    fenceTypeAndHeight?: string
    otherFenceDescription?: string
    noFencePlan?: string
    activityLevel: "Quiet" | "Average" | "High Energy"
    hasAllergies: "Yes" | "No"
    allergyExplanation?: string
    apprehensiveMember: string
    apprehensiveExplanation?: string
}

export interface FosterCurrentPetsData {
    hasCurrentPets: "Yes" | "No"
    previousGreyhoundAdoption: string
    otherAdoptionGroups?: string
    currentPets?: FosterCurrentPetEntry[]
    timeWithSmallAnimal: "Yes" | "No"
    willingToMuzzle: "Yes" | "No"
    previouslyOwnedDog: "Yes" | "No"
    previousDogBreeds?: string
    previousDogDuration?: string
    previousDogReason?: string
    dogBehaviorKnowledge: number
}

export interface FosterPreferencesData {
    whyFoster: string
    kennelingPlan: string
    genderPreference: string
    hoursAlone: string
    hoursAlonePlan?: string
    sleepingArrangement: string
    specialMatchingConsiderations?: string
    alsoInterestedInAdopting: "Yes" | "No"
    agreeVetTransport: "Yes" | "No"
    agreeWorkWithReps: "Yes" | "No"
    repCooperationExplanation?: string
    seniorSpecialNeeds:
        | "Senior only"
        | "Special needs only"
        | "Either"
        | "Maybe"
        | "Not at this time"
    returnCircumstances: string[]
}

export interface FosterVetReferenceData {
    vetClinic?: string
    vetName?: string
    vetPhone?: string
    petsCurrentOnVaccines: "Yes" | "No"
    vaccineExplanation?: string
}

export interface FosterPersonalReferencesData {
    ref1FirstName: string
    ref1LastName: string
    ref1Phone: string
    ref1Email?: string
    ref1YearsKnown: number
    ref2FirstName: string
    ref2LastName: string
    ref2Phone: string
    ref2Email?: string
    ref2YearsKnown: number
}

// Foster agreements: one YES/NO per clause. Keys match the JotForm q-ids so
// the audit trail lines up with the legacy form.
export interface FosterAgreementsData {
    agreeMissionRacingFriendly: "Yes" | "No"
    agreeGpamnProperty: "Yes" | "No"
    agreeCooperateWithReps: "Yes" | "No"
    agreeNotifyOnProblems: "Yes" | "No"
    agreeGpamnMatches: "Yes" | "No"
    agreeIndoorOnly: "Yes" | "No"
    agreeSpayNeuterVetCare: "Yes" | "No"
    agreeAcclimateAndUpdate: "Yes" | "No"
    agreeNeverStakedOrTied: "Yes" | "No"
    agreeNoOpenBedTransport: "Yes" | "No"
    agreeHandheldLeashOnly: "Yes" | "No"
    agreeLeashedBathroomBreaks: "Yes" | "No"
    agreeCheckFenceBeforeRelease: "Yes" | "No"
    agreeCollarWithId: "Yes" | "No"
    understandDogBehaviorRisks: "Yes" | "No"
    understandInjuryRisk: "Yes" | "No"
    agreeSupervisedInteractions: "Yes" | "No"
    agreeNotifyOnEscape: "Yes" | "No"
    agreeAdoptionProcessApplies: "Yes" | "No"
    agreeMedicalReimbursementCap: "Yes" | "No"
    agreeInjuryVetProtocol: "Yes" | "No"
    agreeConditionsAndRepossession: "Yes" | "No"
    understandInsuranceScope: "Yes" | "No"
    agreeHoldHarmless: "Yes" | "No"
    understandDisagreementDisqualifies: "Yes" | "No"
}

export interface FosterFinalQuestionsData {
    howHeardAboutGPA: string[]
    fosteredOtherGroups: "Yes" | "No"
    otherGroupsExplanation?: string
    finalComments?: string
    applicantSignature: string
    coApplicantSignature?: string
    signedOn: string
}

export interface FosterSectionDataMap {
    applicant_info: FosterApplicantInfoData
    household: FosterHouseholdData
    pre_foster: FosterPreFosterData
    home: FosterHomeData
    current_pets: FosterCurrentPetsData
    foster_preferences: FosterPreferencesData
    vet_reference: FosterVetReferenceData
    personal_references: FosterPersonalReferencesData
    foster_agreements: FosterAgreementsData
    final_questions: FosterFinalQuestionsData
}

export type AnyFosterSectionData = FosterSectionDataMap[keyof FosterSectionDataMap]

export interface FosterApplicationComment {
    id: number
    fosterApplicationId: number
    userId: string
    userName: string
    sectionCategory: FosterSectionCategory | null
    body: string
    isSystemEvent: boolean
    createdAt: Date
}
