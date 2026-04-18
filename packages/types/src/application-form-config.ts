import type { SectionKey } from "@repo/database"
import type { ConditionalRule, FieldOption, SectionConfig } from "./applications"

// === Shared option constants ===

export const YES_NO_OPTIONS: FieldOption[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
]

export const YES_NO_OTHER_OPTIONS: FieldOption[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "Other", label: "Other" },
]

export const YES_NO_MAYBE_OPTIONS: FieldOption[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "Maybe", label: "Maybe" },
]

export const PHONE_TYPE_OPTIONS: FieldOption[] = [
    { value: "Cell", label: "Cell" },
    { value: "Home", label: "Home" },
    { value: "Work", label: "Work" },
]

export const MEET_AND_GREET_LOCATIONS: FieldOption[] = [
    { value: "Burnsville PetSmart", label: "Burnsville PetSmart" },
    { value: "Eden Prairie PetSmart", label: "Eden Prairie PetSmart" },
    { value: "Woodbury PetSmart", label: "Woodbury PetSmart" },
    { value: "Blaine PetSmart", label: "Blaine PetSmart" },
    { value: "Minnetonka PetSmart", label: "Minnetonka PetSmart" },
    { value: "Rochester PetSmart", label: "Rochester PetSmart" },
    { value: "Other Event", label: "Other Event" },
]

export const BOOK_OPTIONS: FieldOption[] = [
    {
        value: "Retired Racing Greyhounds for Dummies",
        label: "Retired Racing Greyhounds for Dummies",
    },
    { value: "Adopting the Racing Greyhound", label: "Adopting the Racing Greyhound" },
]

export const CHILDREN_BOOK_OPTIONS: FieldOption[] = [
    {
        value: "Living with Kids and Dogs Without Losing Your Mind",
        label: "Living with Kids and Dogs Without Losing Your Mind",
    },
    { value: "Happy Kids, Happy Dogs", label: "Happy Kids, Happy Dogs" },
]

export const HOME_TYPE_OPTIONS: FieldOption[] = [
    { value: "House", label: "House" },
    { value: "Apartment", label: "Apartment" },
    { value: "Condo", label: "Condo" },
    { value: "Townhouse", label: "Townhouse" },
    { value: "Mobile Home", label: "Mobile Home" },
    { value: "Other", label: "Other" },
]

export const OWN_RENT_OPTIONS: FieldOption[] = [
    { value: "Own", label: "Own" },
    { value: "Rent", label: "Rent" },
]

export const HOME_VISIT_OPTIONS: FieldOption[] = [
    { value: "Yes", label: "Yes, that's fine" },
    { value: "No", label: "No, I'd prefer not" },
]

export const FENCE_TYPE_OPTIONS: FieldOption[] = [
    { value: "Chainlink 4 feet", label: "Chainlink, 4 feet" },
    { value: "Chainlink higher than 4 feet", label: "Chainlink, higher than 4 feet" },
    { value: "Wood 4 feet", label: "Wood, 4 feet" },
    { value: "Wood higher than 4 feet", label: "Wood, higher than 4 feet" },
    { value: "Other 4 feet or less", label: "Other, 4 feet or less" },
    { value: "Other higher than 4 feet", label: "Other, higher than 4 feet" },
]

export const ACTIVITY_LEVEL_OPTIONS: FieldOption[] = [
    { value: "Quiet", label: "Quiet" },
    { value: "Average", label: "Average" },
    { value: "High Energy", label: "High Energy" },
]

export const APPREHENSIVE_MEMBER_OPTIONS: FieldOption[] = [
    { value: "On board", label: "Everyone is on board" },
    { value: "Unsure", label: "Someone is unsure" },
    { value: "Not convinced", label: "Someone is not convinced" },
    { value: "Bad timing", label: "Someone thinks it's bad timing" },
    { value: "Dislikes animals", label: "Someone dislikes animals" },
    { value: "Only person", label: "I'm the only person in the household" },
    { value: "Other", label: "Other" },
]

export const PREVIOUS_GREYHOUND_OPTIONS: FieldOption[] = [
    { value: "This is my first greyhound", label: "This is my first greyhound" },
    { value: "Have current from GPA-MN", label: "I currently have a greyhound from GPA-MN" },
    {
        value: "Have current from other group",
        label: "I currently have a greyhound from another group",
    },
    {
        value: "Had greyhound from GPA-MN",
        label: "I previously had a greyhound from GPA-MN",
    },
    {
        value: "Had greyhound from other group",
        label: "I previously had a greyhound from another group",
    },
    {
        value: "Adopted from multiple groups",
        label: "I have adopted from multiple groups",
    },
]

