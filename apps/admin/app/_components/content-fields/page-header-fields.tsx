import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { MarkdownEditor } from '../markdown-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';

interface PageHeaderFieldsProps {
  data?: Record<string, unknown>;
}

export function PageHeaderFields({ data }: PageHeaderFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="badge">Badge</Label>
          <Input id="badge" name="badge" defaultValue={(data?.badge as string) ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="variant">Variant</Label>
          <Select name="variant" defaultValue={(data?.variant as string) ?? 'default'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={(data?.title as string) ?? ''} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="highlight">Highlight</Label>
        <Input
          id="highlight"
          name="highlight"
          defaultValue={(data?.highlight as string) ?? ''}
          placeholder="Word or phrase from the title to highlight"
        />
      </div>

      <MarkdownEditor name="description" label="Description" value={(data?.description as string) ?? ''} />

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={(data?.location as string) ?? ''}
          placeholder="e.g. Adopt — Hero"
        />
      </div>
    </>
  );
}
