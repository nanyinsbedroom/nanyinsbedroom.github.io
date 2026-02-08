'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { DashboardData, Account, RegionData, IndexData } from '@/lib/types';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useDebounce } from '@/lib/useDebounce';
import { getActivityStatus, getCrewActivityScores } from '@/lib/playerUtils';
import { getNewPlayersInLast, getMostActiveRegionToday, getFastestGrowingCrew, getAccountAgeExtremes } from '@/lib/insightsUtils';
import { calculateRetentionCohorts, calculateAverageRetention } from '@/lib/cohortUtils';
import WelcomeNote from './WelcomeNote';
import LeftWing from './layout/LeftWing';
import RightWing from './layout/RightWing';
import ControlPanel from './layout/ControlPanel';
import PlayerTable from './PlayerTable';
import DashboardInsights from './DashboardInsights';
import RetentionCohortChart from './charts/RetentionCohortChart';
import PlayerTableSkeleton from './skeletons/PlayerTableSkeleton';
import StatisticsModal from './StatisticsModal';
import { useMobileMenu } from '@/context/MobileMenuContext';
import { FaSync, FaBars, FaChartBar } from 'react-icons/fa';
import styles from '@/styles/Dashboard.module.css';
import layoutStyles from '@/styles/Layout.module.css';
import { useTranslations } from '@/context/LanguageContext';

// Helper function to handle multiple date formats
function parseAllDateFormats(dateInput: string | number): Date | null {
  if (typeof dateInput === 'string') {
    const chineseDateRegex = /(\d{4})年(\d{1,2})月(\d{1,2})日\s+(上午|下午)(\d{1,2}:\d{2}:\d{2})/;
    const match = dateInput.match(chineseDateRegex);
    if (match) {
      const [, year, month, day, period, time] = match;
      let [hours, minutes, seconds] = time.split(':').map(Number);
      if (period === '下午' && hours !== 12) hours += 12;
      if (period === '上午' && hours === 12) hours = 0;
      const isoString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      return new Date(isoString);
    } else {
      return new Date(dateInput.replace(' ', 'T'));
    }
  } else if (typeof dateInput === 'number') {
    return new Date(dateInput > 10000000000 ? dateInput : dateInput * 1000);
  }
  return null;
}

