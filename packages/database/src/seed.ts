import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { events } from './schema/events.js';
import { contentItems, contentVersions } from './schema/content.js';

type ContentType = (typeof contentItems.$inferSelect)['contentType'];

const db = drizzle(process.env.DATABASE_URL!);

const eventsData = [
  {
    title: 'Greyfest 2026',
    date: 'September 12, 2026',
    time: '10:00 AM – 4:00 PM',
    location: 'Elm Creek Park Reserve, Maple Grove, MN',
    type: 'Annual' as const,
    description:
      'Our biggest event of the year! Join greyhound lovers for a day of fun, food, vendors, contests, and hound parades.',
    longDescription:
      "Greyfest is GPA-MN's signature annual event, bringing together hundreds of greyhound families and fans for a full day of celebration. Enjoy vendor booths, a silent auction, hound costume contests, a blessing of the hounds, memorial walk, and plenty of greyhound socializing. Whether you're a longtime adopter or simply curious about the breed, Greyfest is the place to be. Food trucks, raffle prizes, and greyhound merchandise round out this beloved tradition. All proceeds support GPA-MN's adoption mission.",
    sortOrder: 0,
  },
  {
    title: 'Race to Raise 5K',
    date: 'June 20, 2026',
    time: '8:00 AM – 11:00 AM',
    location: 'Lake Harriet, Minneapolis, MN',
    type: 'Fundraiser' as const,
    description:
      'A fun run and walk fundraiser where humans and hounds race together to support greyhound adoption efforts.',
    longDescription:
      "Lace up your running shoes and bring your hound for GPA-MN's annual Race to Raise 5K! This family-friendly event welcomes runners, walkers, and greyhounds of all speeds. The scenic course loops around beautiful Lake Harriet. Registration includes a commemorative t-shirt, goodie bag, and post-race refreshments. Awards are given for top finishers and best greyhound costume. All proceeds go directly to funding veterinary care, transportation, and foster support for retired racing greyhounds.",
    sortOrder: 1,
  },
  {
    title: "Meet & Greet at Chuck & Don's",
    date: 'March 22, 2026',
    time: '11:00 AM – 2:00 PM',
    location: "Chuck & Don's, Woodbury, MN",
    type: 'Monthly' as const,
    description:
      'Come meet adoptable greyhounds in person! Chat with experienced owners and learn about the breed.',
    longDescription:
      "Our monthly Meet & Greets are the perfect opportunity to meet greyhounds up close and personal. Adoptable greyhounds will be on hand along with experienced GPA-MN volunteers and adopters who can answer all your questions about the breed. Learn about their gentle temperament, exercise needs, and what makes greyhounds such wonderful pets. No appointment necessary — just stop by! These events are held at pet-friendly retail locations across the Twin Cities metro area.",
    sortOrder: 2,
  },
  {
    title: 'Sunday Como Walk',
    date: 'Every Sunday',
    time: '10:00 AM',
    location: 'Como Park, Saint Paul, MN',
    type: 'Weekly' as const,
    description:
      'Join fellow greyhound families for a relaxed Sunday stroll through beautiful Como Park.',
    longDescription:
      "Every Sunday morning, greyhound families gather at Como Park for a leisurely group walk. It's a wonderful way to socialize your greyhound, meet other adopters, and enjoy the beautiful surroundings of Como Park. The walk is casual and self-paced — perfect for greyhounds of all energy levels. New adopters especially are encouraged to join as it's a great way to connect with the GPA-MN community and get tips from experienced greyhound owners. Meet at the main parking lot near the Pavilion.",
    sortOrder: 3,
  },
  {
    title: 'Spring Plant Sale',
    date: 'May 16, 2026',
    time: '9:00 AM – 1:00 PM',
    location: "Bachman's, Minneapolis, MN",
    type: 'Seasonal' as const,
    description:
      'Shop beautiful plants while supporting greyhound adoption. A beloved spring tradition!',
    longDescription:
      "GPA-MN's annual Spring Plant Sale is a beloved tradition that combines two great things: beautiful plants and greyhound adoption! Browse a curated selection of annuals, perennials, herbs, and hanging baskets. All proceeds support GPA-MN's mission. Adoptable greyhounds will be on hand, and volunteers will be available to answer questions about the organization and the adoption process. It's a wonderful way to welcome spring while making a difference for retired racing greyhounds.",
    sortOrder: 4,
  },
  {
    title: 'Twin Cities Pride Festival',
    date: 'June 27–28, 2026',
    time: '10:00 AM – 6:00 PM',
    location: 'Loring Park, Minneapolis, MN',
    type: 'Annual' as const,
    description:
      'Visit the GPA-MN booth at Twin Cities Pride! Meet greyhounds, grab merch, and celebrate with us.',
    longDescription:
      "GPA-MN is proud to participate in the Twin Cities Pride Festival at Loring Park! Stop by our booth to meet adoptable greyhounds, chat with volunteers, and pick up greyhound-themed merchandise. Our greyhound ambassadors are always a crowd favorite, drawing hundreds of visitors who fall in love with the breed. Pride is a wonderful celebration of community, and we're honored to be part of it. All merchandise proceeds support GPA-MN's adoption mission.",
    sortOrder: 5,
  },
];

