export type VolunteerRole = {
  title: string;
  description: string;
  icon: string;
  commitment: string;
};

export const volunteerRoles: VolunteerRole[] = [
  {
    title: 'Foster Homes',
    description:
      'Open your home to a retired racer while they await their forever family. GPA-MN covers all food, supplies, and veterinary costs. You provide the love and a soft couch.',
    icon: '🏠',
    commitment: 'Varies (typically 2–8 weeks)',
  },
  {
    title: 'Special Events',
    description:
      'Help plan and run events like Greyfest, Pride, and Race to Raise. From setup and teardown to greeting visitors and managing booths, every hand makes a difference.',
    icon: '🎪',
    commitment: '4–6 hours per event',
  },
  {
    title: 'Events & Fundraising',
    description:
      'Help plan and run events like Greyfest, Race to Raise, plant sales, and Meet & Greets. From setup to coordination, every hand makes a difference.',
    icon: '🎉',
    commitment: '2–4 hours per event',
  },
  {
    title: 'Meet & Greets',
    description:
      'Bring your greyhound to pet stores and community events to introduce the breed to potential adopters. A great way to be an ambassador for the cause.',
    icon: '🐾',
    commitment: '2–3 hours on weekends',
  },
  {
    title: 'Coat Making',
    description:
      'Sew winter coats for adopted greyhounds. Greyhounds have thin skin and low body fat, so they need coats in Minnesota winters. Fleece and sturdy fabrics provided.',
    icon: '🧵',
    commitment: 'Flexible, work from home',
  },
  {
    title: 'Board Member',
    description:
      'Serve on the GPA-MN Board of Directors. Help shape organizational strategy, oversee operations, and guide the future of greyhound adoption in Minnesota.',
    icon: '📋',
    commitment: '2-year elected term',
  },
];