type SortConfig = { key: keyof Account | 'activity_status'; direction: 'asc' | 'desc'; };
const REGIONS = ['All Regions', 'asia_pacific', 'europe', 'north_america', 'south_america', 'southeast_asia', 'korea', 'PS_america', 'PS_east_asia', 'PS_europe', 'PS_southeast_asia','WS_asia_01','WS_america_01','WS_europe_01', '方舟演算', '重塑未来', '未来人类', '蔚色艾达', '时空回溯', '宇宙折跃'];
export default function PlayerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    index: { total_accounts: 0, last_update: 0, regions: {} },
    accounts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);
  const [serverData, setServerData] = useState<any>(null);
  const { isLeftWingOpen, setIsLeftWingOpen, isRightWingOpen, setIsRightWingOpen } = useMobileMenu();
  const isMobile = useMediaQuery(1199);
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derive filter state from URL search parameters
  const selectedRegion = searchParams.get('region') || 'All Regions';
  const selectedYear = searchParams.get('year') || null;
  const activityFilter = searchParams.get('activity') || 'all';
  const genderFilter = searchParams.get('gender') || 'all';
  const crewFilter = searchParams.get('crew') || 'all';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortConfig: SortConfig = {
    key: (searchParams.get('sortKey') as keyof Account | 'activity_status') || 'registered',
    direction: (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc',
  };

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const updateUrlParams = (newParams: Record<string, string | null | undefined>) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });
    if (!('page' in newParams)) {
      currentParams.set('page', '1');
    }

    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  };

  const handleSearch = (query: string) => setSearchQuery(query);
  useEffect(() => {
    if (debouncedSearchQuery !== (searchParams.get('q') || '')) {
      updateUrlParams({ q: debouncedSearchQuery });
    }
  }, [debouncedSearchQuery, searchParams]);

  const handleRegionChange = (region: string) => {
    updateUrlParams({ region: region === 'All Regions' ? null : region, year: null });
    if (isMobile) setIsLeftWingOpen(false);
  };
  const handleSelectYear = (year: string | null) => updateUrlParams({ year });
  const handleActivityChange = (status: string) => updateUrlParams({ activity: status === 'all' ? null : status });
  const handleGenderChange = (gender: string) => updateUrlParams({ gender: gender === 'all' ? null : gender });
  const handleCrewChange = (status: string) => updateUrlParams({ crew: status === 'all' ? null : status });
  const handlePageChange = (page: number) => updateUrlParams({ page: page.toString() });
  const handleSort = (config: SortConfig) => updateUrlParams({ sortKey: config.key, sortDir: config.direction });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
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
          { key: 'WS_asia_01', url: `${baseRepoUrl}/accounts/ws_asia_01/accounts.json` },
          { key: 'WS_america_01', url: `${baseRepoUrl}/accounts/ws_america_01/accounts.json` },
          { key: 'WS_europe_01', url: `${baseRepoUrl}/accounts/ws_europe_01/accounts.json` },
          { key: '方舟演算', url: `${baseRepoUrl}/accounts/ark_calculus/accounts.json` },
          { key: '重塑未来', url: `${baseRepoUrl}/accounts/reshaping_the_future/accounts.json` },
          { key: '未来人类', url: `${baseRepoUrl}/accounts/future_humanity/accounts.json` },
          { key: '蔚色艾达', url: `${baseRepoUrl}/accounts/visser_aida/accounts.json` },
          { key: '时空回溯', url: `${baseRepoUrl}/accounts/time_travel/accounts.json` },
          { key: '宇宙折跃', url: `${baseRepoUrl}/accounts/cosmic_fold/accounts.json` }
        ];

        const [indexRes, serversRes, ...regionResponses] = await Promise.all([
          fetch(`${baseRepoUrl}/index.json`),
          fetch(`${baseRepoUrl}/server.json`),
          ...regionEndpoints.map(endpoint => fetch(endpoint.url))
        ]);

        const indexData: IndexData = await indexRes.json();

        const serversJson = serversRes.ok ? await serversRes.json() : null;
        setServerData(serversJson);

        const allAccountsArrays = await Promise.all(
          regionResponses.map(async (res, i) => {
            const endpoint = regionEndpoints[i];
            if (res.ok) {
              const data: RegionData = await res.json();
              return Object.values(data.accounts).map(acc => ({ ...acc, server_region: endpoint.key }));
            }
            return [];
          })
        );

        let processedAccounts = allAccountsArrays.flat();

        const crewRegionCounts = new Map<string, Map<string, number>>();

        processedAccounts.forEach(account => {
          if (account.crew_name && account.crew_name !== 'N/A') {
            const trimmedCrewName = account.crew_name.trim();
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

        setDashboardData({
          index: { ...indexData, total_accounts: processedAccounts.length },
          accounts: processedAccounts
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data on client:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const insights = useMemo(() => ({
    newPlayers: getNewPlayersInLast(dashboardData.accounts, 7),
    activeRegion: getMostActiveRegionToday(dashboardData.accounts),
    topCrew: getFastestGrowingCrew(dashboardData.accounts),
    ageExtremes: getAccountAgeExtremes(dashboardData.accounts),
  }), [dashboardData.accounts]);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Regions': dashboardData.index.total_accounts || 0 };
    REGIONS.slice(1).forEach(region => {
      counts[region] = dashboardData.accounts.filter(acc => acc.server_region === region).length;
    });
    return counts;
  }, [dashboardData.accounts, dashboardData.index.total_accounts]);

  const availableYears = useMemo(() => {
    const years = new Set(
      dashboardData.accounts
        .map(acc => {
          const date = parseAllDateFormats(acc.registered);
          return date && !isNaN(date.getTime()) ? date.getFullYear().toString() : null;
        })
        .filter((year): year is string => year !== null)
    );
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [dashboardData.accounts]);

  const filteredAccounts = useMemo(() => {
    let accountsToFilter = dashboardData.accounts;
    if (selectedRegion !== 'All Regions') { accountsToFilter = accountsToFilter.filter(acc => acc.server_region === selectedRegion); }
    if (selectedYear) {
      accountsToFilter = accountsToFilter.filter(acc => {
        const date = parseAllDateFormats(acc.registered);
        return date && !isNaN(date.getTime()) && date.getFullYear().toString() === selectedYear;
      });
    }
    if (activityFilter !== 'all') { accountsToFilter = accountsToFilter.filter(acc => getActivityStatus(acc.last_seen).status === activityFilter); }
    if (genderFilter !== 'all') { const genderValue = genderFilter === 'male' ? 0 : 1; accountsToFilter = accountsToFilter.filter(acc => acc.gender === genderValue); }
    if (crewFilter === 'in_crew') { accountsToFilter = accountsToFilter.filter(acc => acc.crew_name && acc.crew_name !== 'N/A'); }
    else if (crewFilter === 'no_crew') { accountsToFilter = accountsToFilter.filter(acc => !acc.crew_name || acc.crew_name === 'N/A'); }

    if (debouncedSearchQuery.trim()) {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      accountsToFilter = accountsToFilter.filter(acc =>
        acc.name.toLowerCase().includes(lowerQuery) ||
        (acc.crew_name && acc.crew_name.toLowerCase().includes(lowerQuery)) ||
        acc.role_id.toString().includes(debouncedSearchQuery.trim())
      );
    }
    return accountsToFilter;
  }, [dashboardData.accounts, selectedRegion, selectedYear, debouncedSearchQuery, activityFilter, genderFilter, crewFilter]);

  const sortedAccounts = useMemo(() => {
    return [...filteredAccounts].sort((a, b) => {
      let aValue: any, bValue: any;
      if (sortConfig.key === 'activity_status') {
        const statusOrder = { online: 0, recent: 1, inactive: 2, dormant: 3 };
        aValue = statusOrder[getActivityStatus(a.last_seen).status as keyof typeof statusOrder];
        bValue = statusOrder[getActivityStatus(b.last_seen).status as keyof typeof statusOrder];
      }
      else if (sortConfig.key === 'registered' || sortConfig.key === 'last_seen') {
        aValue = parseAllDateFormats(a[sortConfig.key] as string)?.getTime() ?? 0;
        bValue = parseAllDateFormats(b[sortConfig.key] as string)?.getTime() ?? 0;
      }
      else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      return sortConfig.direction === 'asc' ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) : (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
    });
  }, [filteredAccounts, sortConfig]);

  const crewActivityData = useMemo(() => getCrewActivityScores(filteredAccounts), [filteredAccounts]);

  const monthlyActiveData = useMemo(() => {
    const activity = new Map<string, Set<number>>();
    dashboardData.accounts.forEach(acc => { const date = new Date(acc.last_seen); const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; if (!activity.has(key)) activity.set(key, new Set()); activity.get(key)!.add(acc.role_id); });
    return Array.from(activity.entries()).map(([date, players]) => ({ date, "Active Players": players.size })).sort((a, b) => a.date.localeCompare(b.date));
  }, [dashboardData.accounts]);

  const cohortData = useMemo(() => calculateRetentionCohorts(dashboardData.accounts), [dashboardData.accounts]);
  const averageRetention = useMemo(() => calculateAverageRetention(cohortData), [cohortData]);

  const handleRefresh = () => window.location.reload();

  return (
    <div className={styles.pageContainer}>
      <div
        className={`${layoutStyles.overlay} ${(isLeftWingOpen || isRightWingOpen) && isMobile ? layoutStyles.visible : ''}`}
        onClick={() => { setIsLeftWingOpen(false); setIsRightWingOpen(false); }}
      />

      <LeftWing
        isMobile={isMobile}
        isOpen={isLeftWingOpen}
        onClose={() => setIsLeftWingOpen(false)}
        totalPlayers={dashboardData.index.total_accounts}
        regions={REGIONS}
        regionCounts={regionCounts}
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
        crewActivityData={crewActivityData}
      />

      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <div className={styles.headerActions}>
            {isMobile && (
              <>
                <button onClick={() => setIsLeftWingOpen(true)} className={styles.mobileWingButton} aria-label="Open menu"><FaBars />{t('menu')}</button>
                <button onClick={() => setIsRightWingOpen(true)} className={styles.mobileWingButton} aria-label="Open charts"><FaChartBar />{t('charts')}</button>
              </>
            )}
            <button onClick={handleRefresh} className={styles.refreshButton} aria-label="Refresh data"><FaSync /> {t('refresh')}</button>
          </div>
        </div>
        {isLoading ? (
          <PlayerTableSkeleton />
        ) : (
          <>
            <WelcomeNote />
            <DashboardInsights
              newPlayers={insights.newPlayers}
              activeRegion={insights.activeRegion}
              topCrew={insights.topCrew}
              ageExtremes={insights.ageExtremes}
            />
            <RetentionCohortChart onOpenModal={() => setIsCohortModalOpen(true)} />
            <ControlPanel
              searchQuery={searchQuery}
              onSearch={handleSearch}
              sortConfig={sortConfig}
              onSort={handleSort}
              activityFilter={activityFilter}
              onActivityChange={handleActivityChange}
              genderFilter={genderFilter}
              onGenderChange={handleGenderChange}
              crewFilter={crewFilter}
              onCrewChange={handleCrewChange}
              availableYears={availableYears}
              selectedYear={selectedYear}
              onSelectYear={handleSelectYear}
            />
            <PlayerTable
              accounts={sortedAccounts}
              allAccounts={dashboardData.accounts}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      <RightWing
        isMobile={isMobile}
        isOpen={isRightWingOpen}
        onClose={() => setIsRightWingOpen(false)}
        filteredAccounts={filteredAccounts}
        monthlyActiveData={monthlyActiveData}
        serverData={getServersForRegion(serverData, selectedRegion)}
        selectedRegion={selectedRegion}
      />

      {isCohortModalOpen && (
        <StatisticsModal
          isOpen={isCohortModalOpen}
          onClose={() => setIsCohortModalOpen(false)}
          data={cohortData}
          averageRetention={averageRetention}
        />
      )}
    </div>
  );
}

function getServersForRegion(serverData: any, selectedRegion: string) {
  if (!serverData) return [];
  
  const regionMap: Record<string, string[]> = {
    'asia_pacific': ['Asia Pacific'],
    'europe': ['Europe'],
    'north_america': ['North America'],
    'south_america': ['South America'],
    'southeast_asia': ['Southeast Asia'],
    'korea': ['Korea'],
    'PS_america': ['PS-America'],
    'PS_east_asia': ['PS-East Asia'],
    'PS_europe': ['PS-Europe'],
    'PS_southeast_asia': ['PS-Southeast Asia'],
    'WS_asia_01': ['WS-Asia-01'],
    'WS_america_01': ['WS-America-01'],
    'WS_europe_01': ['WS-Europe-01'],
    '方舟演算': ['方舟演算'],
    '重塑未来': ['重塑未来'],
    '未来人类': ['未来人类'],
    '蔚色艾达': ['蔚色艾达'],
    '时空回溯': ['时空回溯'],
    '宇宙折跃': ['宇宙折跃'],
  };

  if (selectedRegion === 'All Regions') {
    return Object.entries(serverData)
      .map(([name, info]) => ({
        name,
        ...(typeof info === 'object' && info !== null ? info : {})
      }));
  }

  const keys = regionMap[selectedRegion] || [];
  return keys
    .map(key => {
      const serverInfo = serverData[key];
      if (!serverInfo) return null;
      
      return {
        name: key,
        ...(typeof serverInfo === 'object' && serverInfo !== null ? serverInfo : {})
      };
    })
    .filter(Boolean);
}