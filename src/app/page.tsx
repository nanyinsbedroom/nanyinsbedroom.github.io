import PlayerDashboard from "@/components/PlayerDashboard";
import { DashboardData, Account, RegionData, IndexData } from "@/lib/types";
import styles from "@/styles/Home.module.css";

// Fetches all necessary data from remote sources on the server.
async function getDashboardData(): Promise<DashboardData> {
  const regionMap: Record<string, string> = {
    'asia_pacific': 'asia_pacific',
    'europe': 'europe',
    'north_america': 'north_america',
    'south_america': 'south_america',
    'southeast_asia': 'southeast_asia',
    'korea': 'ì— ìŠ¤íŽ˜ë¦¬ì•„' // URL-encoded folder name for the Korean server
  };

  const regionKeys = Object.keys(regionMap);
  const baseRepoUrl = 'https://raw.githubusercontent.com/Nan-Yin-s-Bedroom/tofgm-database/main';

  try {
    // Fetch index file and all region files in parallel for performance.
    const [indexRes, ...regionResponses] = await Promise.all([
      fetch(`${baseRepoUrl}/index.json`),
      ...regionKeys.map(key => fetch(`${baseRepoUrl}/accounts/${regionMap[key]}/accounts.json`))
    ]);

    const indexData: IndexData = await indexRes.json();
    
    let allAccounts: Account[] = [];
    for (let i = 0; i < regionKeys.length; i++) {
      if (regionResponses[i].ok) {
        const regionData: RegionData = await regionResponses[i].json();
        const accountsWithRegion = Object.values(regionData.accounts).map(acc => ({
          ...acc,
          server_region: regionKeys[i] // Use the clean key (e.g., 'korea')
        }));
        allAccounts.push(...accountsWithRegion);
      }
    }
    
    // Pass the original indexData directly to preserve the official total.
    return { index: indexData, accounts: allAccounts };

  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Return empty data on failure to prevent crashing.
    return { index: { total_accounts: 0, last_update: 0 }, accounts: [] };
  }
}

export default async function Home() {
  const data = await getDashboardData();
  
  return (
    <main className={styles.main}>
      <PlayerDashboard initialData={data} />
    </main>
  );
}