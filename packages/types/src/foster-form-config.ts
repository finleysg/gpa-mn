import type { FosterSectionKey } from "@repo/database"
import type { ConditionalRule, FieldDef, FieldOption, SectionConfig } from "./applications"
import {
    ACTIVITY_LEVEL_OPTIONS,
    APPREHENSIVE_MEMBER_OPTIONS,
    FENCE_TYPE_OPTIONS,
    GENDER_PREFERENCE_OPTIONS,
    HOME_TYPE_OPTIONS,
    HOME_VISIT_OPTIONS,
    HOURS_ALONE_OPTIONS,
    HOW_HEARD_OPTIONS,
    OWN_RENT_OPTIONS,
    PHONE_TYPE_OPTIONS,
    PREVIOUS_GREYHOUND_OPTIONS,
    RETURN_CIRCUMSTANCES_OPTIONS,
    SENIOR_SPECIAL_NEEDS_OPTIONS,
    YES_NO_OPTIONS,
    YES_NO_MAYBE_OPTIONS,
    YES_NO_OTHER_OPTIONS,
} from "./application-form-config"

const FOSTER_BOOK_OPTIONS: FieldOption[] = [
    {
        value: "Retired Racing Greyhounds for Dummies",
        label: "Retired Racing Greyhounds for Dummies",
    },
    { value: "Adopting the Racing Greyhound", label: "Adopting the Racing Greyhound" },
    { value: "Already own a greyhound", label: "I already own a greyhound" },
]

const MEET_AND_GREET_LOCATIONS: FieldOption[] = [
    { value: "Burnsville PetSmart", label: "Burnsville PetSmart" },
    { value: "Eden Prairie PetSmart", label: "Eden Prairie PetSmart" },
    { value: "Woodbury PetSmart", label: "Woodbury PetSmart" },
    { value: "Blaine PetSmart", label: "Blaine PetSmart" },
    { value: "Minnetonka PetSmart", label: "Minnetonka PetSmart" },
    { value: "Rochester PetSmart", label: "Rochester PetSmart" },
    { value: "Other Event", label: "Other Event" },
]

