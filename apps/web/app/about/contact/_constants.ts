export const CONTACT_CATEGORIES = [
    { value: "general", label: "General Inquiry" },
    { value: "fostering", label: "Fostering" },
    { value: "volunteer", label: "Volunteer" },
    { value: "vet-care", label: "Vet Care" },
    { value: "meet-and-greet", label: "Meet & Greet" },
    { value: "lost-hounds", label: "Lost Hounds" },
    { value: "returns", label: "Returns" },
    { value: "whistle-blower", label: "Whistle Blower" },
] as const

export type ContactCategoryValue = (typeof CONTACT_CATEGORIES)[number]["value"]
