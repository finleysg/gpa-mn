export type DogImage = {
    id: string
    url: string
    width: number
    height: number
}

export type Dog = {
    id: string
    name: string
    image: string
    images: DogImage[]
    age: number
    sex: "Male" | "Female"
    color: string
    catFriendly: boolean | null
    dogFriendly: boolean | null
    bio: string
    traits: string[]
    earTattoos: { left: string | null; right: string | null }
    adoptionPending: boolean
}
