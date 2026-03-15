import { cn } from '@repo/ui/lib/utils';
import { BlobDecoration } from './blob-decoration';

type PageHeroProps = {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'urgent';
};

export function PageHero({
  badge,
  title,
  highlight,
  description,
  children,
  className,
  variant = 'default',
}: PageHeroProps) {
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <section
      className={cn(
        'relative overflow-hidden pt-36 pb-20 px-5 md:pt-44 md:pb-24',
        variant === 'default' &&
          'bg-gradient-to-br from-[#FAF5F0] via-[#f0ebe4] via-60% to-secondary/30 dark:from-[#1a1715] dark:via-[#1e1b17] dark:via-60% dark:to-[#152628]',
        variant === 'urgent' &&
          'bg-gradient-to-br from-[#FAF5F0] via-[#fce0dd] to-primary/20 dark:from-[#1a1715] dark:via-[#211211] dark:to-primary/10',
        className
      )}
    >
      <BlobDecoration color="pink" size={500} className="-top-24 -right-36 opacity-30 dark:opacity-8" />
      <BlobDecoration color="teal" size={400} className="-bottom-24 -left-24 opacity-25 dark:opacity-6" />

      <div className="relative z-10 max-w-[1200px] mx-auto text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/6 px-5 py-2 rounded-full font-sans font-semibold text-sm text-[#2d7a81] dark:text-[#3a9da6] mb-6 border border-secondary/40 dark:border-white/8">
            <span className="w-2 h-2 bg-[#ff8f89] rounded-full animate-pulse" />
            {badge}
          </div>
        )}

        <h1 className="font-heading text-[clamp(2.8rem,7vw,4.8rem)] leading-[1.1] tracking-wider uppercase text-foreground mb-5">
          {highlight ? (
            <>
              {parts[0]}
              <em className="not-italic text-primary">{highlight}</em>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h1>

        {description && (
          <p className="text-lg text-muted-foreground leading-relaxed max-w-[520px] mx-auto mb-8">
            {description}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}
