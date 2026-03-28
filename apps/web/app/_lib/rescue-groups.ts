import { unstable_cache } from "next/cache"
import { differenceInYears, parse } from "date-fns"
import type { Dog, DogImage } from "@/app/_data/dogs"

type ApiAnimalPicture = {
    mediaID: string
    urlSecureFullsize: string
    large: { url: string; resolutionX: number; resolutionY: number }
}

type ApiAnimal = {
    animalID: string
    animalName: string
    animalBirthdate: string
    animalSex: string
    animalColor: string
    animalOKWithCats: string
    animalOKWithDogs: string
    animalSummary: string
    animalDescriptionPlain: string
    animalPictures: ApiAnimalPicture[]
    animalAdoptionPending: string
}

type ApiResponse = {
    status: string
    foundRows: number
    data: Record<string, ApiAnimal>
}

function decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&apos;": "'",
        "&rsquo;": "\u2019",
        "&lsquo;": "\u2018",
        "&rdquo;": "\u201D",
        "&ldquo;": "\u201C",
        "&ndash;": "\u2013",
        "&mdash;": "\u2014",
        "&hellip;": "\u2026",
        "&nbsp;": " ",
    }
    return text
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&[a-z]+;/gi, (match) => entities[match] ?? match)
}

function parseFriendly(value: string): boolean | null {
    if (value === "Yes") return true
    if (value === "No") return false
    return null
}

function mapAnimalToDog(animal: ApiAnimal): Dog {
    const birthdate = parse(animal.animalBirthdate, "M/d/yyyy", new Date())
    const age = differenceInYears(new Date(), birthdate)

    const pictures = Array.isArray(animal.animalPictures) ? animal.animalPictures : []
    const images: DogImage[] = pictures.map((pic) => ({
        id: pic.mediaID,
        url: pic.large.url,
        width: pic.large.resolutionX,
        height: pic.large.resolutionY,
    }))

    const catFriendly = parseFriendly(animal.animalOKWithCats)
    const dogFriendly = parseFriendly(animal.animalOKWithDogs)

    const traits: string[] = []
    if (catFriendly === true) traits.push("Cat Friendly")
    if (dogFriendly === true) traits.push("Dog Friendly")

    const bio = decodeHtmlEntities(animal.animalDescriptionPlain).replace(/\r\n/g, "\n").trim()

    const leftMatch = animal.animalSummary.match(/L\s*(\w+)/)
    const rightMatch = animal.animalSummary.match(/R\s+(\w+)/)
    const earTattoos = {
        left: leftMatch ? leftMatch[1]! : null,
        right: rightMatch ? rightMatch[1]! : null,
    }

    return {
        id: animal.animalID,
        name: animal.animalName,
        image: images[0]?.url ?? "",
        images,
        age,
        sex: animal.animalSex as "Male" | "Female",
        color: animal.animalColor || "Unknown",
        catFriendly,
        dogFriendly,
        bio,
        traits,
        earTattoos,
        adoptionPending: animal.animalAdoptionPending === "Yes",
    }
}

async function fetchDogsFromApi(): Promise<Dog[]> {
    const response = await fetch("https://api.rescuegroups.org/http/v2.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            apikey: process.env.RESCUE_GROUPS_API_KEY,
            objectType: "animals",
            objectAction: "publicSearch",
            search: {
                resultStart: 0,
                resultLimit: 50,
                resultSort: "animalName",
                resultOrder: "asc",
                fields: [
                    "animalID",
                    "animalName",
                    "animalBirthdate",
                    "animalSex",
                    "animalColor",
                    "animalOKWithCats",
                    "animalOKWithDogs",
                    "animalSummary",
                    "animalDescriptionPlain",
                    "animalPictures",
                    "animalAdoptionPending",
                ],
                filters: [
                    { fieldName: "animalStatus", operation: "equals", criteria: "Available" },
                    {
                        fieldName: "animalOrgID",
                        operation: "equals",
                        criteria: Number(process.env.RESCUE_GROUPS_ORG_ID),
                    },
                ],
            },
        }),
    })

    if (!response.ok) {
        throw new Error(`RescueGroups API error: ${response.status}`)
    }

    const json = (await response.json()) as ApiResponse

    if (json.status !== "ok") {
        throw new Error(`RescueGroups API returned status: ${json.status}`)
    }

    return Object.values(json.data).map(mapAnimalToDog)
}

export const fetchDogs = unstable_cache(fetchDogsFromApi, ["rescue-groups-dogs"], {
    revalidate: 300,
    tags: ["rescue-groups-dogs"],
})

export async function fetchDog(id: string): Promise<Dog | undefined> {
    const dogs = await fetchDogs()
    return dogs.find((d) => d.id === id)
}
