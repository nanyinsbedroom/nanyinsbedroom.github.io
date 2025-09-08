import { NextResponse } from 'next/server';
import { DashboardData, Account, RegionData, IndexData } from "@/lib/types";

// This function fetches the latest data from the source.
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
    // Adding { cache: 'no-store' } ensures you get the latest data every time.
    const [indexRes, ...regionResponses] = await Promise.all([
      fetch(`${baseRepoUrl}/index.json`, { cache: 'no-store' }),
      ...regionKeys.map(key => fetch(`${baseRepoUrl}/accounts/${regionMap[key]}/accounts.json`, { cache: 'no-store' }))
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
    const uniqueAccountsMap = new Map<number, Account>();
    allAccounts.forEach(account => {
      uniqueAccountsMap.set(account.role_id, account);
    });

    const processedAccounts = Array.from(uniqueAccountsMap.values());

    return {
      index: {
        ...indexData,
        total_accounts: processedAccounts.length
      },
      accounts: processedAccounts
    };

  } catch (error) {
    console.error("Failed to fetch dashboard data in API route:", error);
    return { index: { total_accounts: 0, last_update: 0 }, accounts: [] };
  }
}

// This is the actual API route handler.
export async function GET() {
  const data = await getDashboardData();
  return NextResponse.json(data);
}