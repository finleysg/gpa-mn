'use client';

import { cn } from '@repo/ui/lib/utils';

type DonationTierCardProps = {
  amount: number;
  selected?: boolean;
  onClick?: () => void;
};

export function DonationTierCard({ amount, selected, onClick }: DonationTierCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-2xl px-6 py-3 font-heading text-2xl tracking-wider cursor-pointer transition-all',
        selected
          ? 'border-2 border-primary bg-card text-primary -translate-y-0.5 shadow-[0_4px_12px_rgba(156,47,48,0.12)]'
          : 'border-2 border-transparent bg-[#FAF5F0] dark:bg-[#1a1715] text-foreground hover:border-primary hover:bg-card hover:text-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(156,47,48,0.12)]'
      )}
    >
      ${amount}
    </button>
  );
}
