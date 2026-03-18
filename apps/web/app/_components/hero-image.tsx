'use client';

import Image from 'next/image';
import { useState } from 'react';

const HERO_IMAGES = [
  'BinoComo.jpg',
  'BinoPillar.jpg',
  'ChrisYard.jpg',
  'Daisies.jpg',
  'LuceScratch.jpg',
  'Queenie2.jpg',
  'SpillerBun.jpg',
  'SpodeeGrass.jpg',
  'SpodeeSnow.jpg',
  'SpodeeToys.jpg',
  'SylaChin.jpg',
  'SylahTongue.jpg',
  'WinstonGrass.jpg',
  'ZealGlow.jpg',
  'ZinBeach.jpg',
];

export function HeroImage() {
  const [src] = useState(
    () => `/images/hero/${HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]}`
  );

  return (
    <div className="relative h-80 md:h-100 lg:h-115 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
      <Image
        src={src}
        alt="A greyhound"
        fill
        priority
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
