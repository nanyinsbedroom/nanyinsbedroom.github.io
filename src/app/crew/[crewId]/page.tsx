import { notFound } from 'next/navigation';
import { getDashboardData } from '@/lib/data-fetching';
import CrewProfile from '@/components/CrewProfile';
import { Account } from '@/lib/types';

export async function generateStaticParams() {
  const data = await getDashboardData();
  
  const crewIds = new Set(
    data.accounts
      .map((p: Account) => p.crew_id)
      .filter(id => id && id !== 0)
  );

  return Array.from(crewIds).map(id => ({
    crewId: id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: { crewId: string } }) {
  const crewId = parseInt(params.crewId);
  if (isNaN(crewId)) return {};

  const data = await getDashboardData();
  const representativeMember = data.accounts.find((p: Account) => p.crew_id === crewId);
  const crewName = representativeMember ? representativeMember.crew_name : 'Crew';

  return {
    title: `${crewName} | Crew Profile`,
    description: `Detailed statistics and member roster for the crew: ${crewName}.`,
  };
}

export default async function CrewProfilePage({ params }: { params: { crewId: string } }) {
  const crewId = parseInt(params.crewId);
  if (isNaN(crewId)) {
    notFound();
  }

  const data = await getDashboardData();
  const crewMembers = data.accounts.filter((p: Account) => p.crew_id === crewId);

  if (crewMembers.length === 0) {
    notFound();
  }
  
  const crewName = crewMembers[0].crew_name;
  
  return <CrewProfile crewName={crewName} crewUid={crewId} crewMembers={crewMembers} />;
}