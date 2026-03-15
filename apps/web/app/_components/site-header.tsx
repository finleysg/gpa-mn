'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { mainNav } from '@/app/_data/navigation';
import { ThemeToggle } from './theme-toggle';
import { MobileNav } from './mobile-nav';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-3">
      <div
        className={`mx-auto max-w-[1200px] rounded-[32px] px-6 py-3 flex items-center justify-between transition-shadow duration-300 bg-background/92 backdrop-blur-xl border border-white/60 dark:border-white/10 ${
          scrolled ? 'shadow-[0_4px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)]' : 'shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/gpa-logo.png"
            alt="GPA-MN"
            width={140}
            height={56}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans font-semibold text-sm px-4 py-2 rounded-full text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/adopt/available"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(156,47,48,0.25)]"
          >
            Meet Our Greys
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
