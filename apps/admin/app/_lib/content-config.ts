import type { ContentType } from "@repo/types"

export interface ContentTypeConfig {
    contentType: ContentType
    slug: string
    singular: string
    plural: string
    tableColumns: { key: string; label: string }[]
    allowCreate?: boolean
    sortBy?: string
}

export const contentTypeConfigs: Record<ContentType, ContentTypeConfig> = {
    sectionHeader: {
        contentType: "sectionHeader",
        slug: "section-headers",
        singular: "Section Header",
        plural: "Section Headers",
        allowCreate: false,
        sortBy: "location",
        tableColumns: [
            { key: "title", label: "Title" },
            { key: "location", label: "Location" },
        ],
    },
    pageHeader: {
        contentType: "pageHeader",
        slug: "page-headers",
        singular: "Page Header",
        plural: "Page Headers",
        allowCreate: false,
        sortBy: "location",
        tableColumns: [
            { key: "title", label: "Title" },
            { key: "location", label: "Location" },
        ],
    },
    adoptionStep: {
        contentType: "adoptionStep",
        slug: "adoption-steps",
        singular: "Adoption Step",
        plural: "Adoption Steps",
        tableColumns: [
            { key: "step", label: "Step" },
            { key: "title", label: "Title" },
            { key: "icon", label: "Icon" },
        ],
    },
    volunteerRole: {
        contentType: "volunteerRole",
        slug: "volunteer-roles",
        singular: "Volunteer Role",
        plural: "Volunteer Roles",
        tableColumns: [
            { key: "title", label: "Title" },
            { key: "commitment", label: "Commitment" },
            { key: "icon", label: "Icon" },
        ],
    },
    donationOption: {
        contentType: "donationOption",
        slug: "donation-options",
        singular: "Donation Option",
        plural: "Donation Options",
        tableColumns: [
            { key: "title", label: "Title" },
            { key: "icon", label: "Icon" },
        ],
    },
    aboutPage: {
        contentType: "aboutPage",
        slug: "about-page",
        singular: "About Page",
        plural: "About Page",
        allowCreate: false,
        tableColumns: [{ key: "title", label: "Title" }],
    },
    beforeYouApply: {
        contentType: "beforeYouApply",
        slug: "before-you-apply",
        singular: "Before You Apply",
        plural: "Before You Apply",
        allowCreate: false,
        tableColumns: [
            { key: "label", label: "Label" },
            { key: "title", label: "Title" },
        ],
    },
    postAdoptionSupport: {
        contentType: "postAdoptionSupport",
        slug: "post-adoption-support",
        singular: "Support Resource",
        plural: "Support Resources",
        tableColumns: [
            { key: "title", label: "Title" },
            { key: "icon", label: "Icon" },
        ],
    },
    lostHoundSuggestion: {
        contentType: "lostHoundSuggestion",
        slug: "lost-hound-suggestions",
        singular: "Suggestion",
        plural: "Suggestions",
        tableColumns: [
            { key: "title", label: "Title" },
            { key: "icon", label: "Icon" },
        ],
    },
    whyGreyhound: {
        contentType: "whyGreyhound",
        slug: "why-greyhounds",
        singular: "Why Greyhound",
        plural: "Why Greyhounds",
        tableColumns: [
            { key: "title", label: "Title" },
            { key: "icon", label: "Icon" },
        ],
    },
}