// === Foster agreement statements (verbatim from JotForm 31265705093149) ===
// Keys match FosterAgreementsData; each statement is rendered as a required
// YES/NO radio.
const FOSTER_AGREEMENT_STATEMENTS: Array<{ name: string; label: string }> = [
    {
        name: "agreeMissionRacingFriendly",
        label: "I AGREE that as a volunteer foster for GPAMN I am willing to uphold the GPA MN Mission and the racing friendly position while representing the organization.",
    },
    {
        name: "agreeGpamnProperty",
        label: "I AGREE that the foster greyhound is the property of GPAMN and will be kept solely and exclusively as a pet and will not be used for racing, breeding, or any form of medical research.",
    },
    {
        name: "agreeCooperateWithReps",
        label: "I AGREE to cooperate with GPAMN representatives for scheduling adoption showings, scheduling veterinary care, adhering to recommended medical care, social interaction recommendations, and any other requests and circumstances that require my reasonable participation.",
    },
    {
        name: "agreeNotifyOnProblems",
        label: "I AGREE that if problems develop which would prevent me from keeping my foster greyhound, the GPAMN Foster Coordinator will be contacted immediately so they can take the foster greyhound back, and that the foster greyhound will not be given, sold or transferred to any individual, animal shelter, pound, humane group, or laboratory.",
    },
    {
        name: "agreeGpamnMatches",
        label: "I AGREE that GPAMN will match the foster greyhound with a home and I will not imply availability of the foster greyhound to anyone else.",
    },
    {
        name: "agreeIndoorOnly",
        label: "I AGREE to keep the foster greyhound as an indoor pet only and will never house the foster greyhound in an outdoor kennel, outdoor dog house or garage.",
    },
    {
        name: "agreeSpayNeuterVetCare",
        label: "I AGREE that the foster greyhound will be spayed/neutered, receive all other necessary veterinarian procedures, be fed a healthy diet, and receive overall good general care in order to prepare the greyhound for adoption.",
    },
    {
        name: "agreeAcclimateAndUpdate",
        label: "I AGREE that as a foster family, we will do our best to acclimate the foster greyhound to its new home environment, and will provide regular, honest updates to the foster coordinator on the dogs progress and personality.",
    },
    {
        name: "agreeNeverStakedOrTied",
        label: "I AGREE that the foster greyhound will never be staked, tied out, tied to a zip-line or bound to any stationary object.",
    },
    {
        name: "agreeNoOpenBedTransport",
        label: "I AGREE that my foster greyhound will never be transported in the open bed of any vehicle.",
    },
    {
        name: "agreeHandheldLeashOnly",
        label: "I AGREE that my foster greyhound will be kept on a hand-held leash, will never be kept on a retractable leash or flexi-lead, and will only be allowed to run loose in a totally fenced in area.",
    },
    {
        name: "agreeLeashedBathroomBreaks",
        label: "I AGREE that regardless of temperature or time of day or night, when there is no fenced in area I will take my foster greyhound out to perform its bathroom duties on a hand-held leash.",
    },
    {
        name: "agreeCheckFenceBeforeRelease",
        label: "I AGREE that before turning my foster greyhound out into a fenced in area to run, I will first check the gates and fence to ensure they are securely closed.",
    },
    {
        name: "agreeCollarWithId",
        label: "I AGREE that at all times my foster greyhound will wear a collar bearing identification.",
    },
    {
        name: "understandDogBehaviorRisks",
        label: "I UNDERSTAND and have been advised that foster dogs can sometimes dig, chew, soil, and exhibit other undesirable traits. I understand that dogs are dogs and will do things that cannot be foreseen on occasion.",
    },
    {
        name: "understandInjuryRisk",
        label: "I UNDERSTAND that dogs are animals and may cause bodily injury to myself or my family members. I will not hold GPAMN responsible for any injury to myself or family members that arises from the foster relationship.",
    },
    {
        name: "agreeSupervisedInteractions",
        label: "I AGREE that interactions between the foster greyhound and my child(ren), other dogs, and cats must be carefully supervised. I agree that I will never leave my child alone and unsupervised with the foster greyhound, and will carefully introduce the foster greyhound to any other dogs or cats, including use of the provided muzzle",
    },
    {
        name: "agreeNotifyOnEscape",
        label: "I AGREE that I will notify the GPAMN Foster Coordinator immediately if my foster greyhound escapes, is lost, or is stolen.",
    },
    {
        name: "agreeAdoptionProcessApplies",
        label: "I AGREE that if I am interested in adopting my foster greyhound, I must immediately make my intentions known to the Foster Coordinator AND Adoption Coordinator before adoption showings have been scheduled for the dog, and anyone interested in adopting must go through the normal GPAMN adoption application and approval process. I understand that I may not be able to adopt the first greyhound I foster. I further understand that, until the adoption fee has been paid, the dog remains the sole property of GPAMN and will need to be shown to other potential adopters.",
    },
    {
        name: "agreeMedicalReimbursementCap",
        label: "I AGREE that requests for reimbursement of medical costs because of a injury to a person's existing animal caused by the foster greyhound will be on a case-by-case basis, based on board discretion, with maximum reimbursement of $500.",
    },
    {
        name: "agreeInjuryVetProtocol",
        label: "I AGREE if the foster greyhound is injured, the greyhound will need to be brought into an authorized GPAMN veterinarian for treatment, and that if the injury occurs \u201cafter hours\u201d the Vetting Coordinator or, in the event they are not available, the Foster Coordinator, President, Treasurer, or Adoption Coordinator, will be contacted for notification and approval",
    },
    {
        name: "agreeConditionsAndRepossession",
        label: "I AGREE that my participation in the GPAMN foster program is subject to all of the above conditions and that if they are broken in any way, GPAMN will be fully authorized to repossess the foster greyhound and, if immediate repossession is not possible, or if I refuse to cooperate, I will be liable for all legal costs and expenses accrued in the repossession of the foster greyhound.",
    },
    {
        name: "understandInsuranceScope",
        label: "I UNDERSTAND that it is my responsibility to check with my insurance agent or the underwriter of my homeowners insurance policy regarding coverage for dogs within my home, and that the insurance held by GPAMN does not include coverage for occurrences/claims within the confines of foster homes or on the property of a foster home. The insurance coverage held by GPAMN extends to events and situations off the foster property.",
    },
    {
        name: "agreeHoldHarmless",
        label: "I AGREE as the foster family, to hold harmless and release GPAMN and/or its members, volunteers and other individuals working for and/or assisting with rescue from all liability, claims, and/or causes of action arising from any acts, injury and/or occurrences engaged in and/or caused by the dog subject to this agreement, as well as indemnification for damages, court costs, and/or attorney's fees incurred by GPAMN and/or its members for any court proceedings relating to such matters.",
    },
    {
        name: "understandDisagreementDisqualifies",
        label: "I UNDERSTAND that if I have answered one or more of the above questions with \u201cI Do Not Agree\u201d then I will not be eligible to be a foster home for GPAMN.",
    },
]

