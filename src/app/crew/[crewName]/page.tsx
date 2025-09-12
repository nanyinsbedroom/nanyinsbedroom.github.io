import { notFound } from 'next/navigation';
import { getDashboardData } from '@/lib/data-fetching';
import CrewProfile from '@/components/CrewProfile';
import { Account } from '@/lib/types';

export async function generateMetadata({ params }: { params: { crewName: string } }) {
  const crewName = decodeURIComponent(params.crewName);
  return {
    title: `${crewName} | Crew Profile`,
    description: `Detailed statistics and member roster for the crew: ${crewName}.`,
  };
}

export default async function CrewProfilePage({ params }: { params: { crewName: string } }) {
  const data = await getDashboardData();
  const crewName = decodeURIComponent(params.crewName);
  const crewMembers = data.accounts.filter((p: Account) => p.crew_name === crewName);

  if (crewMembers.length === 0) {
    notFound();
  }

  return <CrewProfile crewName={crewName} crewMembers={crewMembers} />;
}