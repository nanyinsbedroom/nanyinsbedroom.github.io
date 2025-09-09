import { notFound } from 'next/navigation';
import { Account } from "@/lib/types";
import { getDashboardData } from '@/lib/data-fetching';
import PlayerProfile from '@/components/PlayerProfile';

/**
 * Dynamically generates metadata for a specific player page.
 */
export async function generateMetadata({ params }: { params: { roleId: string } }) {
  const data = await getDashboardData();
  const player = data.accounts.find((p: Account) => p.role_id.toString() === params.roleId);
  const playerName = player ? player.name : 'Player Not Found';

  return {
    title: `${playerName} | Player Profile`,
    description: `Detailed statistics for player ${playerName} (ID: ${params.roleId}).`,
  };
}

/**
 * Server component for the dynamic player profile page.
 * Fetches all data, finds a specific player, and renders the profile.
 */
export default async function PlayerProfilePage({ params }: { params: { roleId: string } }) {
  const data = await getDashboardData();
  const player = data.accounts.find((p: Account) => p.role_id.toString() === params.roleId);

  if (!player) {
    notFound();
  }

  return <PlayerProfile player={player} allAccounts={data.accounts} />;
}