const agreementFields: FieldDef[] = FOSTER_AGREEMENT_STATEMENTS.map((s) => ({
    name: s.name,
    label: s.label,
    type: "radio",
    required: true,
    options: YES_NO_OPTIONS,
}))

export const FOSTER_SECTION_CONFIGS: SectionConfig<FosterSectionKey>[] = [
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
                    "Unless you already have a greyhound, GPA-MN does not place foster greyhounds with families that have children under 5.",
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

    // 3. Pre-Fostering Requirements
    {
        key: "pre_foster",
        title: "Pre-Fostering Requirements",
        description: "Required reading and meet & greet attendance",
        fields: [
            {
                name: "bookRead",
                label: "Which book have you read to prepare?",
                type: "dropdown",
                required: true,
                options: FOSTER_BOOK_OPTIONS,
            },
            {
                name: "completedChildrenReading",
                label: "If there are children in the home, have you completed the additional children's reading?",
                type: "radio",
                options: YES_NO_OPTIONS,
            },
            {
                name: "meetAndGreetAttended",
                label: "Which Meet & Greet or special event did you attend?",
                type: "dropdown",
                required: true,
                options: MEET_AND_GREET_LOCATIONS,
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
                label: "Are you open to a home visit by a GPA-MN representative?",
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
                label: "Without a fenced yard, what is your plan for walking the dog 3-5 times per day?",
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
                label: "Who in your household is most apprehensive about fostering a greyhound?",
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
        description: "Existing pets and previous dog ownership",
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
                name: "timeWithSmallAnimal",
                label: "Will the foster spend time with cats or small animals?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "willingToMuzzle",
                label: "Are you willing to use a provided muzzle around cats or small animals?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "previouslyOwnedDog",
                label: "Have you previously owned a dog other than your current pets?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "previousDogBreeds",
                label: "What breed(s) of dog did you previously own?",
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

    // 6. Foster Preferences
    {
        key: "foster_preferences",
        title: "Your Foster Greyhound",
        description: "Preferences, lifestyle, and foster-specific commitments",
        fields: [
            {
                name: "whyFoster",
                label: "Why do you want to foster a retired racing greyhound?",
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
                name: "genderPreference",
                label: "Do you have a gender preference?",
                type: "dropdown",
                required: true,
                options: GENDER_PREFERENCE_OPTIONS,
            },
            {
                name: "hoursAlone",
                label: "How many hours per day will the foster be alone?",
                type: "dropdown",
                required: true,
                options: HOURS_ALONE_OPTIONS,
            },
            {
                name: "hoursAlonePlan",
                label: "What is your plan for the foster being alone 10+ hours?",
                type: "textarea",
            },
            {
                name: "sleepingArrangement",
                label: "Where will the foster sleep at night?",
                type: "textarea",
                required: true,
            },
            {
                name: "specialMatchingConsiderations",
                label: "Any special matching considerations?",
                type: "textarea",
            },
            {
                name: "alsoInterestedInAdopting",
                label: "Are you also interested in adopting a retired racer?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "agreeVetTransport",
                label: "Do you agree to schedule and transport the foster to a GPA-MN contracted vet?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "agreeWorkWithReps",
                label: "Do you agree to work with adoption reps and the Foster Coordinator on showings?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "repCooperationExplanation",
                label: "Please explain",
                type: "textarea",
            },
            {
                name: "seniorSpecialNeeds",
                label: "Would you consider fostering a senior (9+) or special needs greyhound?",
                type: "dropdown",
                required: true,
                options: SENIOR_SPECIAL_NEEDS_OPTIONS,
            },
            {
                name: "returnCircumstances",
                label: "Under what circumstances would you return a foster?",
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
        description: "Veterinary clinic and vaccination status",
        fields: [
            { name: "vetClinic", label: "Veterinary Clinic & Location", type: "text" },
            { name: "vetName", label: "Veterinarian Name", type: "text" },
            { name: "vetPhone", label: "Veterinarian Phone", type: "phone" },
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
        description: "Two non-family references familiar with your ability to care for a dog",
        fields: [
            {
                name: "ref1FirstName",
                label: "Reference 1 First Name",
                type: "text",
                required: true,
            },
            { name: "ref1LastName", label: "Reference 1 Last Name", type: "text", required: true },
            { name: "ref1Phone", label: "Reference 1 Phone", type: "phone", required: true },
            { name: "ref1Email", label: "Reference 1 Email", type: "email" },
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
            { name: "ref2LastName", label: "Reference 2 Last Name", type: "text", required: true },
            { name: "ref2Phone", label: "Reference 2 Phone", type: "phone", required: true },
            { name: "ref2Email", label: "Reference 2 Email", type: "email" },
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

    // 9. Foster Agreements
    {
        key: "foster_agreements",
        title: "Foster Agreements",
        description:
            "Please read each statement carefully. Answering \u201cNo\u201d to any statement will disqualify your application.",
        fields: agreementFields,
    },

    // 10. Final Questions
    {
        key: "final_questions",
        title: "A Couple of Final Questions",
        description: "Referral, signature, and final comments",
        fields: [
            {
                name: "howHeardAboutGPA",
                label: "How did you hear about fostering for GPA-MN?",
                type: "checkbox",
                required: true,
                options: HOW_HEARD_OPTIONS,
            },
            {
                name: "fosteredOtherGroups",
                label: "Have you fostered with other adoption groups?",
                type: "radio",
                required: true,
                options: YES_NO_OPTIONS,
            },
            {
                name: "otherGroupsExplanation",
                label: "Which other groups have you fostered with?",
                type: "textarea",
            },
            {
                name: "finalComments",
                label: "Any final comments or questions?",
                type: "textarea",
            },
            {
                name: "applicantSignature",
                label: "Applicant Signature (type your full name)",
                type: "text",
                required: true,
                helpText:
                    "By typing your name, you are providing an electronic signature with the same legal weight as a handwritten signature.",
            },
            {
                name: "coApplicantSignature",
                label: "Co-Applicant Signature (type your full name)",
                type: "text",
            },
            {
                name: "signedOn",
                label: "Date",
                type: "text",
                required: true,
                placeholder: "MM/DD/YYYY",
            },
        ],
    },
]

export const FOSTER_CONDITIONAL_RULES: ConditionalRule<FosterSectionKey>[] = [
    // applicant_info: co-applicant visibility
    ...[
        "coApplicantFirstName",
        "coApplicantLastName",
        "coApplicantOccupation",
        "coApplicantEmail",
        "coApplicantPhone",
        "coApplicantPhoneType",
        "relationship",
    ].map(
        (field) =>
            ({
                targetField: field,
                targetSection: "applicant_info",
                sourceField: "hasCoApplicant",
                sourceSection: "applicant_info",
                condition: "equals",
                value: "Yes",
            }) satisfies ConditionalRule<FosterSectionKey>,
    ),

    // household
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

    // pre_foster: children's reading only when there are children 5-8
    {
        targetField: "completedChildrenReading",
        targetSection: "pre_foster",
        sourceField: "hasChildren5to8",
        sourceSection: "household",
        condition: "equals",
        value: "Yes",
    },

    // home
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

    // current_pets
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

    // foster_preferences
    {
        targetField: "hoursAlonePlan",
        targetSection: "foster_preferences",
        sourceField: "hoursAlone",
        sourceSection: "foster_preferences",
        condition: "equals",
        value: "10+",
    },
    {
        targetField: "repCooperationExplanation",
        targetSection: "foster_preferences",
        sourceField: "agreeWorkWithReps",
        sourceSection: "foster_preferences",
        condition: "equals",
        value: "No",
    },

    // vet_reference
    {
        targetField: "vaccineExplanation",
        targetSection: "vet_reference",
        sourceField: "petsCurrentOnVaccines",
        sourceSection: "vet_reference",
        condition: "equals",
        value: "No",
    },

    // final_questions
    {
        targetField: "otherGroupsExplanation",
        targetSection: "final_questions",
        sourceField: "fosteredOtherGroups",
        sourceSection: "final_questions",
        condition: "equals",
        value: "Yes",
    },
    {
        targetField: "coApplicantSignature",
        targetSection: "final_questions",
        sourceField: "hasCoApplicant",
        sourceSection: "applicant_info",
        condition: "equals",
        value: "Yes",
    },
]

export const FOSTER_SECTION_CONFIG_MAP: Record<
    FosterSectionKey,
    SectionConfig<FosterSectionKey>
> = Object.fromEntries(FOSTER_SECTION_CONFIGS.map((config) => [config.key, config])) as Record<
    FosterSectionKey,
    SectionConfig<FosterSectionKey>
>
