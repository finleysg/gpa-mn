'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';

interface ArchiveButtonProps {
  title: string;
  entityName?: string;
  action: () => Promise<void>;
}

export function ArchiveButton({ title, entityName = 'item', action }: ArchiveButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Archive
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive {entityName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive &ldquo;{title}&rdquo;? It will no longer appear in the list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <form action={action}>
            <Button variant="destructive" type="submit">
              Archive
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
