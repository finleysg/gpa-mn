export type DonationMethod = {
  title: string;
  description: string;
  icon: string;
};

export const donationAmounts = [25, 50, 100, 250];

export const donationMethods: DonationMethod[] = [
  {
    title: 'One-Time Gift',
    description:
      'Make a one-time donation of any amount via PayPal. Every dollar helps cover veterinary care, foster supplies, and transportation for retired racing greyhounds.',
    icon: '💝',
  },
  {
    title: 'Monthly Sustaining',
    description:
      'Become a monthly sustainer at $10, $25, $50, or $100 per month. Recurring gifts provide steady, reliable support that helps us plan ahead and place more greyhounds.',
    icon: '🔄',
  },
  {
    title: 'Stock Donations',
    description:
      'Donate appreciated stock to GPA-MN with minimal fees. Stock donations can offer tax advantages while supporting our mission.',
    icon: '📈',
  },
  {
    title: 'Netgiver',
    description:
      'Use the Netgiver platform to donate with zero transaction fees — 100% of your gift goes directly to helping greyhounds.',
    icon: '💻',
  },
  {
    title: 'Chewy Giveback',
    description:
      'Order pet supplies through Chewy\'s Giveback program and a portion of your purchase supports GPA-MN automatically.',
    icon: '🛒',
  },
  {
    title: 'Heal a Hound Fund',
    description:
      'Contribute to our special medical fund that covers extraordinary veterinary expenses for greyhounds with injuries or health conditions beyond routine care.',
    icon: '🩺',
  },
];
