import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Textarea } from '@repo/ui/components/textarea';

interface SectionHeaderFieldsProps {
  data?: Record<string, unknown>;
}

export function SectionHeaderFields({ data }: SectionHeaderFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" name="label" defaultValue={(data?.label as string) ?? ''} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={(data?.title as string) ?? ''} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={(data?.location as string) ?? ''}
          placeholder="e.g. Homepage — Events section"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={(data?.description as string) ?? ''}
          rows={3}
        />
      </div>
    </>
  );
}
