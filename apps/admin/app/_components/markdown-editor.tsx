'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Markdown } from 'tiptap-markdown';
import { Bold, Italic, Strikethrough, Link as LinkIcon } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { Label } from '@repo/ui/components/label';
import { Switch } from '@repo/ui/components/switch';
import { Textarea } from '@repo/ui/components/textarea';
import type { Editor } from '@tiptap/react';

interface MarkdownEditorProps {
  name: string;
  label?: string;
  value: string;
  onChange?: (md: string) => void;
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded px-1.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white',
        active && 'bg-zinc-700 text-white',
      )}
    >
      {children}
    </button>
  );
}

function BubbleToolbar({ editor }: { editor: Editor }) {
  function handleLinkToggle() {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-zinc-900 px-1 py-1 shadow-lg">
      <ToolbarButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <div className="mx-0.5 h-5 w-px bg-zinc-700" />
      <ToolbarButton
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <div className="mx-0.5 h-5 w-px bg-zinc-700" />
      <ToolbarButton active={editor.isActive('link')} onClick={handleLinkToggle}>
        <LinkIcon className="size-4" />
      </ToolbarButton>
    </div>
  );
}

export function MarkdownEditor({ name, label, value, onChange }: MarkdownEditorProps) {
  const [markdownValue, setMarkdownValue] = useState(value);
  const [wysiwyg, setWysiwyg] = useState(true);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Markdown,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const md = (editor.storage as any).markdown.getMarkdown() as string;
      setMarkdownValue(md);
      onChange?.(md);
    },
  });

  function handleToggle(checked: boolean) {
    if (checked && editor) {
      editor.commands.setContent(markdownValue);
    }
    setWysiwyg(checked);
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
            <BubbleMenu editor={editor}>
              <BubbleToolbar editor={editor} />
            </BubbleMenu>
            <EditorContent
              editor={editor}
              className="border-input focus-within:border-ring focus-within:ring-ring/50 prose prose-sm min-h-50 max-w-none rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] [&_.tiptap:focus]:outline-none md:text-sm"
            />
          </>
        )
      ) : (
        <Textarea
          value={markdownValue}
          onChange={(e) => {
            setMarkdownValue(e.target.value);
            onChange?.(e.target.value);
          }}
          rows={12}
        />
      )}

      <input type="hidden" name={name} value={markdownValue} />
    </div>
  );
}
