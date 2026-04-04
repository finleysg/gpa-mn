"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table"
import { Markdown } from "tiptap-markdown"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    RemoveFormatting,
    Link as LinkIcon,
    ChevronDown,
    Check,
    Type,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    CodeSquare,
    Grid2x2,
    Columns3,
    Rows3,
    Trash2,
} from "lucide-react"
import { cn } from "@repo/ui/lib/utils"
import { Label } from "@repo/ui/components/label"
import { Switch } from "@repo/ui/components/switch"
import { Textarea } from "@repo/ui/components/textarea"
import { Popover, PopoverTrigger, PopoverContent } from "@repo/ui/components/popover"
import type { Editor } from "@tiptap/react"

interface MarkdownEditorProps {
    name: string
    label?: string
    value: string
    onChange?: (md: string) => void
}

function ToolbarButton({
    active,
    onClick,
    children,
}: {
    active?: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded px-1.5 py-1 text-xs font-medium transition-colors",
                active && "bg-accent text-accent-foreground",
            )}
        >
            {children}
        </button>
    )
}

const blockTypes = [
    {
        label: "Text",
        icon: Type,
        isActive: (e: Editor) => e.isActive("paragraph"),
        action: (e: Editor) => e.chain().focus().setParagraph().run(),
    },
    {
        label: "Heading 1",
        icon: Heading1,
        isActive: (e: Editor) => e.isActive("heading", { level: 1 }),
        action: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
        label: "Heading 2",
        icon: Heading2,
        isActive: (e: Editor) => e.isActive("heading", { level: 2 }),
        action: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        label: "Heading 3",
        icon: Heading3,
        isActive: (e: Editor) => e.isActive("heading", { level: 3 }),
        action: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
        label: "Bulleted list",
        icon: List,
        isActive: (e: Editor) => e.isActive("bulletList"),
        action: (e: Editor) => e.chain().focus().toggleBulletList().run(),
    },
    {
        label: "Numbered list",
        icon: ListOrdered,
        isActive: (e: Editor) => e.isActive("orderedList"),
        action: (e: Editor) => e.chain().focus().toggleOrderedList().run(),
    },
    {
        label: "Quote",
        icon: Quote,
        isActive: (e: Editor) => e.isActive("blockquote"),
        action: (e: Editor) => e.chain().focus().toggleBlockquote().run(),
    },
    {
        label: "Code block",
        icon: CodeSquare,
        isActive: (e: Editor) => e.isActive("codeBlock"),
        action: (e: Editor) => e.chain().focus().toggleCodeBlock().run(),
    },
    {
        label: "Table",
        icon: Grid2x2,
        isActive: (e: Editor) => e.isActive("table"),
        action: (e: Editor) =>
            e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
]

function BlockTypeDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false)
    const activeType = blockTypes.find((t) => t.isActive(editor)) ?? blockTypes[0]!

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium transition-colors"
                >
                    {activeType.label}
                    <ChevronDown className="size-3" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="start"
                sideOffset={8}
                className="bg-popover w-48 rounded-lg p-1"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                {blockTypes.map((type) => {
                    const Icon = type.icon
                    const active = type.isActive(editor)
                    return (
                        <button
                            key={type.label}
                            type="button"
                            onClick={() => {
                                type.action(editor)
                                setOpen(false)
                            }}
                            className={cn(
                                "text-popover-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors",
                                active && "text-accent-foreground",
                            )}
                        >
                            <Icon className="size-4" />
                            {type.label}
                            {active && <Check className="ml-auto size-4" />}
                        </button>
                    )
                })}
            </PopoverContent>
        </Popover>
    )
}

