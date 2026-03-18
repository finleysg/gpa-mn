import Link from 'next/link';
import { cn } from '@repo/ui/lib/utils';
import { BlobDecoration } from './blob-decoration';

type CTASectionProps = {
  label?: string;
  title: string;
  description: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  variant?: 'teal' | 'warm' | 'default';
  className?: string;
  children?: React.ReactNode;
};

export function CTASection({
  label,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  className,
  children,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden py-20 px-5 md:py-24',
        variant === 'default' && 'bg-[#FAF5F0] dark:bg-[#1a1715]',
        variant === 'warm' && 'bg-linear-to-br from-[#FAF5F0] via-[#f5ece3] to-[#f0e8df] dark:from-[#1a1715] dark:via-[#1e1b17] dark:to-[#201d19]',
        variant === 'teal' && '',
        className
      )}
    >
      {variant !== 'teal' && (
        <>
          <BlobDecoration color="salmon" size={350} className="-top-20 -left-20 opacity-15 dark:opacity-4" />
          <BlobDecoration color="teal" size={300} className="-bottom-20 -right-20 opacity-20 dark:opacity-4" />
        </>
      )}

      <div className="relative z-10 max-w-300 mx-auto">
        {variant === 'teal' ? (
          <div className="bg-linear-to-br from-[#00444b] via-[#005a63] to-[#2d7a81] dark:from-[#0a2e32] dark:via-[#0e3a40] dark:to-[#0c3438] rounded-4xl p-10 md:p-14 lg:p-16 text-white relative overflow-hidden shadow-[0_8px_40px_rgba(0,68,75,0.25)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] border border-white/6">
            <BlobDecoration color="teal" size={300} className="-bottom-24 -right-24 opacity-15 dark:opacity-8" />
            <BlobDecoration color="salmon" size={200} className="-top-16 -left-16 opacity-10 dark:opacity-5" />

            <div className="relative z-10">
              {label && (
                <p className="font-sans font-bold text-xs uppercase tracking-[2.5px] text-secondary mb-3">
                  {label}
                </p>
              )}
              <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-wider uppercase text-white mb-3">
                {title}
              </h2>
              <p className="text-[1.05rem] text-white/80 leading-relaxed max-w-125 mb-7">
                {description}
              </p>

              {children}

              {(primaryAction || secondaryAction) && (
                <div className="flex flex-wrap gap-3">
                  {primaryAction && (
                    <Link
                      href={primaryAction.href}
                      className="inline-flex items-center gap-2 rounded-full bg-white text-[#00444b] px-8 py-3.5 font-semibold hover:bg-secondary transition-colors"
                    >
                      {primaryAction.label}
                    </Link>
                  )}
                  {secondaryAction && (
                    <Link
                      href={secondaryAction.href}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 text-white px-8 py-3.5 font-semibold hover:bg-white/10 transition-colors"
                    >
                      {secondaryAction.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-4xl p-10 md:p-14 text-center shadow-[0_6px_28px_rgba(156,47,48,0.08)] dark:shadow-[0_6px_28px_rgba(0,0,0,0.2)] relative overflow-hidden border border-border">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#ff8f89] via-primary to-[#ff8f89]" />

            <div className="relative z-10">
              {label && (
                <p className="font-sans font-bold text-xs uppercase tracking-[2.5px] text-[#2d7a81] dark:text-[#3a9da6] mb-3">
                  {label}
                </p>
              )}
              <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-wider uppercase text-foreground mb-3">
                {title}
              </h2>
              <p className="text-[1.05rem] text-muted-foreground leading-relaxed max-w-125 mx-auto mb-7">
                {description}
              </p>

              {children}

              {(primaryAction || secondaryAction) && (
                <div className="flex flex-wrap gap-3 justify-center">
                  {primaryAction && (
                    <Link
                      href={primaryAction.href}
                      className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(156,47,48,0.25)]"
                    >
                      {primaryAction.label}
                    </Link>
                  )}
                  {secondaryAction && (
                    <Link
                      href={secondaryAction.href}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-8 py-3.5 font-semibold hover:bg-primary hover:text-white transition-colors"
                    >
                      {secondaryAction.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
