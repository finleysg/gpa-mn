import { cn } from '@repo/ui/lib/utils';

type BlobProps = {
  color?: 'salmon' | 'teal' | 'pink' | 'primary';
  size?: number;
  className?: string;
};

const colorMap = {
  salmon: 'bg-[#ff8f89]',
  teal: 'bg-secondary',
  pink: 'bg-[#ffcfca]',
  primary: 'bg-primary',
};

export function BlobDecoration({ color = 'teal', size = 350, className }: BlobProps) {
  return (
    <div
      className={cn(
        'absolute rounded-full pointer-events-none z-0',
        'blur-[80px] opacity-25 dark:opacity-10',
        colorMap[color],
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
