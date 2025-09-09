import PlayerDashboard from '@/components/PlayerDashboard';
import { getDashboardData } from '@/lib/data-fetching';

/**
 * The main homepage component for the dashboard.
 * This is a server component that fetches the initial data before rendering.
 */
export default async function Home() {
  const data = await getDashboardData();
  return (
    <PlayerDashboard initialData={data} />
  );
}