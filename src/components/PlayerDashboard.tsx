'use client';

import { useState, useMemo, useEffect } from 'react';
import { DashboardData, Account, RegionData, IndexData } from '@/lib/types';
import { useMediaQuery } from '@/lib/useMediaQuery';
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

type SortConfig = { key: keyof Account | 'activity_status'; direction: 'asc' | 'desc'; };
const REGIONS = ['All Regions', 'asia_pacific', 'europe', 'north_america', 'south_america', 'southeast_asia', 'korea', 'china'];

export default function PlayerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({ 
    index: { total_accounts: 0, last_update: 0, regions: {} }, 
    accounts: [] 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);
  const { isLeftWingOpen, setIsLeftWingOpen, isRightWingOpen, setIsRightWingOpen } = useMobileMenu(); 
  const isMobile = useMediaQuery(1199);
  
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'registered', direction: 'desc' });
  const [activityFilter, setActivityFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [crewFilter, setCrewFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
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

        const [indexRes, ...regionResponses] = await Promise.all([
          fetch(`${baseRepoUrl}/index.json`),
          ...regionEndpoints.map(endpoint => fetch(endpoint.url))
        ]);

        const indexData: IndexData = await indexRes.json();
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
        
        const allAccounts = allAccountsArrays.flat();
        const uniqueAccountsMap = new Map<number, Account>();
        allAccounts.forEach(acc => uniqueAccountsMap.set(acc.role_id, acc));
        const processedAccounts = Array.from(uniqueAccountsMap.values());

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
    const years = new Set(dashboardData.accounts.map(acc => new Date(acc.registered).getFullYear().toString()));
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [dashboardData.accounts]);

  const filteredAccounts = useMemo(() => {
    let accountsToFilter = dashboardData.accounts;
    if (selectedRegion !== 'All Regions') { accountsToFilter = accountsToFilter.filter(acc => acc.server_region === selectedRegion); }
    if (selectedYear) { accountsToFilter = accountsToFilter.filter(acc => new Date(acc.registered).getFullYear().toString() === selectedYear); }
    if (activityFilter !== 'all') { accountsToFilter = accountsToFilter.filter(acc => getActivityStatus(acc.last_seen).status === activityFilter); }
    if (genderFilter !== 'all') { const genderValue = genderFilter === 'male' ? 0 : 1; accountsToFilter = accountsToFilter.filter(acc => acc.gender === genderValue); }
    if (crewFilter === 'in_crew') { accountsToFilter = accountsToFilter.filter(acc => acc.crew_name && acc.crew_name !== 'N/A'); }
    else if (crewFilter === 'no_crew') { accountsToFilter = accountsToFilter.filter(acc => !acc.crew_name || acc.crew_name === 'N/A'); }
    if (searchQuery.trim()) { const lowerQuery = searchQuery.toLowerCase(); accountsToFilter = accountsToFilter.filter(acc => acc.name.toLowerCase().includes(lowerQuery) || (acc.crew_name && acc.crew_name.toLowerCase().includes(lowerQuery)) || acc.role_id.toString().includes(searchQuery.trim())); }
    return accountsToFilter;
  }, [dashboardData.accounts, selectedRegion, selectedYear, searchQuery, activityFilter, genderFilter, crewFilter]);

  useEffect(() => { setCurrentPage(1); }, [filteredAccounts]);

  const sortedAccounts = useMemo(() => {
    return [...filteredAccounts].sort((a, b) => {
      let aValue: any, bValue: any;
      if (sortConfig.key === 'activity_status') { const statusOrder = { online: 0, recent: 1, inactive: 2, dormant: 3 }; aValue = statusOrder[getActivityStatus(a.last_seen).status as keyof typeof statusOrder]; bValue = statusOrder[getActivityStatus(b.last_seen).status as keyof typeof statusOrder]; }
      else if (sortConfig.key === 'registered' || sortConfig.key === 'last_seen') { aValue = new Date(a[sortConfig.key] as string).getTime(); bValue = new Date(b[sortConfig.key] as string).getTime(); }
      else { aValue = a[sortConfig.key]; bValue = b[sortConfig.key]; }
      if (typeof aValue === 'string') aValue = aValue.toLowerCase(); if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      return sortConfig.direction === 'asc' ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) : (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
    });
  }, [filteredAccounts, sortConfig]);

  const crewActivityData = useMemo(() => getCrewActivityScores(filteredAccounts), [filteredAccounts]);
  
  const monthlyActiveData = useMemo(() => {
    const activity = new Map<string, Set<number>>();
    dashboardData.accounts.forEach(acc => { const date = new Date(acc.last_seen * 1000); const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; if (!activity.has(key)) activity.set(key, new Set()); activity.get(key)!.add(acc.role_id); });
    return Array.from(activity.entries()).map(([date, players]) => ({ date, "Active Players": players.size })).sort((a,b) => a.date.localeCompare(b.date));
  }, [dashboardData.accounts]);

  const cohortData = useMemo(() => calculateRetentionCohorts(dashboardData.accounts), [dashboardData.accounts]);
  const averageRetention = useMemo(() => calculateAverageRetention(cohortData), [cohortData]);
  
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSearchQuery('');
    setSelectedYear(null);
    if (isMobile) setIsLeftWingOpen(false);
  };
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
          <div>
            <h1>Player Dashboard</h1>
            <p>Last Updated: {new Date(dashboardData.index.last_update * 1000).toLocaleString()}</p>
          </div>
          <div className={styles.headerActions}>
            {isMobile && (
              <>
                <button onClick={() => setIsLeftWingOpen(true)} className={styles.mobileWingButton} aria-label="Open menu"><FaBars /> Menu</button>
                <button onClick={() => setIsRightWingOpen(true)} className={styles.mobileWingButton} aria-label="Open charts"><FaChartBar /> Charts</button>
              </>
            )}
            <button onClick={handleRefresh} className={styles.refreshButton} aria-label="Refresh data"><FaSync /> Refresh</button>
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
              onSearch={setSearchQuery}
              sortConfig={sortConfig}
              onSort={setSortConfig}
              activityFilter={activityFilter}
              onActivityChange={setActivityFilter}
              genderFilter={genderFilter}
              onGenderChange={setGenderFilter}
              crewFilter={crewFilter}
              onCrewChange={setCrewFilter}
              availableYears={availableYears}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
            />
            <PlayerTable
              accounts={sortedAccounts}
              allAccounts={dashboardData.accounts}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
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