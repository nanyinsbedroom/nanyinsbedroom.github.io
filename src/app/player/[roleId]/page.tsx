// import { notFound } from 'next/navigation';
// import { Account } from "@/lib/types";
// import { getDashboardData } from '@/lib/data-fetching';
// import PlayerProfile from '@/components/PlayerProfile';

// export async function generateStaticParams() {
//   const data = await getDashboardData();
//   return data.accounts.map((account: Account) => ({ roleId: account.role_id.toString() }));
// }

// export async function generateMetadata({ params }: { params: { roleId: string } }) {
//   const data = await getDashboardData();
//   const player = data.accounts.find((p: Account) => p.role_id.toString() === params.roleId);
//   const playerName = player ? player.name : 'Player Not Found';

//   return {
//     title: `${playerName} | Player Profile`,
//     description: `Detailed statistics for player ${playerName} (ID: ${params.roleId}).`,
//   };
// }

// export default async function PlayerProfilePage({ params }: { params: { roleId: string } }) {
//   const data = await getDashboardData();
//   const player = data.accounts.find((p: Account) => p.role_id.toString() === params.roleId);

//   if (!player) {
//     notFound();
//   }

//   return <PlayerProfile player={player} allAccounts={data.accounts} />;
// }