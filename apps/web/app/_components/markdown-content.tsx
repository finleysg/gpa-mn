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
        img: [...(defaultSchema.attributes?.img ?? []), "title"],
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

const ALIGN_CLASSES: Record<string, string> = {
    left: "float-left mr-5 mb-3 clear-left max-sm:float-none max-sm:mr-0 max-sm:mx-auto max-sm:block",
    right: "float-right ml-5 mb-3 clear-right max-sm:float-none max-sm:ml-0 max-sm:mx-auto max-sm:block",
    center: "block mx-auto my-4",
    none: "inline-block align-middle",
}

const SIZE_CLASSES: Record<string, string> = {
    small: "w-[180px]",
    medium: "w-[280px] max-sm:w-[220px]",
    large: "w-[420px] max-sm:w-full",
}

function parseImageTitle(title: string | null | undefined): { align: string; size: string } {
    const tokens = (title ?? "").toLowerCase().split(/\s+/).filter(Boolean)
    const align = tokens.find((t) => t in ALIGN_CLASSES) ?? "none"
    const size = tokens.find((t) => t in SIZE_CLASSES) ?? "medium"
    return { align, size }
}

export function MarkdownContent({ content, className }: { content: string; className?: string }) {
    return (
        <div className={`markdown-content overflow-auto ${className ?? ""}`}>
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
                    img({ src, alt, title }) {
                        if (!src) return null
                        const { align, size } = parseImageTitle(title)
                        const classes = `${ALIGN_CLASSES[align]} ${SIZE_CLASSES[size]} h-auto rounded-lg`
                        return (
                            <img
                                src={typeof src === "string" ? src : undefined}
                                alt={alt ?? ""}
                                className={classes}
                                loading="lazy"
                            />
                        )
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
