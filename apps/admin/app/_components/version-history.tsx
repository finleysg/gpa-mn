'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { Badge } from '@repo/ui/components/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import type { contentVersions } from '@repo/database';

type ContentVersion = typeof contentVersions.$inferSelect;

interface VersionHistoryProps {
  versions: ContentVersion[];
  currentVersion: number;
  revertAction: (targetVersionId: number) => Promise<void>;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function RevertButton({
  version,
  revertAction,
}: {
  version: ContentVersion;
  revertAction: (targetVersionId: number) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Revert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revert to version {version.version}</DialogTitle>
          <DialogDescription>
            This will create a new version with the data from version {version.version}. The current
            version will be preserved in the history.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <form action={() => revertAction(version.id)}>
            <Button type="submit">Revert</Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function VersionHistory({
  versions,
  currentVersion,
  revertAction,
}: VersionHistoryProps) {
  if (versions.length === 0) {
    return <p className="text-sm text-muted-foreground">No version history.</p>;
  }

  return (
    <div className="max-w-2xl space-y-4">
      {versions.map((version) => {
        const isCurrent = version.version === currentVersion;

        return (
          <div
            key={version.id}
            className="flex items-start justify-between rounded-lg border p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={isCurrent ? 'default' : 'secondary'}>v{version.version}</Badge>
                {isCurrent && (
                  <Badge variant="outline" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {version.createdBy} &middot; {formatDate(version.createdAt)}
              </p>
              {version.changeNote && (
                <p className="text-sm italic">{version.changeNote}</p>
              )}
            </div>
            {!isCurrent && (
              <RevertButton
                version={version}
                revertAction={revertAction}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
