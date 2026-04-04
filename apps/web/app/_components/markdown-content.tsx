import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
import { ExternalLink } from "lucide-react"

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
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
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
