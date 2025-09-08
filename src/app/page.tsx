import PlayerDashboard from '@/components/PlayerDashboard';
import { DashboardData, Account, RegionData, IndexData } from "@/lib/types";

// Fetches all player data from the GitHub repository when the page is first built.
async function getDashboardData(): Promise<DashboardData> {
  const regionMap: Record<string, string> = {
    'asia_pacific': 'asia_pacific',
    'europe': 'europe',
    'north_america': 'north_america',
    'south_america': 'south_america',
    'southeast_asia': 'southeast_asia',
    'korea': '엑스페리아'
  };

  const regionKeys = Object.keys(regionMap);
  const baseRepoUrl = 'https://raw.githubusercontent.com/Nan-Yin-s-Bedroom/tofgm-database/main';

  try {
    const [indexRes, ...regionResponses] = await Promise.all([
      fetch(`${baseRepoUrl}/index.json`),
      ...regionKeys.map(key => fetch(`${baseRepoUrl}/accounts/${regionMap[key]}/accounts.json`))
    ]);

    const indexData: IndexData = await indexRes.json();

    const allAccountsArrays = await Promise.all(
      regionResponses.map((res, i) => {
        if (res.ok) {
          return res.json().then((data: RegionData) =>
            Object.values(data.accounts).map(acc => ({ ...acc, server_region: regionKeys[i] }))
          );
        }
        return [];
      })
    );

    const allAccounts: Account[] = allAccountsArrays.flat();

    // Use a Map to filter out any duplicate players based on their role_id.
    const uniqueAccountsMap = new Map<number, Account>();
    allAccounts.forEach(account => {
      uniqueAccountsMap.set(account.role_id, account);
    });

    const processedAccounts = Array.from(uniqueAccountsMap.values());

    // We use the count of our processed list to ensure it's accurate.
    return {
      index: {
        ...indexData,
        total_accounts: processedAccounts.length
      },
      accounts: processedAccounts
    };

  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Return empty data if the fetch fails so the site doesn't crash.
    return { index: { total_accounts: 0, last_update: 0 }, accounts: [] };
  }
}

// This is the main page of the application.
export default async function Home() {
  const data = await getDashboardData();

  return (
    <PlayerDashboard initialData={data} />
  );
}