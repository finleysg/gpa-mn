import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { MarkdownEditor } from '../markdown-editor';

interface AboutPageFieldsProps {
  data?: Record<string, unknown>;
}

export function AboutPageFields({ data }: AboutPageFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={(data?.title as string) ?? ''} required />
      </div>

      <MarkdownEditor name="body" label="Body" value={(data?.body as string) ?? ''} />
    </>
  );
}
