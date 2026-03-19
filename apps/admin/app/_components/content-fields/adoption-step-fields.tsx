import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Textarea } from '@repo/ui/components/textarea';
import { StringListInput } from '../string-list-input';

interface AdoptionStepFieldsProps {
  data?: Record<string, unknown>;
}

export function AdoptionStepFields({ data }: AdoptionStepFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="step">Step Number</Label>
          <Input
            id="step"
            name="step"
            type="number"
            min={1}
            defaultValue={(data?.step as number) ?? ''}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" name="icon" defaultValue={(data?.icon as string) ?? ''} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={(data?.title as string) ?? ''} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={(data?.description as string) ?? ''}
          rows={3}
          required
        />
      </div>

      <StringListInput
        name="details"
        label="Details"
        defaultValue={(data?.details as string[]) ?? ['']}
      />
    </>
  );
}