interface ContentSeedItem {
  contentType: ContentType;
  slug: string;
  sortOrder: number;
  data: Record<string, unknown>;
}

const contentData: ContentSeedItem[] = [
  // Adoption steps
  ...[
    {
      slug: 'learn-about-greyhounds',
      sortOrder: 0,
      data: {
        step: 1,
        title: 'Learn About Greyhounds',
        description: 'Research the greyhound breed and attend one of our Meet & Greet events to interact with greyhounds in person.',
        details: [
          'Read about greyhound temperament, exercise needs, and care requirements',
          'Attend a Meet & Greet event to meet adoptable dogs and talk with experienced owners',
          'Discuss with your family whether a greyhound is the right fit for your household',
          'Consider your living situation, other pets, and daily schedule',
        ],
        icon: '📚',
      },
    },
    {
      slug: 'submit-application',
      sortOrder: 1,
      data: {
        step: 2,
        title: 'Submit Your Application',
        description: 'Complete our online adoption application and participate in an interview with our Adoption Coordinator.',
        details: [
          'Fill out the online adoption application with details about your home and lifestyle',
          'An Adoption Coordinator will contact you for a phone or in-person interview',
          'We may ask for a veterinary reference if you have other pets',
          'An Adoption Representative will be assigned to guide you through the process',
        ],
        icon: '📝',
      },
    },
    {
      slug: 'the-match',
      sortOrder: 2,
      data: {
        step: 3,
        title: 'The Match',
        description: 'Our experienced coordinators identify the greyhound that best fits your family, lifestyle, and preferences.',
        details: [
          'Coordinators consider your home environment, activity level, and other pets',
          'We carefully match each dog based on temperament and your specific needs',
          'Your Adoption Representative will discuss potential matches with you',
          'We prioritize finding the right match — not just any match',
        ],
        icon: '🤝',
      },
    },
    {
      slug: 'welcome-home',
      sortOrder: 3,
      data: {
        step: 4,
        title: 'Welcome Home',
        description: 'Meet your new greyhound, sign the adoption contract, and bring your new family member home!',
        details: [
          'Meet your matched greyhound at the foster home or a scheduled meeting',
          'Sign the adoption contract and pay the non-refundable adoption fee',
          'Receive a starter kit with food, leash, and care information',
          'Join the GPA-MN Facebook community for ongoing support and advice',
        ],
        icon: '🏠',
      },
    },
  ].map((item) => ({ ...item, contentType: 'adoptionStep' as const })),

  // Volunteer roles
  ...[
    { slug: 'foster-homes', sortOrder: 0, data: { title: 'Foster Homes', description: 'Open your home to a retired racer while they await their forever family. GPA-MN covers all food, supplies, and veterinary costs. You provide the love and a soft couch.', icon: '🏠', commitment: 'Varies (typically 2–8 weeks)' } },
    { slug: 'special-events', sortOrder: 1, data: { title: 'Special Events', description: 'Help plan and run events like Greyfest, Pride, and Race to Raise. From setup and teardown to greeting visitors and managing booths, every hand makes a difference.', icon: '🎪', commitment: '4–6 hours per event' } },
    { slug: 'events-fundraising', sortOrder: 2, data: { title: 'Events & Fundraising', description: 'Help plan and run events like Greyfest, Race to Raise, plant sales, and Meet & Greets. From setup to coordination, every hand makes a difference.', icon: '🎉', commitment: '2–4 hours per event' } },
    { slug: 'meet-greets', sortOrder: 3, data: { title: 'Meet & Greets', description: 'Bring your greyhound to pet stores and community events to introduce the breed to potential adopters. A great way to be an ambassador for the cause.', icon: '🐾', commitment: '2–3 hours on weekends' } },
    { slug: 'coat-making', sortOrder: 4, data: { title: 'Coat Making', description: 'Sew winter coats for adopted greyhounds. Greyhounds have thin skin and low body fat, so they need coats in Minnesota winters. Fleece and sturdy fabrics provided.', icon: '🧵', commitment: 'Flexible, work from home' } },
    { slug: 'board-member', sortOrder: 5, data: { title: 'Board Member', description: 'Serve on the GPA-MN Board of Directors. Help shape organizational strategy, oversee operations, and guide the future of greyhound adoption in Minnesota.', icon: '📋', commitment: '2-year elected term' } },
  ].map((item) => ({ ...item, contentType: 'volunteerRole' as const })),

  // Donation options
  ...[
    { slug: 'one-time-gift', sortOrder: 0, data: { title: 'One-Time Gift', description: 'Make a one-time donation of any amount via PayPal. Every dollar helps cover veterinary care, foster supplies, and transportation for retired racing greyhounds.', icon: '💝' } },
    { slug: 'monthly-sustaining', sortOrder: 1, data: { title: 'Monthly Sustaining', description: 'Become a monthly sustainer at $10, $25, $50, or $100 per month. Recurring gifts provide steady, reliable support that helps us plan ahead and place more greyhounds.', icon: '🔄' } },
    { slug: 'stock-donations', sortOrder: 2, data: { title: 'Stock Donations', description: 'Donate appreciated stock to GPA-MN with minimal fees. Stock donations can offer tax advantages while supporting our mission.', icon: '📈' } },
    { slug: 'netgiver', sortOrder: 3, data: { title: 'Netgiver', description: 'Use the Netgiver platform to donate with zero transaction fees — 100% of your gift goes directly to helping greyhounds.', icon: '💻' } },
    { slug: 'chewy-giveback', sortOrder: 4, data: { title: 'Chewy Giveback', description: "Order pet supplies through Chewy's Giveback program and a portion of your purchase supports GPA-MN automatically.", icon: '🛒' } },
    { slug: 'heal-a-hound', sortOrder: 5, data: { title: 'Heal a Hound Fund', description: 'Contribute to our special medical fund that covers extraordinary veterinary expenses for greyhounds with injuries or health conditions beyond routine care.', icon: '🩺' } },
  ].map((item) => ({ ...item, contentType: 'donationOption' as const })),
];

async function seed() {
  console.log('Seeding events...');
  await db.insert(events).values(eventsData);
  console.log(`  Inserted ${eventsData.length} events`);

  console.log('Seeding content items...');
  for (const item of contentData) {
    const [inserted] = await db
      .insert(contentItems)
      .values({
        contentType: item.contentType,
        slug: item.slug,
        sortOrder: item.sortOrder,
      })
      .$returningId();

    await db.insert(contentVersions).values({
      contentItemId: inserted!.id,
      version: 1,
      data: item.data,
      createdBy: 'seed',
    });
  }
  console.log(`  Inserted ${contentData.length} content items with initial versions`);

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
