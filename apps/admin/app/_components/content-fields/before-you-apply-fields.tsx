import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { MarkdownEditor } from '../markdown-editor';

interface BeforeYouApplyFieldsProps {
  data?: Record<string, unknown>;
}

export function BeforeYouApplyFields({ data }: BeforeYouApplyFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" name="label" defaultValue={(data?.label as string) ?? ''} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={(data?.title as string) ?? ''} required />
      </div>

      <MarkdownEditor name="text" label="Text" value={(data?.text as string) ?? ''} />
    </>
  );
}
