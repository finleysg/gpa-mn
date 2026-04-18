export type { ApplicationStatus, SectionKey, SectionCategory, Milestone } from "@repo/database"

// === Helper interfaces ===

export interface HouseholdMember {
    name: string
    age: string
    relationship: string
}

export interface CurrentPetEntry {
    breed: string
    age: string
    gender: string
}

// === Section data interfaces ===

export interface ApplicantInfoData {
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

export interface HouseholdData {
    hasOtherMembers: "Yes" | "No"
    householdMembers?: HouseholdMember[]
    hasChildren5to8: "Yes" | "No" | "Other"
    hasChildrenUnder5: "Yes" | "No" | "Other"
    expectYoungChildren: "Yes" | "No" | "Maybe"
    childInteractionCircumstances?: string
}

export interface PreAdoptionData {
    attendedMeetAndGreet: "Yes" | "No"
    meetAndGreetAttended?: string
    meetAndGreetPlanning?: string
    meetAndGreetDate?: string
    completedReading: "Yes" | "No"
    booksRead?: string[]
    booksToRead?: string[]
    readingCompletionDate?: string
    completedChildrenReading?: "Yes" | "No"
    childrenBooksRead?: string[]
    childrenBooksToRead?: string[]
    childrenBooksToReadFuture?: string[]
    childrenReadingDate?: string
}

export interface HomeData {
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

export interface CurrentPetsData {
    hasCurrentPets: "Yes" | "No"
    previousGreyhoundAdoption: string
    otherAdoptionGroups?: string
    currentPets?: CurrentPetEntry[]
    hasCat: "Yes" | "No"
    smallAnimalNeeds: "No" | "Cat Trainable" | "Small Dog Friendly" | "Other Small Animal"
    smallDogDescription?: string
    timeWithSmallAnimal?: "<10%" | "10-25%" | "25-50%" | ">50%"
    smallAnimalExplanation?: string
    catTrainableLimitations?: "Yes" | "No"
    previouslyOwnedDog: "Yes" | "No"
    previousDogBreeds?: string
    previousDogDuration?: string
    previousDogReason?: string
    everReturnedDog: "Yes" | "No"
    returnExplanation?: string
    dogBehaviorKnowledge: number
}

export interface YourGreyhoundData {
    adoptionTimeline: string
    whyGreyhound: string
    offLeashPlans: string
    kennelingPlan: string
    energyLevelPreference?: string
    seniorSpecialNeeds:
        | "Senior only"
        | "Special needs only"
        | "Either"
        | "Maybe"
        | "Not at this time"
    specialNeedsConsidering?: string[]
    leashUsage: string[]
    genderPreference: string
    genderPreferenceReason?: string
    hoursAlone: string
    hoursAlonePlan?: string
    sleepingArrangement: string
    keepingLocation: string[]
    genderImportance: number
    ageImportance: number
    energyImportance: number
    kenneledImportance: number
    catImportance: number
    smallDogImportance: number
    kidsImportance: number
    joggingImportance: number
    otherImportance?: number
    otherConsideration?: string
    returnCircumstances: string[]
}

export interface VetReferenceData {
    noVetReason?: string[]
    vetClinic?: string
    vetName?: string
    vetPhone?: string
    petsCurrentOnVaccines: "Yes" | "No"
    vaccineExplanation?: string
}

export interface PersonalReferencesData {
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

export interface FinalQuestionsData {
    yearlyVetExams: "Yes" | "No"
    currentVaccinations: "Yes" | "No"
    heartwormFleaPrevention: "Yes" | "No"
    disagreementExplanation?: string
    howHeardAboutGPA: string[]
    spokenToMember: string
    applyingToOtherGroups: "Yes" | "No"
    otherGroupsExplanation?: string
    finalComments?: string
    agreeToTerms: "Yes" | "No"
}

// === Section data map ===

export interface SectionDataMap {
    applicant_info: ApplicantInfoData
    household: HouseholdData
    pre_adoption: PreAdoptionData
    home: HomeData
    current_pets: CurrentPetsData
    your_greyhound: YourGreyhoundData
    vet_reference: VetReferenceData
    personal_references: PersonalReferencesData
    final_questions: FinalQuestionsData
}

export type AnySectionData = SectionDataMap[keyof SectionDataMap]

// === Application comment ===

import type { SectionCategory } from "@repo/database"

export interface ApplicationComment {
    id: number
    applicationId: number
    userId: string
    userName: string
    sectionCategory: SectionCategory | null
    body: string
    isSystemEvent: boolean
    createdAt: Date
}

// === Conditional rule ===

export type ConditionOperator = "equals" | "notEquals" | "includes" | "truthy"

export interface ConditionalRule<K extends string = string> {
    targetField: string
    targetSection: K
    sourceField: string
    sourceSection: K
    condition: ConditionOperator
    value?: unknown
}

// === Field/section config (generic over section key) ===

export type FieldType =
    | "text"
    | "textarea"
    | "email"
    | "phone"
    | "number"
    | "radio"
    | "dropdown"
    | "checkbox"
    | "scale"
    | "repeating"

export interface FieldOption {
    value: string
    label: string
}

export interface FieldDef {
    name: string
    label: string
    type: FieldType
    required?: boolean
    options?: FieldOption[]
    placeholder?: string
    helpText?: string
    scaleMin?: number
    scaleMax?: number
    scaleMinLabel?: string
    scaleMaxLabel?: string
    min?: number
    max?: number
    subFields?: FieldDef[]
    minEntries?: number
    maxEntries?: number
}

export interface SectionConfig<K extends string = string> {
    key: K
    title: string
    description?: string
    fields: FieldDef[]
}
