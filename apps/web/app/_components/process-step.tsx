import type { ProcessStep as ProcessStepType } from '@/app/_data/adoption-process';

export function ProcessStep({ step }: { step: ProcessStepType }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-12 h-12 min-w-12 rounded-2xl bg-card dark:bg-[#242019] flex items-center justify-center text-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
        {step.icon}
      </div>
      <div>
        <h3 className="font-heading text-xl tracking-wider uppercase mb-1">
          <span className="text-primary mr-1">Step {step.step}.</span> {step.title}
        </h3>
        <p className="text-[0.95rem] text-muted-foreground leading-relaxed mb-3">
          {step.description}
        </p>
        <ul className="space-y-1.5">
          {step.details.map((detail, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