export const SMALL_ANIMAL_NEEDS_OPTIONS: FieldOption[] = [
    { value: "No", label: "No" },
    { value: "Cat Trainable", label: "Cat trainable" },
    { value: "Small Dog Friendly", label: "Small dog friendly" },
    { value: "Other Small Animal", label: "Other small animal" },
]

export const TIME_WITH_SMALL_ANIMAL_OPTIONS: FieldOption[] = [
    { value: "<10%", label: "Less than 10%" },
    { value: "10-25%", label: "10-25%" },
    { value: "25-50%", label: "25-50%" },
    { value: ">50%", label: "More than 50%" },
]

export const SENIOR_SPECIAL_NEEDS_OPTIONS: FieldOption[] = [
    { value: "Senior only", label: "Senior only" },
    { value: "Special needs only", label: "Special needs only" },
    { value: "Either", label: "Either senior or special needs" },
    { value: "Maybe", label: "Maybe, tell me more" },
    { value: "Not at this time", label: "Not at this time" },
]

export const SPECIAL_NEEDS_OPTIONS: FieldOption[] = [
    { value: "Special Diet", label: "Special diet" },
    { value: "Separation Anxiety", label: "Separation anxiety" },
    { value: "Shyness", label: "Shyness" },
    { value: "Senior (8+)", label: "Senior (8+)" },
]

export const LEASH_USAGE_OPTIONS: FieldOption[] = [
    { value: "No leash in fenced yard", label: "No leash in fenced yard" },
    { value: "Depends on the situation", label: "Depends on the situation" },
    { value: "Leash in busy areas", label: "Leash in busy areas" },
    { value: "Always on leash", label: "Always on leash" },
    { value: "Other", label: "Other" },
]

export const GENDER_PREFERENCE_OPTIONS: FieldOption[] = [
    { value: "No preference", label: "No preference" },
    { value: "Strongly prefer male", label: "Strongly prefer male" },
    { value: "Strongly prefer female", label: "Strongly prefer female" },
    { value: "Prefer male but open", label: "Prefer male but open" },
    { value: "Prefer female but open", label: "Prefer female but open" },
]

export const HOURS_ALONE_OPTIONS: FieldOption[] = [
    { value: "<1", label: "Less than 1 hour" },
    { value: "1-4", label: "1-4 hours" },
    { value: "5-7", label: "5-7 hours" },
    { value: "8-9", label: "8-9 hours" },
    { value: "10+", label: "10+ hours" },
]

export const KEEPING_LOCATION_OPTIONS: FieldOption[] = [
    { value: "Indoor", label: "Indoor" },
    { value: "Outdoor kennel", label: "Outdoor kennel" },
    { value: "Dog house", label: "Dog house" },
    { value: "Heated garage", label: "Heated garage" },
    { value: "Unheated garage", label: "Unheated garage" },
]

export const RETURN_CIRCUMSTANCES_OPTIONS: FieldOption[] = [
    { value: "Moving", label: "Moving" },
    { value: "Health issues", label: "Health issues" },
    { value: "Behavior issues", label: "Behavior issues" },
    { value: "Job loss", label: "Job loss" },
    { value: "Having children", label: "Having children" },
    { value: "Too energetic", label: "Too energetic" },
    { value: "Allergies", label: "Allergies" },
    { value: "House soiling", label: "House soiling" },
    { value: "Destruction", label: "Destruction" },
    { value: "Not an option", label: "Not an option" },
    { value: "Other", label: "Other" },
]

export const HOW_HEARD_OPTIONS: FieldOption[] = [
    { value: "Chipper", label: "Chipper" },
    { value: "Referral", label: "Referral from friend/family" },
    { value: "Yard Sign", label: "Yard sign" },
    { value: "Billboard", label: "Billboard" },
    { value: "State Fair", label: "State Fair" },
    { value: "Pet Store", label: "Pet store" },
    { value: "Event", label: "Event" },
    { value: "Petfinder", label: "Petfinder" },
    { value: "Other", label: "Other" },
]

export const NO_VET_REASON_OPTIONS: FieldOption[] = [
    { value: "Non-dog pets only", label: "I have non-dog pets only" },
    { value: "Other", label: "Other" },
]

export const DOG_BEHAVIOR_KNOWLEDGE_OPTIONS: FieldOption[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
]

// === Section configs ===

