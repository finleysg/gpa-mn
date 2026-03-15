export type Dog = {
  id: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female';
  color: string;
  weight: number;
  catFriendly: boolean;
  kidFriendly: boolean;
  bio: string;
  traits: string[];
};

export const dogs: Dog[] = [
  {
    id: 'luna',
    name: 'Luna',
    age: 3,
    sex: 'Female',
    color: 'Brindle',
    weight: 62,
    catFriendly: true,
    kidFriendly: true,
    bio: 'Luna is a sweet and gentle girl who loves nothing more than curling up on the couch next to her people. She raced for two years before retiring and has adjusted beautifully to home life. Luna is great with cats and children, making her a perfect family companion.',
    traits: ['Cat Friendly', 'Good with Kids', 'Couch Potato'],
  },
  {
    id: 'maverick',
    name: 'Maverick',
    age: 4,
    sex: 'Male',
    color: 'Red Fawn',
    weight: 75,
    catFriendly: false,
    kidFriendly: true,
    bio: 'Maverick is a tall, handsome boy with a playful spirit. He loves his daily walks and has a goofy personality that will keep you laughing. He does best in a home without cats but gets along great with other dogs and older children.',
    traits: ['Playful', 'Good with Kids', 'Dog Friendly'],
  },
  {
    id: 'penny',
    name: 'Penny',
    age: 2,
    sex: 'Female',
    color: 'White & Red',
    weight: 58,
    catFriendly: true,
    kidFriendly: true,
    bio: 'Penny is one of our youngest retirees and she is full of life! She has adapted quickly to home living and particularly enjoys her soft bed and squeaky toys. Penny is cat-safe and loves everyone she meets.',
    traits: ['Cat Friendly', 'Good with Kids', 'Energetic'],
  },
  {
    id: 'scout',
    name: 'Scout',
    age: 5,
    sex: 'Male',
    color: 'Black',
    weight: 72,
    catFriendly: true,
    kidFriendly: true,
    bio: 'Scout is a distinguished gentleman with a calm, easygoing temperament. He is a true couch potato who loves nothing more than napping in a sunny spot. Scout is wonderful with children and cats, making him an ideal family pet.',
    traits: ['Cat Friendly', 'Good with Kids', 'Calm'],
  },
  {
    id: 'daisy',
    name: 'Daisy',
    age: 3,
    sex: 'Female',
    color: 'Blue Fawn',
    weight: 60,
    catFriendly: false,
    kidFriendly: true,
    bio: 'Daisy is a sweet girl with soulful eyes who bonds deeply with her people. She loves belly rubs and going for leisurely walks. Daisy does best in a home without small animals but is wonderful with people of all ages.',
    traits: ['Affectionate', 'Good with Kids', 'Gentle'],
  },
  {
    id: 'finn',
    name: 'Finn',
    age: 4,
    sex: 'Male',
    color: 'Red Brindle',
    weight: 70,
    catFriendly: true,
    kidFriendly: false,
    bio: 'Finn is a handsome boy who thrives in a quieter household. He is cat-safe and loves to lean against his favorite people for pets. Finn would do best in a home with older teens or adults who can appreciate his gentle, sensitive nature.',
    traits: ['Cat Friendly', 'Sensitive', 'Leaner'],
  },
  {
    id: 'rosie',
    name: 'Rosie',
    age: 3,
    sex: 'Female',
    color: 'Fawn',
    weight: 55,
    catFriendly: true,
    kidFriendly: true,
    bio: 'Rosie is a petite and dainty girl with the biggest personality. She is incredibly social and loves meeting new people at events. Rosie is great with cats, kids, and other dogs — a truly versatile companion.',
    traits: ['Cat Friendly', 'Good with Kids', 'Social'],
  },
  {
    id: 'atlas',
    name: 'Atlas',
    age: 5,
    sex: 'Male',
    color: 'White & Brindle',
    weight: 78,
    catFriendly: false,
    kidFriendly: true,
    bio: 'Atlas is our gentle giant. Despite his size, he is one of the sweetest dogs you will ever meet. He loves children and is incredibly patient. Atlas needs a home without cats but gets along with other large dogs.',
    traits: ['Gentle Giant', 'Good with Kids', 'Patient'],
  },
];
