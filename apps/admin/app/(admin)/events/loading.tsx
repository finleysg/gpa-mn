import { TableSkeleton } from '@/app/_components/table-skeleton';

export default function Loading() {
  return <TableSkeleton title="Events" columns={4} />;
}
