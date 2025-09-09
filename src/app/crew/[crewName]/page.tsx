import { notFound } from 'next/navigation';
import { getDashboardData } from '@/lib/data-fetching';
import CrewProfile from '@/components/CrewProfile';

/**
 * Dynamically generates metadata for a specific crew page.
 */
export async function generateMetadata({ params }: { params: { crewName: string } }) {
  const crewName = decodeURIComponent(params.crewName);
  return {
    title: `${crewName} | Crew Profile`,
    description: `Detailed statistics and member roster for the crew: ${crewName}.`,
  };
}

/**
 * Server component for the dynamic crew profile page.
 * Fetches all data, filters for a specific crew, and renders the profile.
 */
export default async function CrewProfilePage({ params }: { params: { crewName: string } }) {
  const data = await getDashboardData();
  const crewName = decodeURIComponent(params.crewName);
  const crewMembers = data.accounts.filter(p => p.crew_name === crewName);

  if (crewMembers.length === 0) {
    notFound();
  }

  return <CrewProfile crewName={crewName} crewMembers={crewMembers} />;
}