import "dotenv/config"
import { sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/mysql2"
import { events } from "./schema/events"
import { contentItems, contentVersions } from "./schema/content"

type ContentType = (typeof contentItems.$inferSelect)["contentType"]

const db = drizzle(process.env.DATABASE_URL!)

const eventsData = [
    {
        title: "Greyfest 2026",
        startDate: "2026-09-12",
        recurrence: "once" as const,
        time: "10:00 AM – 4:00 PM",
        location: "Elm Creek Park Reserve, Maple Grove, MN",
        type: "Annual" as const,
        description:
            "Our biggest event of the year! Join greyhound lovers for a day of fun, food, vendors, contests, and hound parades.",
        longDescription:
            "Greyfest is GPA‑MN's signature annual event, bringing together hundreds of greyhound families and fans for a full day of celebration. Enjoy vendor booths, a silent auction, hound costume contests, a blessing of the hounds, memorial walk, and plenty of greyhound socializing. Whether you're a longtime adopter or simply curious about the breed, Greyfest is the place to be. Food trucks, raffle prizes, and greyhound merchandise round out this beloved tradition. All proceeds support GPA‑MN's adoption mission.",
    },
    {
        title: "Race to Raise 5K",
        startDate: "2026-06-20",
        recurrence: "once" as const,
        time: "8:00 AM – 11:00 AM",
        location: "Lake Harriet, Minneapolis, MN",
        type: "Fundraiser" as const,
        description:
            "A fun run and walk fundraiser where humans and hounds race together to support greyhound adoption efforts.",
        longDescription:
            "Lace up your running shoes and bring your hound for GPA‑MN's annual Race to Raise 5K! This family-friendly event welcomes runners, walkers, and greyhounds of all speeds. The scenic course loops around beautiful Lake Harriet. Registration includes a commemorative t-shirt, goodie bag, and post-race refreshments. Awards are given for top finishers and best greyhound costume. All proceeds go directly to funding veterinary care, transportation, and foster support for retired racing greyhounds.",
    },
    {
        title: "Meet & Greet at Chuck & Don's",
        startDate: "2026-03-22",
        recurrence: "monthly_by_date" as const,
        time: "11:00 AM – 2:00 PM",
        location: "Chuck & Don's, Woodbury, MN",
        type: "Monthly" as const,
        description:
            "Come meet adoptable greyhounds in person! Chat with experienced owners and learn about the breed.",
        longDescription:
            "Our monthly Meet & Greets are the perfect opportunity to meet greyhounds up close and personal. Adoptable greyhounds will be on hand along with experienced GPA‑MN volunteers and adopters who can answer all your questions about the breed. Learn about their gentle temperament, exercise needs, and what makes greyhounds such wonderful pets. No appointment necessary — just stop by! These events are held at pet-friendly retail locations across the Twin Cities metro area.",
    },
    {
        title: "Sunday Como Walk",
        startDate: "2026-03-22",
        recurrence: "weekly" as const,
        time: "10:00 AM",
        location: "Como Park, Saint Paul, MN",
        type: "Weekly" as const,
        description:
            "Join fellow greyhound families for a relaxed Sunday stroll through beautiful Como Park.",
        longDescription:
            "Every Sunday morning, greyhound families gather at Como Park for a leisurely group walk. It's a wonderful way to socialize your greyhound, meet other adopters, and enjoy the beautiful surroundings of Como Park. The walk is casual and self-paced — perfect for greyhounds of all energy levels. New adopters especially are encouraged to join as it's a great way to connect with the GPA‑MN community and get tips from experienced greyhound owners. Meet at the main parking lot near the Pavilion.",
    },
    {
        title: "Spring Plant Sale",
        startDate: "2026-05-16",
        recurrence: "once" as const,
        time: "9:00 AM – 1:00 PM",
        location: "Bachman's, Minneapolis, MN",
        type: "Seasonal" as const,
        description:
            "Shop beautiful plants while supporting greyhound adoption. A beloved spring tradition!",
        longDescription:
            "GPA‑MN's annual Spring Plant Sale is a beloved tradition that combines two great things: beautiful plants and greyhound adoption! Browse a curated selection of annuals, perennials, herbs, and hanging baskets. All proceeds support GPA‑MN's mission. Adoptable greyhounds will be on hand, and volunteers will be available to answer questions about the organization and the adoption process. It's a wonderful way to welcome spring while making a difference for retired racing greyhounds.",
    },
    {
        title: "Twin Cities Pride Festival",
        startDate: "2026-06-27",
        endDate: "2026-06-28",
        recurrence: "once" as const,
        time: "10:00 AM – 6:00 PM",
        location: "Loring Park, Minneapolis, MN",
        type: "Annual" as const,
        description:
            "Visit the GPA‑MN booth at Twin Cities Pride! Meet greyhounds, grab merch, and celebrate with us.",
        longDescription:
            "GPA‑MN is proud to participate in the Twin Cities Pride Festival at Loring Park! Stop by our booth to meet adoptable greyhounds, chat with volunteers, and pick up greyhound-themed merchandise. Our greyhound ambassadors are always a crowd favorite, drawing hundreds of visitors who fall in love with the breed. Pride is a wonderful celebration of community, and we're honored to be part of it. All merchandise proceeds support GPA‑MN's adoption mission.",
    },
]

interface ContentSeedItem {
    contentType: ContentType
    slug: string
    sortOrder: number
    data: Record<string, unknown>
}

const contentData: ContentSeedItem[] = [
    // Section headers
    ...[
        {
            slug: "home-adopt",
            sortOrder: 0,
            data: {
                title: "Meet Our Available Greyhounds",
                description:
                    "Each of these gentle souls is looking for their forever home. Could it be yours?",
                location: "Homepage — Available Greyhounds",
            },
        },
        {
            slug: "home-events",
            sortOrder: 1,
            data: {
                title: "Come Meet the Hounds",
                description:
                    "From our signature fundraiser to casual weekend walks, there are plenty of ways to connect with our community and the greyhounds.",
                location: "Homepage — Events",
            },
        },
        {
            slug: "home-volunteer",
            sortOrder: 2,
            data: {
                title: "Join Our Pack",
                description:
                    "GPA‑MN is powered entirely by volunteers like you. Whether you have a few hours a month or want to be deeply involved, there is a role for you.",
                location: "Homepage — Volunteer",
            },
        },
        {
            slug: "adopt-why",
            sortOrder: 2,
            data: {
                title: "The Perfect Family Companion",
                description:
                    "Retired racing greyhounds adapt beautifully to home life. Here's what makes them such special pets.",
                location: "Adopt — Why Greyhounds?",
            },
        },
        {
            slug: "adopt-get-started",
            sortOrder: 3,
            data: {
                title: "Ready to Adopt?",
                location: "Adopt — Get Started",
            },
        },
        {
            slug: "about-explore",
            sortOrder: 4,
            data: {
                title: "Explore Our Story",
                location: "About — Learn More",
            },
        },
        {
            slug: "volunteer-fostering",
            sortOrder: 5,
            data: {
                title: "The Lifeblood of GPA‑MN",
                description:
                    "We foster every dog rather than kennel them. Foster families provide a safe, loving environment where greyhounds learn about home life — stairs, glass doors, couches, and the simple joy of being a pet.\n\n- GPA‑MN covers all food, supplies, and veterinary costs\n- Complete a hound profile within 2 weeks describing behavior and personality\n- Bring foster dogs to meet potential adopters\n- Our experienced volunteers guide you every step of the way",
                location: "Volunteer — Fostering",
            },
        },
        {
            slug: "volunteer-roles",
            sortOrder: 6,
            data: {
                title: "Find Your Role",
                description:
                    "There are many ways to get involved with GPA‑MN. Find the volunteer opportunity that fits your skills and schedule.",
                location: "Volunteer — Roles",
            },
        },
        {
            slug: "donate-ways",
            sortOrder: 7,
            data: {
                title: "Choose How to Help",
                description:
                    "There are many ways to support GPA‑MN's mission. Every contribution makes a difference in the lives of retired racing greyhounds.",
                location: "Donate — Ways to Give",
            },
        },
        {
            slug: "events-calendar",
            sortOrder: 8,
            data: { title: "Event Calendar", location: "Events — Calendar" },
        },
        {
            slug: "lost-hound-act",
            sortOrder: 9,
            data: {
                title: "What to Do Immediately",
                location: "Lost Hound — Act Now",
            },
        },
        {
            slug: "lost-hound-prevention",
            sortOrder: 16,
            data: {
                title: "Keep Your Hound Safe",
                description:
                    "The best way to handle a lost greyhound is to prevent it from happening. These tips will help keep your hound safe.",
                location: "Lost Hound — Prevention",
            },
        },
        {
            slug: "adopt-process-steps",
            sortOrder: 10,
            data: {
                title: "From Application to Adoption Day",
                location: "Adopt / Our Process — Steps",
            },
        },
        {
            slug: "adopt-process-before",
            sortOrder: 11,
            data: {
                title: "Before You Apply",
                location: "Adopt / Our Process — Before You Apply",
            },
        },
        {
            slug: "adopt-support-resources",
            sortOrder: 12,
            data: {
                title: "Everything You Need",
                description:
                    "These resources will help you and your greyhound adjust to life together. Don't hesitate to reach out to the GPA‑MN community with questions.",
                location: "Adopt / Support — Resources",
            },
        },
        {
            slug: "about-history-timeline",
            sortOrder: 13,
            data: {
                title: "Key Milestones",
                location: "About / History — Timeline",
            },
        },
        {
            slug: "contact-message",
            sortOrder: 14,
            data: {
                title: "Drop Us a Line",
                location: "About / Contact — Message Form",
            },
        },
        {
            slug: "contact-info",
            sortOrder: 15,
            data: {
                title: "Other Ways to Reach Us",
                location: "About / Contact — Contact Info",
            },
        },
    ].map((item) => ({ ...item, contentType: "sectionHeader" as const })),

    // Page headers
    ...[
        {
            slug: "adopt-process",
            sortOrder: 0,
            data: {
                title: "Our Adoption Process",
                highlight: "Adoption Process",
                description:
                    "Our primary obligation is to the dogs entrusted to our care. We've developed a thorough process over 30+ years to ensure successful, life-long adoptions.",
                location: "Adopt / Our Process",
            },
        },
        {
            slug: "about-history",
            sortOrder: 1,
            data: {
                title: "35+ Years of Saving Lives",
                highlight: "Saving Lives",
                description:
                    "From a small group of greyhound enthusiasts to one of Minnesota's most respected adoption organizations, here's our journey.",
                location: "About / History",
            },
        },
        {
            slug: "about-contact",
            sortOrder: 2,
            data: {
                title: "Contact Us",
                highlight: "Contact",
                description:
                    "Have questions about adoption, volunteering, or our organization? We'd love to hear from you.",
                location: "About / Contact",
            },
        },
        {
            slug: "about",
            sortOrder: 3,
            data: {
                title: "About GPA-Minnesota",
                highlight: "GPA-Minnesota",
                description:
                    "Greyhound Pets of America — Minnesota is an all-volunteer, 501(c)(3) nonprofit organization dedicated to finding loving homes for retired racing greyhounds in the Twin Cities area.",
                location: "About",
            },
        },
        {
            slug: "adopt-available",
            sortOrder: 4,
            data: {
                title: "Meet Our Greyhounds",
                highlight: "Greyhounds",
                description:
                    "Each of these gentle souls is looking for their forever home. Browse our available dogs and find your perfect match.",
                location: "Adopt / Available Dogs",
            },
        },
        {
            slug: "adopt",
            sortOrder: 5,
            data: {
                title: "Your New Best Friend is Waiting",
                highlight: "Best Friend",
                description:
                    "Greyhounds make wonderful family pets. They are gentle, affectionate, and surprisingly low-energy couch companions. Ready to open your heart and home?",
                location: "Adopt",
            },
        },
        {
            slug: "adopt-support",
            sortOrder: 6,
            data: {
                title: "Post-Adoption Support",
                highlight: "Support",
                description:
                    "Congratulations on your new family member! We're here to help you and your greyhound thrive together.",
                location: "Adopt / Support",
            },
        },
        {
            slug: "donate",
            sortOrder: 7,
            data: {
                title: "Help Us Save More Greyhounds",
                highlight: "Save More Greyhounds",
                description:
                    "Your generous donation helps cover veterinary care, foster supplies, transportation, and everything needed to give these gentle dogs a second chance at life.",
                location: "Donate",
            },
        },
        {
            slug: "events",
            sortOrder: 8,
            data: {
                title: "Upcoming Events",
                highlight: "Events",
                description:
                    "From our signature fundraiser to casual weekend walks, there are plenty of ways to connect with our community and the greyhounds.",
                location: "Events",
            },
        },
        {
            slug: "lost-hound",
            sortOrder: 9,
            data: {
                title: "Lost Hound!",
                highlight: "Lost Hound!",
                description:
                    "If your greyhound has gotten loose, time is critical. Follow these steps immediately.",
                variant: "urgent",
                location: "Lost Hound",
            },
        },
        {
            slug: "volunteer",
            sortOrder: 10,
            data: {
                title: "Volunteer with GPA‑MN",
                highlight: "Volunteer",
                description:
                    "GPA‑MN is powered entirely by volunteers like you. Whether you have a few hours a month or want to be deeply involved, there is a role for you.",
                location: "Volunteer",
            },
        },
        {
            slug: "home",
            sortOrder: 11,
            data: {
                title: "Finding Loving Homes for Retired Racing Greyhounds",
                highlight: "Loving Homes",
                description:
                    "Every greyhound deserves a soft bed, a warm home, and a family to call their own. GPA‑MN has been making that happen for over 35 years.",
                location: "Home",
            },
        },
        {
            slug: "adopt-why-gpa-mn",
            sortOrder: 12,
            data: {
                title: "Why Choose GPA\u2011MN?",
                highlight: "GPA\u2011MN",
                description:
                    "A responsible, NGA-endorsed adoption organization dedicated to finding the perfect match for every greyhound.",
                location: "Adopt / Why GPA-MN",
            },
        },
    ].map((item) => ({ ...item, contentType: "pageHeader" as const })),

    // Adoption steps
    ...[
        {
            slug: "learn-about-greyhounds",
            sortOrder: 0,
            data: {
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
        },
        {
            slug: "submit-application",
            sortOrder: 1,
            data: {
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
        },
        {
            slug: "the-match",
            sortOrder: 2,
            data: {
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
        },
        {
            slug: "welcome-home",
            sortOrder: 3,
            data: {
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
        },
    ].map((item) => ({ ...item, contentType: "adoptionStep" as const })),

    // Volunteer roles
    ...[
        {
            slug: "foster-homes",
            sortOrder: 0,
            data: {
                title: "Foster Homes",
                description:
                    "Open your home to a retired racer while they await their forever family. GPA‑MN covers all food, supplies, and veterinary costs. You provide the love and a soft couch.",
                icon: "🏠",
                commitment: "Varies (typically 2–8 weeks)",
            },
        },
        {
            slug: "special-events",
            sortOrder: 1,
            data: {
                title: "Special Events",
                description:
                    "Help plan and run events like Greyfest, Pride, and Race to Raise. From setup and teardown to greeting visitors and managing booths, every hand makes a difference.",
                icon: "🎪",
                commitment: "4–6 hours per event",
            },
        },
        {
            slug: "events-fundraising",
            sortOrder: 2,
            data: {
                title: "Events & Fundraising",
                description:
                    "Help plan and run events like Greyfest, Race to Raise, plant sales, and Meet & Greets. From setup to coordination, every hand makes a difference.",
                icon: "🎉",
                commitment: "2–4 hours per event",
            },
        },
        {
            slug: "meet-greets",
            sortOrder: 3,
            data: {
                title: "Meet & Greets",
                description:
                    "Bring your greyhound to pet stores and community events to introduce the breed to potential adopters. A great way to be an ambassador for the cause.",
                icon: "🐾",
                commitment: "2–3 hours on weekends",
            },
        },
        {
            slug: "coat-making",
            sortOrder: 4,
            data: {
                title: "Coat Making",
                description:
                    "Sew winter coats for adopted greyhounds. Greyhounds have thin skin and low body fat, so they need coats in Minnesota winters. Fleece and sturdy fabrics provided.",
                icon: "🧵",
                commitment: "Flexible, work from home",
            },
        },
        {
            slug: "board-member",
            sortOrder: 5,
            data: {
                title: "Board Member",
                description:
                    "Serve on the GPA‑MN Board of Directors. Help shape organizational strategy, oversee operations, and guide the future of greyhound adoption in Minnesota.",
                icon: "📋",
                commitment: "2-year elected term",
            },
        },
    ].map((item) => ({ ...item, contentType: "volunteerRole" as const })),

    // Donation options
    ...[
        {
            slug: "one-time-gift",
            sortOrder: 0,
            data: {
                title: "One-Time Gift",
                description:
                    "Make a one-time donation of any amount via PayPal. Every dollar helps cover veterinary care, foster supplies, and transportation for retired racing greyhounds.",
                icon: "💝",
            },
        },
        {
            slug: "monthly-sustaining",
            sortOrder: 1,
            data: {
                title: "Monthly Sustaining",
                description:
                    "Become a monthly sustainer at $10, $25, $50, or $100 per month. Recurring gifts provide steady, reliable support that helps us plan ahead and place more greyhounds.",
                icon: "🔄",
            },
        },
        {
            slug: "stock-donations",
            sortOrder: 2,
            data: {
                title: "Stock Donations",
                description:
                    "Donate appreciated stock to GPA‑MN with minimal fees. Stock donations can offer tax advantages while supporting our mission.",
                icon: "📈",
            },
        },
        {
            slug: "netgiver",
            sortOrder: 3,
            data: {
                title: "Netgiver",
                description:
                    "Use the Netgiver platform to donate with zero transaction fees — 100% of your gift goes directly to helping greyhounds.",
                icon: "💻",
            },
        },
        {
            slug: "chewy-giveback",
            sortOrder: 4,
            data: {
                title: "Chewy Giveback",
                description:
                    "Order pet supplies through Chewy's Giveback program and a portion of your purchase supports GPA‑MN automatically.",
                icon: "🛒",
            },
        },
        {
            slug: "heal-a-hound",
            sortOrder: 5,
            data: {
                title: "Heal a Hound Fund",
                description:
                    "Contribute to our special medical fund that covers extraordinary veterinary expenses for greyhounds with injuries or health conditions beyond routine care.",
                icon: "🩺",
            },
        },
    ].map((item) => ({ ...item, contentType: "donationOption" as const })),

    // About page
    {
        contentType: "aboutPage" as const,
        slug: "about",
        sortOrder: 0,
        data: {
            title: "About GPA-Minnesota",
            body: `Since 1989, GPA‑MN has been placing retired racing greyhounds in loving forever families throughout Minnesota. We believe that successful, life-long adoptions are achieved by carefully and thoughtfully considering each match between dog and family.

We are a foster-home based organization, meaning every greyhound in our care lives in a volunteer's home rather than a kennel. This allows each dog to adjust to home life — learning about stairs, glass doors, couches, and the simple joy of being a pet — before joining their forever family.

Our organization runs entirely on the dedication of volunteers who share a passion for these gentle, elegant dogs. From fostering and transport to events and fundraising, every aspect of GPA‑MN is powered by people who care deeply about greyhound welfare.

Over the past three decades, we have placed approximately 2,000 greyhounds with families across the Twin Cities and beyond. Each placement is a success story, and we remain committed to supporting our adopters throughout the lifetime of their greyhound.`,
        },
    },

    // Why choose us
    {
        contentType: "whyChooseUs" as const,
        slug: "why-choose-us",
        sortOrder: 0,
        data: {
            title: "Why Choose GPA\u2011MN?",
            body: `GPA\u2011MN is a proud member of Greyhound Pets of America (GPA), the oldest and largest greyhound adoption organization in the United States. We are endorsed by the National Greyhound Association (NGA) as a responsible adoption organization committed to finding loving homes for retired racing greyhounds.

Our primary obligation is to the dogs entrusted to our care. Every greyhound adopted through GPA\u2011MN receives comprehensive vetting and supplies before going to their forever home.

## What Every Dog Receives

- **Microchip** for permanent identification
- **Full physical exam** by a licensed veterinarian
- **4DX blood & fecal antigen tests** to check for and treat parasites and disease
- **Parasite preventatives** while in foster care
- **Spay/neuter** surgery
- **Dental cleaning** (and extractions as needed)
- **Vaccinations** updated to current standards
- **Any other veterinary concerns** covered while the dog is in foster care
- **New basket muzzle, martingale collar, ID collar, and leash**
- **Lifetime support** in a welcoming local greyhound adoption community`,
        },
    },

    // Before you apply
    {
        contentType: "beforeYouApply" as const,
        slug: "before-you-apply",
        sortOrder: 0,
        data: {
            label: "Good to Know",
            title: "Before You Apply",
            text: `- We carefully and thoughtfully consider each match to ensure successful, life-long adoptions.
- We cannot adopt to homes with 4 or more resident pets.
- A veterinary reference may be required if you have existing pets.
- The adoption fee is non-refundable and covers veterinary care, spay/neuter, and dental cleaning.
- All adopters are invited to join our Facebook community for ongoing support.`,
        },
    },

    // Post adoption support
    ...[
        {
            slug: "new-hound-owners-manual",
            sortOrder: 0,
            data: {
                title: "New Hound Owner's Manual",
                description:
                    "Everything you need to know about bringing your greyhound home — from the first night to establishing routines.",
                icon: "📖",
            },
        },
        {
            slug: "heartworm-prescription-note",
            sortOrder: 1,
            data: {
                title: "Heartworm Prescription Note",
                description:
                    "Information about heartworm prevention and how to obtain prescriptions for your adopted greyhound.",
                icon: "💊",
            },
        },
        {
            slug: "preventing-escapes",
            sortOrder: 2,
            data: {
                title: "Preventing Escapes",
                description:
                    "Tips and best practices for preventing your greyhound from getting loose, including collar and leash recommendations.",
                icon: "🔒",
            },
        },
        {
            slug: "stay-connected",
            sortOrder: 3,
            data: {
                title: "Stay Connected",
                description:
                    "Join the MN Greyhound Playdates, Outings, Hijinks, Chat and Support Facebook group for ongoing community support.",
                icon: "🤝",
            },
        },
        {
            slug: "feeding-guidelines",
            sortOrder: 4,
            data: {
                title: "Feeding Guidelines",
                description:
                    "Recommended food brands, portion sizes, and feeding schedules tailored specifically for retired racing greyhounds.",
                icon: "🍽️",
            },
        },
        {
            slug: "veterinary-care",
            sortOrder: 5,
            data: {
                title: "Veterinary Care",
                description:
                    "Greyhound-specific health information including dental care, anesthesia sensitivities, and recommended vet practices in the Twin Cities.",
                icon: "🏥",
            },
        },
    ].map((item) => ({ ...item, contentType: "postAdoptionSupport" as const })),

    // Lost hound suggestions (prevention tips)
    ...[
        {
            slug: "id-tags",
            sortOrder: 0,
            data: {
                title: "ID Tags",
                description:
                    "Always keep current ID tags on your greyhound's collar with your phone number. Consider a GPS tracking collar.",
                icon: "🏷️",
            },
        },
        {
            slug: "martingale-collar",
            sortOrder: 1,
            data: {
                title: "Martingale Collar",
                description:
                    "Use a properly fitted martingale collar — greyhounds can slip out of regular collars due to their narrow heads.",
                icon: "🔗",
            },
        },
        {
            slug: "door-safety",
            sortOrder: 2,
            data: {
                title: "Door Safety",
                description:
                    "Be vigilant about doors and gates. Greyhounds are fast and can bolt before you realize it. Consider baby gates as backup.",
                icon: "🚪",
            },
        },
        {
            slug: "secure-fencing",
            sortOrder: 3,
            data: {
                title: "Secure Fencing",
                description:
                    "Check your yard fencing regularly for gaps. Greyhounds can squeeze through surprisingly small spaces and can jump fences under 5 feet.",
                icon: "🏡",
            },
        },
        {
            slug: "microchip",
            sortOrder: 4,
            data: {
                title: "Microchip",
                description:
                    "Ensure your greyhound's microchip registration is up to date with your current contact information.",
                icon: "📱",
            },
        },
        {
            slug: "leash-always",
            sortOrder: 5,
            data: {
                title: "Leash Always",
                description:
                    "Never let your greyhound off-leash in an unfenced area. Their prey drive can override all training in an instant.",
                icon: "⚡",
            },
        },
    ].map((item) => ({ ...item, contentType: "lostHoundSuggestion" as const })),

    // Why greyhounds
    ...[
        {
            slug: "gentle-temperament",
            sortOrder: 0,
            data: {
                title: "Gentle Temperament",
                description:
                    "Greyhounds are known for being calm, quiet, and surprisingly low-energy in the home. They are the ultimate couch companion.",
                icon: "🛋️",
            },
        },
        {
            slug: "great-with-families",
            sortOrder: 1,
            data: {
                title: "Great with Families",
                description:
                    "Most greyhounds are wonderful with children and adapt well to family life. Their gentle nature makes them patient and loving pets.",
                icon: "👨‍👩‍👧",
            },
        },
        {
            slug: "low-grooming-needs",
            sortOrder: 2,
            data: {
                title: "Low Grooming Needs",
                description:
                    "With short coats and minimal shedding, greyhounds are easy to groom. A weekly brush and occasional bath is all they need.",
                icon: "✂️",
            },
        },
        {
            slug: "calm-house-dogs",
            sortOrder: 3,
            data: {
                title: "Calm House Dogs",
                description:
                    "Despite being the fastest dog breed, greyhounds are surprisingly lazy at home. They typically sleep 16–18 hours a day.",
                icon: "🏡",
            },
        },
    ].map((item) => ({ ...item, contentType: "whyGreyhound" as const })),
]

async function seed() {
    console.log("Clearing existing data...")
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`)
    await db.delete(contentVersions)
    await db.delete(contentItems)
    await db.delete(events)
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`)

    console.log("Seeding events...")
    await db.insert(events).values(eventsData)
    console.log(`  Inserted ${eventsData.length} events`)

    console.log("Seeding content items...")
    for (const item of contentData) {
        const [inserted] = await db
            .insert(contentItems)
            .values({
                contentType: item.contentType,
                slug: item.slug,
                sortOrder: item.sortOrder,
            })
            .$returningId()

        await db.insert(contentVersions).values({
            contentItemId: inserted!.id,
            version: 1,
            data: item.data,
            createdBy: "seed",
        })
    }
    console.log(`  Inserted ${contentData.length} content items with initial versions`)

    console.log("Seed complete!")
    process.exit(0)
}

seed().catch((err) => {
    console.error("Seed failed:", err)
    process.exit(1)
})
