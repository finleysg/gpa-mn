type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="bg-white/80 dark:bg-white/4 rounded-2xl p-4 text-center border border-white/60 dark:border-white/8 backdrop-blur-sm">
      <strong className="block font-heading text-4xl text-primary tracking-wider">{value}</strong>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
