import { Suspense } from 'react';
import PlayerDashboard from '@/components/PlayerDashboard';
import PlayerTableSkeleton from '@/components/skeletons/PlayerTableSkeleton';

export default function Home() {
  return (
    <Suspense fallback={<PlayerTableSkeleton />}>
      <PlayerDashboard />
    </Suspense>
  );
}