export const SECTION_CONFIGS: SectionConfig<SectionKey>[] = [
    // 1. Applicant Information
    {
        key: "applicant_info",
        title: "Applicant Information",
        description: "Primary and co-applicant contact details",
        fields: [
            { name: "firstName", label: "First Name", type: "text", required: true },
            { name: "lastName", label: "Last Name", type: "text", required: true },
            { name: "address", label: "Street Address", type: "text", required: true },
            { name: "city", label: "City", type: "text", required: true },
            { name: "state", label: "State", type: "text", required: true },
            { name: "zipCode", label: "Zip Code", type: "text", required: true },
            { name: "phone", label: "Preferred Phone Number", type: "phone", required: true },
            {
                name: "phoneType",
                label: "Phone Number Type",
                type: "radio",
                required: true,
                options: PHONE_TYPE_OPTIONS,
            },
            { name: "occupation", label: "Occupation", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            {
                name: "hasCoApplicant",
                label: "Is there a co-applicant?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            { name: "coApplicantFirstName", label: "Co-Applicant First Name", type: "text" },
            { name: "coApplicantLastName", label: "Co-Applicant Last Name", type: "text" },
            { name: "coApplicantOccupation", label: "Co-Applicant Occupation", type: "text" },
            { name: "coApplicantEmail", label: "Co-Applicant Email", type: "email" },
            { name: "coApplicantPhone", label: "Co-Applicant Phone", type: "phone" },
            {
                name: "coApplicantPhoneType",
                label: "Co-Applicant Phone Type",
                type: "radio",
                options: PHONE_TYPE_OPTIONS,
            },
            {
                name: "relationship",
                label: "Applicant/Co-Applicant Relationship",
                type: "text",
            },
        ],
    },

    // 2. Household
    {
        key: "household",
        title: "Household",
        description: "Household members and children information",
        fields: [
            {
                name: "hasOtherMembers",
                label: "Are there other household members beyond applicant/co-applicant?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "householdMembers",
                label: "Additional Household Members",
                type: "repeating",
                minEntries: 1,
                maxEntries: 6,
                subFields: [
                    { name: "name", label: "Name", type: "text", required: true },
                    { name: "age", label: "Age", type: "text", required: true },
                    { name: "relationship", label: "Relationship", type: "text", required: true },
                ],
            },
            {
                name: "hasChildren5to8",
                label: "Are there children ages 5-8 in the home?",
                type: "radio",
                required: true,
                options: YES_NO_OTHER_OPTIONS,
            },
            {
                name: "hasChildrenUnder5",
                label: "Are there children under 5 in the home?",
                type: "radio",
                required: true,
                options: YES_NO_OTHER_OPTIONS,
                helpText:
                    "Unless you already have a greyhound, GPA-MN does not adopt to families with children under 5.",
            },
            {
                name: "expectYoungChildren",
                label: "Do you expect young children (ages 3-5) in the next few years?",
                type: "radio",
                required: true,
                options: YES_NO_MAYBE_OPTIONS,
            },
            {
                name: "childInteractionCircumstances",
                label: "Describe the circumstances of potential child interaction",
                type: "textarea",
            },
        ],
    },

    // 3. Pre-Adoption Requirements
    {
        key: "pre_adoption",
        title: "Pre-Adoption Requirements",
        description: "Meet & greet attendance and required reading",
        fields: [
            {
                name: "attendedMeetAndGreet",
                label: "Have you attended a GPA-MN meet & greet?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "meetAndGreetAttended",
                label: "Which meet & greet did you attend?",
                type: "dropdown",
                options: MEET_AND_GREET_LOCATIONS,
            },
            {
                name: "meetAndGreetPlanning",
                label: "Which meet & greet are you planning to attend?",
                type: "dropdown",
                options: MEET_AND_GREET_LOCATIONS,
            },
            {
                name: "meetAndGreetDate",
                label: "When are you planning to attend?",
                type: "text",
            },
            {
                name: "completedReading",
                label: "Have you completed the general required reading?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "booksRead",
                label: "Which books have you read?",
                type: "checkbox",
                options: BOOK_OPTIONS,
            },
            {
                name: "booksToRead",
                label: "Which books do you intend to read?",
                type: "checkbox",
                options: BOOK_OPTIONS,
            },
            {
                name: "readingCompletionDate",
                label: "When do you expect to complete the reading?",
                type: "text",
            },
            {
                name: "completedChildrenReading",
                label: "Have you completed the additional children's reading?",
                type: "radio",
                options: YES_NO_OPTIONS,
            },
            {
                name: "childrenBooksRead",
                label: "Which children's books have you read?",
                type: "checkbox",
                options: CHILDREN_BOOK_OPTIONS,
            },
            {
                name: "childrenBooksToRead",
                label: "Which children's books do you intend to read?",
                type: "checkbox",
                options: CHILDREN_BOOK_OPTIONS,
            },
            {
                name: "childrenBooksToReadFuture",
                label: "Which children's books do you intend to read before children arrive?",
                type: "checkbox",
                options: CHILDREN_BOOK_OPTIONS,
            },
            {
                name: "childrenReadingDate",
                label: "When do you expect to complete the children's reading?",
                type: "text",
            },
        ],
    },

    // 4. Home
    {
        key: "home",
        title: "Home",
        description: "Home environment and living situation",
        fields: [
            {
                name: "homeType",
                label: "Home Type",
                type: "dropdown",
                required: true,
                options: HOME_TYPE_OPTIONS,
            },
            {
                name: "ownOrRent",
                label: "Do you own or rent?",
                type: "dropdown",
                required: true,
                options: OWN_RENT_OPTIONS,
            },
            {
                name: "landlordInfo",
                label: "Landlord name and contact information",
                type: "text",
            },
            {
                name: "petLimitations",
                label: "Are there pet limitations in your lease or local ordinance?",
                type: "textarea",
            },
            {
                name: "openToHomeVisit",
                label: "Are you open to a home visit?",
                type: "dropdown",
                required: true,
                options: HOME_VISIT_OPTIONS,
            },
            {
                name: "homeVisitExplanation",
                label: "Please explain your preference regarding a home visit",
                type: "text",
            },
            {
                name: "hasFencedYard",
                label: "Do you have a fully fenced yard?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "fenceTypeAndHeight",
                label: "Fence type and height",
                type: "dropdown",
                options: FENCE_TYPE_OPTIONS,
            },
            {
                name: "otherFenceDescription",
                label: "Please describe your fence",
                type: "text",
            },
            {
                name: "noFencePlan",
                label: "What is your plan for exercising and toileting the dog without a fenced yard?",
                type: "textarea",
            },
            {
                name: "activityLevel",
                label: "How would you describe your household activity level?",
                type: "dropdown",
                required: true,
                options: ACTIVITY_LEVEL_OPTIONS,
            },
            {
                name: "hasAllergies",
                label: "Does anyone in the household have asthma or allergies?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "allergyExplanation",
                label: "Please explain the allergies",
                type: "textarea",
            },
            {
                name: "apprehensiveMember",
                label: "Who in your household is most apprehensive about getting a greyhound?",
                type: "dropdown",
                required: true,
                options: APPREHENSIVE_MEMBER_OPTIONS,
            },
            {
                name: "apprehensiveExplanation",
                label: "Please explain",
                type: "textarea",
            },
        ],
    },

    // 5. Current Pets
    {
        key: "current_pets",
        title: "Current Pets",
        description: "Existing pets, previous dog ownership, and animal compatibility needs",
        fields: [
            {
                name: "hasCurrentPets",
                label: "Do you currently have pets?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "previousGreyhoundAdoption",
                label: "Have you previously adopted a greyhound?",
                type: "dropdown",
                required: true,
                options: PREVIOUS_GREYHOUND_OPTIONS,
            },
            {
                name: "otherAdoptionGroups",
                label: "Which other adoption groups have you worked with?",
                type: "text",
            },
            {
                name: "currentPets",
                label: "Current Pets",
                type: "repeating",
                minEntries: 1,
                maxEntries: 6,
                subFields: [
                    { name: "breed", label: "Breed", type: "text", required: true },
                    { name: "age", label: "Age", type: "text", required: true },
                    { name: "gender", label: "Gender", type: "text", required: true },
                ],
            },
            {
                name: "hasCat",
                label: "Do you have a cat in the home?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "smallAnimalNeeds",
                label: "Do you need a hound that is OK with small animals?",
                type: "radio",
                required: true,
                options: SMALL_ANIMAL_NEEDS_OPTIONS,
            },
            {
                name: "smallDogDescription",
                label: "Please describe your small dog",
                type: "textarea",
            },
            {
                name: "timeWithSmallAnimal",
                label: "What percentage of time will the hound be with the cat/small animal?",
                type: "radio",
                options: TIME_WITH_SMALL_ANIMAL_OPTIONS,
            },
            {
                name: "smallAnimalExplanation",
                label: "Please explain your cat/small animal trainable needs",
                type: "textarea",
            },
            {
                name: "catTrainableLimitations",
                label: "Do you understand the limitations of cat-trainable greyhounds?",
                type: "radio",
                options: YES_NO_OPTIONS,
                helpText:
                    "Cat-trainable means the dog can learn to coexist with cats, but may never be fully trustworthy unsupervised.",
            },
            {
                name: "previouslyOwnedDog",
                label: "Have you previously owned a dog?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "previousDogBreeds",
                label: "What breeds of dogs have you owned?",
                type: "text",
            },
            {
                name: "previousDogDuration",
                label: "How long was your previous dog with you?",
                type: "text",
            },
            {
                name: "previousDogReason",
                label: "Why is your previous dog no longer with you?",
                type: "textarea",
            },
            {
                name: "everReturnedDog",
                label: "Have you ever returned an adopted dog?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "returnExplanation",
                label: "Please explain the circumstances of the return",
                type: "textarea",
            },
            {
                name: "dogBehaviorKnowledge",
                label: "How would you rate your dog behavior knowledge?",
                type: "scale",
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: "Novice",
                scaleMaxLabel: "Expert",
            },
        ],
    },

    // 6. Your Greyhound
    {
        key: "your_greyhound",
        title: "Your Greyhound",
        description: "Adoption preferences, lifestyle, and matching criteria",
        fields: [
            {
                name: "adoptionTimeline",
                label: "What is your timeline for adoption?",
                type: "textarea",
                required: true,
            },
            {
                name: "whyGreyhound",
                label: "Why do you want to adopt a retired racing greyhound?",
                type: "textarea",
                required: true,
            },
            {
                name: "offLeashPlans",
                label: "Where and when do you plan to let your greyhound off-leash?",
                type: "textarea",
                required: true,
            },
            {
                name: "kennelingPlan",
                label: "What is your plan for kenneling/crating?",
                type: "textarea",
                required: true,
            },
            {
                name: "energyLevelPreference",
                label: "Do you have an energy level preference?",
                type: "textarea",
            },
            {
                name: "seniorSpecialNeeds",
                label: "Would you consider a senior or special needs greyhound?",
                type: "dropdown",
                required: true,
                options: SENIOR_SPECIAL_NEEDS_OPTIONS,
            },
            {
                name: "specialNeedsConsidering",
                label: "What special needs would you consider?",
                type: "checkbox",
                options: SPECIAL_NEEDS_OPTIONS,
            },
            {
                name: "leashUsage",
                label: "How do you plan to use a leash?",
                type: "checkbox",
                required: true,
                options: LEASH_USAGE_OPTIONS,
            },
            {
                name: "genderPreference",
                label: "Do you have a gender preference?",
                type: "dropdown",
                required: true,
                options: GENDER_PREFERENCE_OPTIONS,
            },
            {
                name: "genderPreferenceReason",
                label: "Please explain your gender preference",
                type: "textarea",
            },
            {
                name: "hoursAlone",
                label: "How many hours per day will the greyhound be alone?",
                type: "dropdown",
                required: true,
                options: HOURS_ALONE_OPTIONS,
            },
            {
                name: "hoursAlonePlan",
                label: "What is your plan for the greyhound being alone 10+ hours?",
                type: "textarea",
            },
            {
                name: "sleepingArrangement",
                label: "Where will the greyhound sleep?",
                type: "textarea",
                required: true,
            },
            {
                name: "keepingLocation",
                label: "Where will you keep your greyhound?",
                type: "checkbox",
                required: true,
                options: KEEPING_LOCATION_OPTIONS,
            },
            {
                name: "genderImportance",
                label: "How important is gender?",
                type: "scale",
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: "Not Important",
                scaleMaxLabel: "Extremely Important",
            },
            {
                name: "ageImportance",
                label: "How important is age?",
                type: "scale",
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: "Not Important",
                scaleMaxLabel: "Extremely Important",
            },
            {
                name: "energyImportance",
                label: "How important is energy level?",
                type: "scale",
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: "Not Important",
                scaleMaxLabel: "Extremely Important",
            },
            {
                name: "kenneledImportance",
                label: "How important is being OK with kenneling?",
                type: "scale",
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: "Not Important",
                scaleMaxLabel: "Extremely Important",
            },
            {
                name: "catImportance",
                label: "How important is being able to live with cats?",
                type: "scale",
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: "Not Important",
                scaleMaxLabel: "Extremely Important",
            },
            {
                name: "smallDogImportance",
                label: "How important is being able to live with small dogs?",
                type: "scale",
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: "Not Important",
                scaleMaxLabel: "Extremely Important",
            },
            {
                name: "kidsImportance",
                label: "How important is being able to live with kids 5-8?",
                type: "scale",
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: "Not Important",
                scaleMaxLabel: "Extremely Important",
            },
            {
                name: "joggingImportance",
                label: "How important is jogging partner potential?",
                type: "scale",
                required: true,
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: "Not Important",
                scaleMaxLabel: "Extremely Important",
            },
            {
                name: "otherImportance",
                label: "How important is the other consideration?",
                type: "scale",
                scaleMin: 1,
                scaleMax: 5,
                scaleMinLabel: "Not Important",
                scaleMaxLabel: "Extremely Important",
            },
            {
                name: "otherConsideration",
                label: "If there is another important consideration, please explain",
                type: "textarea",
            },
            {
                name: "returnCircumstances",
                label: "Under what circumstances would you return a greyhound?",
                type: "checkbox",
                required: true,
                options: RETURN_CIRCUMSTANCES_OPTIONS,
            },
        ],
    },

    // 7. Veterinary Reference
    {
        key: "vet_reference",
        title: "Veterinary Reference",
        description: "Veterinary clinic information and vaccination status",
        fields: [
            {
                name: "noVetReason",
                label: "If you do not have a vet, select a reason",
                type: "checkbox",
                options: NO_VET_REASON_OPTIONS,
            },
            {
                name: "vetClinic",
                label: "Veterinary Clinic & Location",
                type: "text",
            },
            {
                name: "vetName",
                label: "Veterinarian Name",
                type: "text",
            },
            {
                name: "vetPhone",
                label: "Veterinarian Phone",
                type: "phone",
            },
            {
                name: "petsCurrentOnVaccines",
                label: "Are your pets current on vaccinations and heartworm prevention?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "vaccineExplanation",
                label: "Please explain why pets are not current",
                type: "textarea",
            },
        ],
    },

    // 8. Personal References
    {
        key: "personal_references",
        title: "Personal References",
        description: "Two non-family references",
        fields: [
            {
                name: "ref1FirstName",
                label: "Reference 1 First Name",
                type: "text",
                required: true,
            },
            {
                name: "ref1LastName",
                label: "Reference 1 Last Name",
                type: "text",
                required: true,
            },
            {
                name: "ref1Phone",
                label: "Reference 1 Phone",
                type: "phone",
                required: true,
            },
            {
                name: "ref1Email",
                label: "Reference 1 Email",
                type: "email",
            },
            {
                name: "ref1YearsKnown",
                label: "Reference 1 Years Known",
                type: "number",
                required: true,
                min: 1,
                max: 100,
            },
            {
                name: "ref2FirstName",
                label: "Reference 2 First Name",
                type: "text",
                required: true,
            },
            {
                name: "ref2LastName",
                label: "Reference 2 Last Name",
                type: "text",
                required: true,
            },
            {
                name: "ref2Phone",
                label: "Reference 2 Phone",
                type: "phone",
                required: true,
            },
            {
                name: "ref2Email",
                label: "Reference 2 Email",
                type: "email",
            },
            {
                name: "ref2YearsKnown",
                label: "Reference 2 Years Known",
                type: "number",
                required: true,
                min: 1,
                max: 100,
            },
        ],
    },

    // 9. Final Questions
    {
        key: "final_questions",
        title: "Final Questions",
        description: "Vet care agreements, how you heard about us, and final comments",
        fields: [
            {
                name: "yearlyVetExams",
                label: "Do you agree to yearly vet exams?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "currentVaccinations",
                label: "Do you agree to keep the greyhound current on vaccinations?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "heartwormFleaPrevention",
                label: "Do you agree to heartworm and flea prevention?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "disagreementExplanation",
                label: "Please explain your disagreement with the above terms",
                type: "textarea",
            },
            {
                name: "howHeardAboutGPA",
                label: "How did you hear about GPA-MN?",
                type: "checkbox",
                required: true,
                options: HOW_HEARD_OPTIONS,
            },
            {
                name: "spokenToMember",
                label: "Have you spoken to a GPA-MN member or previous adopter?",
                type: "textarea",
                required: true,
            },
            {
                name: "applyingToOtherGroups",
                label: "Are you applying to other adoption groups?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "otherGroupsExplanation",
                label: "Which other groups are you applying to?",
                type: "textarea",
            },
            {
                name: "finalComments",
                label: "Any final comments or questions?",
                type: "textarea",
            },
            {
                name: "agreeToTerms",
                label: "I certify that the information provided is true and accurate, and I consent to an interview and home visit",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
        ],
    },
]

// === Conditional rules ===

export const CONDITIONAL_RULES: ConditionalRule<SectionKey>[] = [
    // applicant_info: co-applicant fields (7 rules)
    {
        targetField: "coApplicantFirstName",
        targetSection: "applicant_info",
        sourceField: "hasCoApplicant",
        sourceSection: "applicant_info",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "coApplicantLastName",
        targetSection: "applicant_info",
        sourceField: "hasCoApplicant",
        sourceSection: "applicant_info",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "coApplicantOccupation",
        targetSection: "applicant_info",
        sourceField: "hasCoApplicant",
        sourceSection: "applicant_info",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "coApplicantEmail",
        targetSection: "applicant_info",
        sourceField: "hasCoApplicant",
        sourceSection: "applicant_info",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "coApplicantPhone",
        targetSection: "applicant_info",
        sourceField: "hasCoApplicant",
        sourceSection: "applicant_info",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "coApplicantPhoneType",
        targetSection: "applicant_info",
        sourceField: "hasCoApplicant",
        sourceSection: "applicant_info",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "relationship",
        targetSection: "applicant_info",
        sourceField: "hasCoApplicant",
        sourceSection: "applicant_info",
        condition: "equals",
        value: "Yes",
    },

    // household (2 rules)
    {
        targetField: "householdMembers",
        targetSection: "household",
        sourceField: "hasOtherMembers",
        sourceSection: "household",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "childInteractionCircumstances",
        targetSection: "household",
        sourceField: "expectYoungChildren",
        sourceSection: "household",
        condition: "notEquals",
        value: "No",
    },

    // pre_adoption (11 rules, 3 cross-section)
    {
        targetField: "meetAndGreetAttended",
        targetSection: "pre_adoption",
        sourceField: "attendedMeetAndGreet",
        sourceSection: "pre_adoption",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "meetAndGreetPlanning",
        targetSection: "pre_adoption",
        sourceField: "attendedMeetAndGreet",
        sourceSection: "pre_adoption",
        condition: "equals",
        value: "No",
    },
    {
        targetField: "meetAndGreetDate",
        targetSection: "pre_adoption",
        sourceField: "attendedMeetAndGreet",
        sourceSection: "pre_adoption",
        condition: "equals",
        value: "No",
    },
    {
        targetField: "booksRead",
        targetSection: "pre_adoption",
        sourceField: "completedReading",
        sourceSection: "pre_adoption",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "booksToRead",
        targetSection: "pre_adoption",
        sourceField: "completedReading",
        sourceSection: "pre_adoption",
        condition: "equals",
        value: "No",
    },
    {
        targetField: "readingCompletionDate",
        targetSection: "pre_adoption",
        sourceField: "completedReading",
        sourceSection: "pre_adoption",
        condition: "equals",
        value: "No",
    },
    // Cross-section: depends on household.hasChildren5to8
    {
        targetField: "completedChildrenReading",
        targetSection: "pre_adoption",
        sourceField: "hasChildren5to8",
        sourceSection: "household",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "childrenBooksRead",
        targetSection: "pre_adoption",
        sourceField: "completedChildrenReading",
        sourceSection: "pre_adoption",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "childrenBooksToRead",
        targetSection: "pre_adoption",
        sourceField: "completedChildrenReading",
        sourceSection: "pre_adoption",
        condition: "equals",
        value: "No",
    },
    // Cross-section: depends on household.expectYoungChildren
    {
        targetField: "childrenBooksToReadFuture",
        targetSection: "pre_adoption",
        sourceField: "expectYoungChildren",
        sourceSection: "household",
        condition: "notEquals",
        value: "No",
    },
    {
        targetField: "childrenReadingDate",
        targetSection: "pre_adoption",
        sourceField: "completedChildrenReading",
        sourceSection: "pre_adoption",
        condition: "equals",
        value: "No",
    },

    // home (8 rules)
    {
        targetField: "landlordInfo",
        targetSection: "home",
        sourceField: "ownOrRent",
        sourceSection: "home",
        condition: "equals",
        value: "Rent",
    },
    {
        targetField: "petLimitations",
        targetSection: "home",
        sourceField: "ownOrRent",
        sourceSection: "home",
        condition: "equals",
        value: "Rent",
    },
    {
        targetField: "homeVisitExplanation",
        targetSection: "home",
        sourceField: "openToHomeVisit",
        sourceSection: "home",
        condition: "equals",
        value: "No",
    },
    {
        targetField: "fenceTypeAndHeight",
        targetSection: "home",
        sourceField: "hasFencedYard",
        sourceSection: "home",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "otherFenceDescription",
        targetSection: "home",
        sourceField: "fenceTypeAndHeight",
        sourceSection: "home",
        condition: "includes",
        value: "Other",
    },
    {
        targetField: "noFencePlan",
        targetSection: "home",
        sourceField: "hasFencedYard",
        sourceSection: "home",
        condition: "equals",
        value: "No",
    },
    {
        targetField: "allergyExplanation",
        targetSection: "home",
        sourceField: "hasAllergies",
        sourceSection: "home",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "apprehensiveExplanation",
        targetSection: "home",
        sourceField: "apprehensiveMember",
        sourceSection: "home",
        condition: "equals",
        value: "Other",
    },

    // current_pets (10 rules)
    {
        targetField: "otherAdoptionGroups",
        targetSection: "current_pets",
        sourceField: "previousGreyhoundAdoption",
        sourceSection: "current_pets",
        condition: "includes",
        value: "other",
    },
    {
        targetField: "currentPets",
        targetSection: "current_pets",
        sourceField: "hasCurrentPets",
        sourceSection: "current_pets",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "smallDogDescription",
        targetSection: "current_pets",
        sourceField: "smallAnimalNeeds",
        sourceSection: "current_pets",
        condition: "equals",
        value: "Small Dog Friendly",
    },
    {
        targetField: "timeWithSmallAnimal",
        targetSection: "current_pets",
        sourceField: "smallAnimalNeeds",
        sourceSection: "current_pets",
        condition: "notEquals",
        value: "No",
    },
    {
        targetField: "smallAnimalExplanation",
        targetSection: "current_pets",
        sourceField: "smallAnimalNeeds",
        sourceSection: "current_pets",
        condition: "notEquals",
        value: "No",
    },
    // catTrainableLimitations: visible when time with small animal is low (OR'd)
    {
        targetField: "catTrainableLimitations",
        targetSection: "current_pets",
        sourceField: "timeWithSmallAnimal",
        sourceSection: "current_pets",
        condition: "equals",
        value: "<10%",
    },
    {
        targetField: "catTrainableLimitations",
        targetSection: "current_pets",
        sourceField: "timeWithSmallAnimal",
        sourceSection: "current_pets",
        condition: "equals",
        value: "10-25%",
    },
    {
        targetField: "previousDogBreeds",
        targetSection: "current_pets",
        sourceField: "previouslyOwnedDog",
        sourceSection: "current_pets",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "previousDogDuration",
        targetSection: "current_pets",
        sourceField: "previouslyOwnedDog",
        sourceSection: "current_pets",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "previousDogReason",
        targetSection: "current_pets",
        sourceField: "previouslyOwnedDog",
        sourceSection: "current_pets",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "returnExplanation",
        targetSection: "current_pets",
        sourceField: "everReturnedDog",
        sourceSection: "current_pets",
        condition: "equals",
        value: "Yes",
    },

    // your_greyhound (3 rules)
    {
        targetField: "specialNeedsConsidering",
        targetSection: "your_greyhound",
        sourceField: "seniorSpecialNeeds",
        sourceSection: "your_greyhound",
        condition: "notEquals",
        value: "Not at this time",
    },
    {
        targetField: "genderPreferenceReason",
        targetSection: "your_greyhound",
        sourceField: "genderPreference",
        sourceSection: "your_greyhound",
        condition: "notEquals",
        value: "No preference",
    },
    {
        targetField: "hoursAlonePlan",
        targetSection: "your_greyhound",
        sourceField: "hoursAlone",
        sourceSection: "your_greyhound",
        condition: "equals",
        value: "10+",
    },

    // vet_reference (1 rule)
    {
        targetField: "vaccineExplanation",
        targetSection: "vet_reference",
        sourceField: "petsCurrentOnVaccines",
        sourceSection: "vet_reference",
        condition: "equals",
        value: "No",
    },

    // final_questions (4 rules — disagreementExplanation OR'd across 3 sources)
    {
        targetField: "disagreementExplanation",
        targetSection: "final_questions",
        sourceField: "yearlyVetExams",
        sourceSection: "final_questions",
        condition: "equals",
        value: "No",
    },
    {
        targetField: "disagreementExplanation",
        targetSection: "final_questions",
        sourceField: "currentVaccinations",
        sourceSection: "final_questions",
        condition: "equals",
        value: "No",
    },
    {
        targetField: "disagreementExplanation",
        targetSection: "final_questions",
        sourceField: "heartwormFleaPrevention",
        sourceSection: "final_questions",
        condition: "equals",
        value: "No",
    },
    {
        targetField: "otherGroupsExplanation",
        targetSection: "final_questions",
        sourceField: "applyingToOtherGroups",
        sourceSection: "final_questions",
        condition: "equals",
        value: "Yes",
    },
]

// === Derived lookup ===

export const SECTION_CONFIG_MAP: Record<SectionKey, SectionConfig<SectionKey>> = Object.fromEntries(
    SECTION_CONFIGS.map((config) => [config.key, config]),
) as Record<SectionKey, SectionConfig<SectionKey>>