function TableToolbar({ editor }: { editor: Editor }) {
    return (
        <div className="bg-popover flex items-center gap-0.5 rounded-lg border px-1 py-1 shadow-md">
            <ToolbarButton onClick={() => editor.chain().focus().addColumnBefore().run()}>
                <Columns3 className="size-4" />
                <span className="sr-only">Add column before</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()}>
                <Columns3 className="size-4 scale-x-[-1]" />
                <span className="sr-only">Add column after</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().deleteColumn().run()}>
                <Columns3 className="text-destructive size-4" />
                <span className="sr-only">Delete column</span>
            </ToolbarButton>
            <div className="bg-border mx-0.5 h-5 w-px" />
            <ToolbarButton onClick={() => editor.chain().focus().addRowBefore().run()}>
                <Rows3 className="size-4" />
                <span className="sr-only">Add row before</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()}>
                <Rows3 className="size-4 scale-y-[-1]" />
                <span className="sr-only">Add row after</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().deleteRow().run()}>
                <Rows3 className="text-destructive size-4" />
                <span className="sr-only">Delete row</span>
            </ToolbarButton>
            <div className="bg-border mx-0.5 h-5 w-px" />
            <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()}>
                <Trash2 className="text-destructive size-4" />
                <span className="sr-only">Delete table</span>
            </ToolbarButton>
        </div>
    )
}

function BubbleToolbar({ editor }: { editor: Editor }) {
    function handleLinkToggle() {
        if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run()
            return
        }
        const url = window.prompt("Enter URL")
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
        }
    }

    return (
        <div className="bg-popover flex items-center gap-0.5 rounded-lg border px-1 py-1 shadow-md">
            <BlockTypeDropdown editor={editor} />
            <div className="bg-border mx-0.5 h-5 w-px" />
            <ToolbarButton
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <UnderlineIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive("code")}
                onClick={() => editor.chain().focus().toggleCode().run()}
            >
                <Code className="size-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                <RemoveFormatting className="size-4" />
            </ToolbarButton>
            <div className="bg-border mx-0.5 h-5 w-px" />
            <ToolbarButton active={editor.isActive("link")} onClick={handleLinkToggle}>
                <LinkIcon className="size-4" />
            </ToolbarButton>
        </div>
    )
}

export function MarkdownEditor({ name, label, value, onChange }: MarkdownEditorProps) {
    const [markdownValue, setMarkdownValue] = useState(value)
    const [wysiwyg, setWysiwyg] = useState(true)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Underline,
            Table.configure({ resizable: false }),
            TableRow,
            TableCell,
            TableHeader,
            Markdown,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const md = (editor.storage as any).markdown.getMarkdown() as string
            setMarkdownValue(md)
            onChange?.(md)
        },
    })

    function handleToggle(checked: boolean) {
        if (checked && editor) {
            editor.commands.setContent(markdownValue)
        }
        setWysiwyg(checked)
    }

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                {label && <Label>{label}</Label>}
                <div className="flex items-center gap-2">
                    <Label htmlFor="wysiwyg-toggle" className="text-secondary-foreground text-xs">
                        Markdown
                    </Label>
                    <Switch
                        id="wysiwyg-toggle"
                        checked={wysiwyg}
                        onCheckedChange={handleToggle}
                        className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                </div>
            </div>

            {wysiwyg ? (
                editor && (
                    <>
                        <BubbleMenu editor={editor} className="z-20">
                            {editor.isActive("table") ? (
                                <TableToolbar editor={editor} />
                            ) : (
                                <BubbleToolbar editor={editor} />
                            )}
                        </BubbleMenu>
                        <EditorContent
                            editor={editor}
                            className="border-input focus-within:border-ring focus-within:ring-ring/50 prose prose-sm min-h-50 max-w-none rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] md:text-sm [&_.tiptap:focus]:outline-none"
                        />
                    </>
                )
            ) : (
                <Textarea
                    value={markdownValue}
                    onChange={(e) => {
                        setMarkdownValue(e.target.value)
                        onChange?.(e.target.value)
                    }}
                    rows={12}
                />
            )}

            <input type="hidden" name={name} value={markdownValue} />
        </div>
    )
}
