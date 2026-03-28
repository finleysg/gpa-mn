export type ProcessStep = {
    step: number
    title: string
    description: string
    details: string[]
    icon: string
}

export const adoptionProcess: ProcessStep[] = [
    {
        step: 1,
        title: "Learn About Greyhounds",
        description:
            "Research the greyhound breed and attend one of our Meet & Greet events to interact with greyhounds in person.",
        details: [
            "Read about greyhound temperament, exercise needs, and care requirements",
            "Attend a Meet & Greet event to meet adoptable dogs and talk with experienced owners",
            "Discuss with your family whether a greyhound is the right fit for your household",
            "Consider your living situation, other pets, and daily schedule",
        ],
        icon: "📚",
    },
    {
        step: 2,
        title: "Submit Your Application",
        description:
            "Complete our online adoption application and participate in an interview with our Adoption Coordinator.",
        details: [
            "Fill out the online adoption application with details about your home and lifestyle",
            "An Adoption Coordinator will contact you for a phone or in-person interview",
            "We may ask for a veterinary reference if you have other pets",
            "An Adoption Representative will be assigned to guide you through the process",
        ],
        icon: "📝",
    },
    {
        step: 3,
        title: "The Match",
        description:
            "Our experienced coordinators identify the greyhound that best fits your family, lifestyle, and preferences.",
        details: [
            "Coordinators consider your home environment, activity level, and other pets",
            "We carefully match each dog based on temperament and your specific needs",
            "Your Adoption Representative will discuss potential matches with you",
            "We prioritize finding the right match — not just any match",
        ],
        icon: "🤝",
    },
    {
        step: 4,
        title: "Welcome Home",
        description:
            "Meet your new greyhound, sign the adoption contract, and bring your new family member home!",
        details: [
            "Meet your matched greyhound at the foster home or a scheduled meeting",
            "Sign the adoption contract and pay the non-refundable adoption fee",
            "Receive a starter kit with food, leash, and care information",
            "Join the GPA‑MN Facebook community for ongoing support and advice",
        ],
        icon: "🏠",
    },
]
