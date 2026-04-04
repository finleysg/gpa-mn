export type EventType = "Annual" | "Fundraiser" | "Monthly" | "Weekly" | "Seasonal" | "Special"
export type EventRecurrence = "once" | "weekly" | "monthly"

export interface EventData {
    id: number
    title: string
    startDate: string
    endDate: string | null
    recurrence: EventRecurrence
    time: string
    location: string
    type: EventType
    description: string
    longDescription: string
    archived: boolean
    showUpcoming: boolean
    createdAt: Date
    updatedAt: Date
}

export interface SectionHeaderData {
    title: string
    description?: string
    location?: string
}

export interface PageHeaderData {
    title: string
    highlight?: string
    description?: string
    variant?: "default" | "urgent"
    location?: string
}

export interface AdoptionStepData {
    step: number
    title: string
    description: string
    details: string[]
    icon: string
}

export interface VolunteerRoleData {
    title: string
    description: string
    icon: string
    commitment: string
}

export interface DonationOptionData {
    title: string
    description: string
    icon: string
}

export interface AboutPageData {
    title: string
    body: string
}

export interface BeforeYouApplyData {
    label: string
    title: string
    text: string
}

export interface PostAdoptionSupportData {
    title: string
    description: string
    icon: string
}

export interface LostHoundSuggestionData {
    title: string
    description: string
    icon: string
}

export interface WhyGreyhoundData {
    title: string
    description: string
    icon: string
}

export interface WhyChooseUsData {
    title: string
    body: string
}

export type PageSection = "adopt" | "volunteer" | "donate"

export interface PageData {
    section: PageSection
    title: string
    description?: string
    body: string
    printable: boolean
}

export interface ContentTypeMap {
    sectionHeader: SectionHeaderData
    pageHeader: PageHeaderData
    adoptionStep: AdoptionStepData
    volunteerRole: VolunteerRoleData
    donationOption: DonationOptionData
    aboutPage: AboutPageData
    beforeYouApply: BeforeYouApplyData
    postAdoptionSupport: PostAdoptionSupportData
    lostHoundSuggestion: LostHoundSuggestionData
    whyGreyhound: WhyGreyhoundData
    whyChooseUs: WhyChooseUsData
    page: PageData
}

export type ContentType = keyof ContentTypeMap
