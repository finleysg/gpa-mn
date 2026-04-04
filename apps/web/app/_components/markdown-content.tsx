import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkDirective from "remark-directive"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import { ExternalLink } from "lucide-react"
import { remarkAdmonition } from "../_lib/remark-admonition"

const sanitizeSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        div: [
            ...(defaultSchema.attributes?.div ?? []),
            ["dataAdmonition", ""],
            ["dataType", "note", "warning", "tip", "danger"],
            "className",
        ],
    },
}

function isExternal(href: string | undefined): boolean {
    if (!href) return false
    try {
        const url = new URL(href, "https://gpamn.org")
        return url.origin !== "https://gpamn.org"
    } catch {
        return false
    }
}

export function MarkdownContent({ content, className }: { content: string; className?: string }) {
    return (
        <div className={`markdown-content ${className ?? ""}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkDirective, remarkAdmonition]}
                rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
                components={{
                    a({ href, children }) {
                        if (isExternal(href)) {
                            return (
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                    {children}
                                    <ExternalLink className="mb-0.5 ml-1 inline size-3.5 align-middle" />
                                </a>
                            )
                        }
                        return <a href={href}>{children}</a>
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
