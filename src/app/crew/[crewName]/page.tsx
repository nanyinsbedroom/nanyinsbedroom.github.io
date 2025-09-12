import { notFound } from 'next/navigation';
import { getDashboardData } from '@/lib/data-fetching';
import CrewProfile from '@/components/CrewProfile';
import { Account } from '@/lib/types';

// This function tells Next.js which crew pages to build
export async function generateStaticParams() {
  const data = await getDashboardData();
  
  // Get a list of all unique crew names
  const crewNames = new Set(
    data.accounts
      .map((p: Account) => p.crew_name)
      .filter(name => name && name !== 'N/A') // Filter out empty or N/A names
  );

  // Create an array of objects, where each object has a `crewName` key
  return Array.from(crewNames).map(name => ({
    crewName: encodeURIComponent(name), // Important for names with spaces
  }));
}

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