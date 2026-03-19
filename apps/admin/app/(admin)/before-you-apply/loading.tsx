import { TableSkeleton } from '@/app/_components/table-skeleton';

export default function Loading() {
  return <TableSkeleton title="Before You Apply" columns={2} />;
}
