'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { mainNav } from '@/app/_data/navigation';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-background flex flex-col items-center overflow-y-auto md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-5 right-5 rounded-full z-10"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-6" />
            </Button>

            <div className="flex flex-col items-center gap-4 my-auto py-20">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-heading text-3xl tracking-wider uppercase text-foreground hover:text-primary transition-colors px-6 py-2 rounded-2xl hover:bg-accent/50"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/adopt/available"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Meet Our Greys
              </Link>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
