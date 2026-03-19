import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { MarkdownEditor } from '../markdown-editor';

interface VolunteerRoleFieldsProps {
  data?: Record<string, unknown>;
}

export function VolunteerRoleFields({ data }: VolunteerRoleFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={(data?.title as string) ?? ''} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" name="icon" defaultValue={(data?.icon as string) ?? ''} required />
        </div>
      </div>

      <MarkdownEditor name="description" label="Description" value={(data?.description as string) ?? ''} />

      <div className="space-y-2">
        <Label htmlFor="commitment">Commitment</Label>
        <Input
          id="commitment"
          name="commitment"
          defaultValue={(data?.commitment as string) ?? ''}
          required
        />
      </div>
    </>
  );
}
