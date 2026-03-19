import Image from 'next/image';

export function HeroImage({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  const src = images[Math.floor(Math.random() * images.length)]!;

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
