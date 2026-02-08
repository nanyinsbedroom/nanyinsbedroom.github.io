import { DashboardData, Account, RegionData, IndexData } from "@/lib/types";

export async function getDashboardData(): Promise<DashboardData> {
  const baseRepoUrl = 'https://raw.githubusercontent.com/nanyinsbedroom/tofgm-database/main';

  const regionEndpoints = [
    { key: 'asia_pacific', url: `${baseRepoUrl}/accounts/asia_pacific/accounts.json` },
    { key: 'europe', url: `${baseRepoUrl}/accounts/europe/accounts.json` },
    { key: 'north_america', url: `${baseRepoUrl}/accounts/north_america/accounts.json` },
    { key: 'south_america', url: `${baseRepoUrl}/accounts/south_america/accounts.json` },
    { key: 'southeast_asia', url: `${baseRepoUrl}/accounts/southeast_asia/accounts.json` },
    { key: 'korea', url: `${baseRepoUrl}/accounts/korea/accounts.json` },
    { key: 'PS_america', url: `${baseRepoUrl}/accounts/ps_america/accounts.json` },
    { key: 'PS_east_asia', url: `${baseRepoUrl}/accounts/ps_east_asia/accounts.json` },
    { key: 'PS_europe', url: `${baseRepoUrl}/accounts/ps_europe/accounts.json` },
    { key: 'PS_southeast_asia', url: `${baseRepoUrl}/accounts/ps_southeast_asia/accounts.json` },
    { key: '方舟演算', url: `${baseRepoUrl}/accounts/ark_calculus/accounts.json` },
    { key: '重塑未来', url: `${baseRepoUrl}/accounts/reshaping_the_future/accounts.json` },
    { key: '未来人类', url: `${baseRepoUrl}/accounts/future_humanity/accounts.json` },
    { key: '蔚色艾达', url: `${baseRepoUrl}/accounts/visser_aida/accounts.json` },
    { key: '时空回溯', url: `${baseRepoUrl}/accounts/time_travel/accounts.json` },
    { key: '宇宙折跃', url: `${baseRepoUrl}/accounts/cosmic_fold/accounts.json` }
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
          return Object.values(data.accounts).map(acc => ({
            ...acc,
            server_region: endpoint.key
          }));
        }
        console.error(`Warning: Failed to fetch data for region: ${endpoint.key}`);
        return [];
      })
    );

    const allAccounts: Account[] = allAccountsArrays.flat();
    const uniqueAccountsMap = new Map<number, Account>();
    allAccounts.forEach(account => uniqueAccountsMap.set(account.role_id, account));

    let processedAccounts = Array.from(uniqueAccountsMap.values()).map(account => {
      if (account.crew_name) {
        return { ...account, crew_name: account.crew_name.trim() };
      }
      return account;
    });

    const crewRegionCounts = new Map<string, Map<string, number>>();

    processedAccounts.forEach(account => {
      if (account.crew_name && account.crew_name !== 'N/A') {
        if (!crewRegionCounts.has(account.crew_name)) {
          crewRegionCounts.set(account.crew_name, new Map());
        }
        const regionMap = crewRegionCounts.get(account.crew_name)!;
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
        if (primaryCrewRegions.has(account.crew_name)) {
          return { ...account, server_region: primaryCrewRegions.get(account.crew_name)! };
        }
      }
      return account;
    });

    const finalIndexData = { ...indexData, total_accounts: processedAccounts.length };

    return {
      index: finalIndexData,
      accounts: processedAccounts,
    };
  } catch (error) {
    console.error("Error during server-side data fetch:", error);
    return {
      index: { total_accounts: 0, last_update: 0, regions: {} },
      accounts: []
    };
  }
}