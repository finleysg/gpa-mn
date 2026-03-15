import { cn } from '@repo/ui/lib/utils';

type SectionHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {label && (
        <p className="font-sans font-bold text-xs uppercase tracking-[2.5px] text-[#2d7a81] dark:text-[#3a9da6] mb-3">
          {label}
        </p>
      )}
      <h2 className="font-heading text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.1] tracking-wider uppercase text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-[1.05rem] text-muted-foreground leading-relaxed max-w-[600px]',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
