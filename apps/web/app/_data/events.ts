export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Annual' | 'Fundraiser' | 'Monthly' | 'Weekly' | 'Seasonal' | 'Special';
  description: string;
  longDescription: string;
};

export const events: Event[] = [
  {
    id: 'greyfest-2026',
    title: 'Greyfest 2026',
    date: 'September 12, 2026',
    time: '10:00 AM – 4:00 PM',
    location: 'Elm Creek Park Reserve, Maple Grove, MN',
    type: 'Annual',
    description:
      'Our biggest event of the year! Join greyhound lovers for a day of fun, food, vendors, contests, and hound parades.',
    longDescription:
      'Greyfest is GPA-MN\'s signature annual event, bringing together hundreds of greyhound families and fans for a full day of celebration. Enjoy vendor booths, a silent auction, hound costume contests, a blessing of the hounds, memorial walk, and plenty of greyhound socializing. Whether you\'re a longtime adopter or simply curious about the breed, Greyfest is the place to be. Food trucks, raffle prizes, and greyhound merchandise round out this beloved tradition. All proceeds support GPA-MN\'s rescue and adoption mission.',
  },
  {
    id: 'race-to-raise-2026',
    title: 'Race to Raise 5K',
    date: 'June 20, 2026',
    time: '8:00 AM – 11:00 AM',
    location: 'Lake Harriet, Minneapolis, MN',
    type: 'Fundraiser',
    description:
      'A fun run and walk fundraiser where humans and hounds race together to support greyhound rescue efforts.',
    longDescription:
      'Lace up your running shoes and bring your hound for GPA-MN\'s annual Race to Raise 5K! This family-friendly event welcomes runners, walkers, and greyhounds of all speeds. The scenic course loops around beautiful Lake Harriet. Registration includes a commemorative t-shirt, goodie bag, and post-race refreshments. Awards are given for top finishers and best greyhound costume. All proceeds go directly to funding veterinary care, transportation, and foster support for retired racing greyhounds.',
  },
  {
    id: 'meet-greet-march',
    title: 'Meet & Greet at Chuck & Don\'s',
    date: 'March 22, 2026',
    time: '11:00 AM – 2:00 PM',
    location: 'Chuck & Don\'s, Woodbury, MN',
    type: 'Monthly',
    description:
      'Come meet adoptable greyhounds in person! Chat with experienced owners and learn about the breed.',
    longDescription:
      'Our monthly Meet & Greets are the perfect opportunity to meet greyhounds up close and personal. Adoptable greyhounds will be on hand along with experienced GPA-MN volunteers and adopters who can answer all your questions about the breed. Learn about their gentle temperament, exercise needs, and what makes greyhounds such wonderful pets. No appointment necessary — just stop by! These events are held at pet-friendly retail locations across the Twin Cities metro area.',
  },
  {
    id: 'como-walk',
    title: 'Sunday Como Walk',
    date: 'Every Sunday',
    time: '10:00 AM',
    location: 'Como Park, Saint Paul, MN',
    type: 'Weekly',
    description:
      'Join fellow greyhound families for a relaxed Sunday stroll through beautiful Como Park.',
    longDescription:
      'Every Sunday morning, greyhound families gather at Como Park for a leisurely group walk. It\'s a wonderful way to socialize your greyhound, meet other adopters, and enjoy the beautiful surroundings of Como Park. The walk is casual and self-paced — perfect for greyhounds of all energy levels. New adopters especially are encouraged to join as it\'s a great way to connect with the GPA-MN community and get tips from experienced greyhound owners. Meet at the main parking lot near the Pavilion.',
  },
  {
    id: 'plant-sale-2026',
    title: 'Spring Plant Sale',
    date: 'May 16, 2026',
    time: '9:00 AM – 1:00 PM',
    location: 'Bachman\'s, Minneapolis, MN',
    type: 'Seasonal',
    description:
      'Shop beautiful plants while supporting greyhound rescue. A beloved spring tradition!',
    longDescription:
      'GPA-MN\'s annual Spring Plant Sale is a beloved tradition that combines two great things: beautiful plants and greyhound rescue! Browse a curated selection of annuals, perennials, herbs, and hanging baskets. All proceeds support GPA-MN\'s mission. Adoptable greyhounds will be on hand, and volunteers will be available to answer questions about the organization and the adoption process. It\'s a wonderful way to welcome spring while making a difference for retired racing greyhounds.',
  },
  {
    id: 'block-fundraiser',
    title: 'Dinner at The Block',
    date: 'April 4, 2026',
    time: '5:00 PM – 9:00 PM',
    location: 'The Block Food & Drink, St. Louis Park, MN',
    type: 'Special',
    description:
      '10% of all proceeds support GPA-MN. Enjoy great food on the dog-friendly patio!',
    longDescription:
      'Join us for a special fundraising dinner at The Block Food & Drink in St. Louis Park! The restaurant will donate 10% of all proceeds from the evening to GPA-MN. Bring your greyhound and enjoy the dog-friendly patio (weather permitting). The Block features a seasonal menu of American comfort food, craft cocktails, and local beers. No reservation required — just mention GPA-MN when ordering. It\'s a fun, low-key way to support greyhound rescue while enjoying a great meal with friends.',
  },
];
