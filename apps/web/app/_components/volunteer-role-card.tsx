import type { VolunteerRoleData } from "@repo/types"
import { MarkdownContent } from "./markdown-content"

export function VolunteerRoleCard({ role }: { role: VolunteerRoleData }) {
    const slug = role.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    return (
        <div
            id={slug}
            className="border-border flex scroll-mt-24 items-start gap-4 rounded-3xl border bg-[#FAF5F0] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:bg-[#1a1715] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
        >
            <div className="bg-card flex h-11 w-11 min-w-11 items-center justify-center rounded-xl text-xl dark:bg-[#242019]">
                {role.icon}
            </div>
            <div>
                <h3 className="font-heading mb-1 text-lg tracking-wider uppercase">{role.title}</h3>
                <MarkdownContent
                    content={role.description}
                    className="text-muted-foreground mb-2 text-sm leading-relaxed [&>p]:mb-0"
                />
                <p className="text-xs font-semibold text-[#2d7a81] dark:text-[#3a9da6]">
                    {role.commitment}
                </p>
            </div>
        </div>
    )
}
