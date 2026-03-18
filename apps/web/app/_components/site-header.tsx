'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { mainNav } from '@/app/_data/navigation';
import { SearchIcon } from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
} from '@repo/ui/components/command';
import { cn } from '@repo/ui/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { MobileNav } from './mobile-nav';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-3">
      <div
        className={cn(
          'mx-auto max-w-300 rounded-4xl px-6 py-3 flex items-center justify-between transition-shadow duration-300 bg-background/92 backdrop-blur-xl border border-white/60 dark:border-white/10',
          scrolled ? 'shadow-[0_4px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)]' : 'shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]'
        )}
      >
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/gpa-logo.png"
            alt="GPA-MN"
            width={140}
            height={56}
            className="h-10 w-auto dark:invert dark:hue-rotate-180"
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
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-input bg-muted/50 px-2.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors md:px-4"
          >
            <SearchIcon className="size-4" />
            <span className="hidden md:inline">Search…</span>
            <kbd className="pointer-events-none ml-2 hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:inline-flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
          <CommandDialog
            open={searchOpen}
            onOpenChange={setSearchOpen}
            title="Search"
            description="Search the site"
          >
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          </CommandDialog>
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
