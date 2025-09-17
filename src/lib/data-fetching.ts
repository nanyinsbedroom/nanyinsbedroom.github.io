import { DashboardData, Account, RegionData, IndexData } from "@/lib/types";

export async function getDashboardData(): Promise<DashboardData> {
  const baseRepoUrl = 'https://raw.githubusercontent.com/nanyinsbedroom/tofgm-database/main';

  const regionEndpoints = [
    { key: 'asia_pacific',   url: `${baseRepoUrl}/accounts/asia_pacific/accounts.json` },
    { key: 'europe',         url: `${baseRepoUrl}/accounts/europe/accounts.json` },
    { key: 'north_america',  url: `${baseRepoUrl}/accounts/north_america/accounts.json` },
    { key: 'south_america',  url: `${baseRepoUrl}/accounts/south_america/accounts.json` },
    { key: 'southeast_asia', url: `${baseRepoUrl}/accounts/southeast_asia/accounts.json` },
    { key: 'korea',          url: 'https://raw.githubusercontent.com/nanyinsbedroom/tofgm-database/refs/heads/main/accounts/%C3%AC%E2%80%94%C2%90%C3%AC%C5%A0%C2%A4%C3%AD%C5%BD%CB%9C%C3%AB%C2%A6%C2%AC%C3%AC%E2%80%A2%E2%80%9E/accounts.json' },
    { key: 'china',          url: 'https://raw.githubusercontent.com/nanyinsbedroom/tofgm-database/main/accounts/%C3%A7%C2%8F%C2%AD%C3%A5%C2%90%E2%80%B0%C3%A6%E2%80%93%C2%AF/accounts.json' }
  ];

  try {
    const [indexRes, ...regionResponses] = await Promise.all([
      fetch(`${baseRepoUrl}/index.json`),
      ...regionEndpoints.map(endpoint => fetch(endpoint.url))
    ]);

    if (!indexRes.ok) throw new Error(`Failed to fetch index.json`);
    const indexData: IndexData = await indexRes.json();

    const allAccountsArrays = await Promise.all(
      regionResponses.map(async (res, i) => {
        const endpoint = regionEndpoints[i];
        if (res.ok) {
          const data: RegionData = await res.json();
          return Object.values(data.accounts).map(acc => ({ ...acc, server_region: endpoint.key }));
        }
        console.error(`Warning: Failed to fetch data for region: ${endpoint.key}`);
        return [];
      })
    );

    const allAccounts: Account[] = allAccountsArrays.flat();
    const uniqueAccountsMap = new Map<number, Account>();
    allAccounts.forEach(account => uniqueAccountsMap.set(account.role_id, account));
    let processedAccounts = Array.from(uniqueAccountsMap.values());

    const crewRegionCounts = new Map<string, Map<string, number>>();

    processedAccounts.forEach(account => {
      if (account.crew_name && account.crew_name !== 'N/A') {
        const trimmedCrewName = account.crew_name.trim(); // Trim whitespace
        if (!crewRegionCounts.has(trimmedCrewName)) {
          crewRegionCounts.set(trimmedCrewName, new Map());
        }
        const regionMap = crewRegionCounts.get(trimmedCrewName)!;
        regionMap.set(account.server_region, (regionMap.get(account.server_region) || 0) + 1);
      }
    });

    const primaryCrewRegions = new Map<string, string>();
    crewRegionCounts.forEach((regionMap, crewName) => {
      let majorityRegion = '';
      let maxCount = 0;
      regionMap.forEach((count, region) => {
        if (count > maxCount) {
          maxCount = count;
          majorityRegion = region;
        }
      });
      primaryCrewRegions.set(crewName, majorityRegion);
    });

    processedAccounts = processedAccounts.map(account => {
      if (account.crew_name && account.crew_name !== 'N/A') {
        const trimmedCrewName = account.crew_name.trim(); // Trim again for lookup
        if (primaryCrewRegions.has(trimmedCrewName)) {
          return { ...account, server_region: primaryCrewRegions.get(trimmedCrewName)! };
        }
      }
      return account;
    });

    const finalIndexData = { ...indexData, total_accounts: processedAccounts.length };

    return { index: finalIndexData, accounts: processedAccounts };
  } catch (error) {
    console.error("Error during server-side data fetch:", error);
    return { index: { total_accounts: 0, last_update: 0, regions: {} }, accounts: [] };
  }
}