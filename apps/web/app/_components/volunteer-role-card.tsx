import type { VolunteerRoleData } from '@repo/types';
import { MarkdownContent } from './markdown-content';

export function VolunteerRoleCard({ role }: { role: VolunteerRoleData }) {
  return (
    <div className="bg-[#FAF5F0] dark:bg-[#1a1715] rounded-3xl p-6 flex items-start gap-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)] border border-border">
      <div className="w-11 h-11 min-w-11 rounded-xl bg-card dark:bg-[#242019] flex items-center justify-center text-xl">
        {role.icon}
      </div>
      <div>
        <h3 className="font-heading text-lg tracking-wider uppercase mb-1">{role.title}</h3>
        <MarkdownContent content={role.description} className="text-sm text-muted-foreground leading-relaxed mb-2 [&>p]:mb-0" />
        <p className="text-xs font-semibold text-[#2d7a81] dark:text-[#3a9da6]">
          {role.commitment}
        </p>
      </div>
    </div>
  );
}
