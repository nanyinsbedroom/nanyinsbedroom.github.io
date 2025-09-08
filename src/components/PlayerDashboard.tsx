'use client';

import { useState, useMemo, useEffect } from 'react';
import { DashboardData, Account } from '@/lib/types';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { getActivityStatus } from '@/lib/playerUtils';
import Sidebar from './Sidebar';
import PlayerTable from './PlayerTable';
// import RegionalActivitySummary from './RegionalActivitySummary'; // No longer needed
import GenderChart from './charts/GenderChart';
import RegistrationChart from './charts/RegistrationChart';
import MonthlyActiveChart from './charts/MonthlyActiveChart';
import { FaBars, FaSync } from 'react-icons/fa';
import styles from '@/styles/Dashboard.module.css';

type SortConfig = { 
  key: keyof Account | 'activity_status'; 
  direction: 'asc' | 'desc' 
};

const REGIONS = ['All Regions', 'asia_pacific', 'europe', 'north_america', 'south_america', 'southeast_asia', 'korea'];

export default function PlayerDashboard({ initialData }: { initialData: DashboardData }) {
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialData);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'registered', direction: 'desc' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery(1023);

  useEffect(() => {
    const refreshData = async () => {
      try {
        const response = await fetch('/api/get-dashboard-data');
        if (response.ok) {
          const latestData: DashboardData = await response.json();
          setDashboardData(latestData);
        }
      } catch (error) {
        console.error("Error during auto-refresh:", error);
      }
    };
    const intervalId = setInterval(refreshData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Regions': dashboardData.index.total_accounts };
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

    if (selectedRegion !== 'All Regions') {
      accountsToFilter = accountsToFilter.filter(acc => acc.server_region === selectedRegion);
    }
    if (selectedYear) {
      accountsToFilter = accountsToFilter.filter(acc => new Date(acc.registered).getFullYear().toString() === selectedYear);
    }
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      accountsToFilter = accountsToFilter.filter(acc =>
        acc.name.toLowerCase().includes(lowerQuery) ||
        (acc.crew_name && acc.crew_name.toLowerCase().includes(lowerQuery)) ||
        acc.role_id.toString().includes(searchQuery.trim())
      );
    }
    return accountsToFilter;
  }, [dashboardData.accounts, selectedRegion, selectedYear, searchQuery]);

  const sortedAccounts = useMemo(() => {
    return [...filteredAccounts].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === 'activity_status') {
        const statusOrder = { online: 0, recent: 1, inactive: 2, dormant: 3 };
        aValue = statusOrder[getActivityStatus(a.last_seen).status as keyof typeof statusOrder];
        bValue = statusOrder[getActivityStatus(b.last_seen).status as keyof typeof statusOrder];
      } else if (sortConfig.key === 'registered') {
        aValue = new Date(a.registered).getTime();
        bValue = new Date(b.registered).getTime();
      } else if (sortConfig.key === 'last_seen') {
        aValue = a.last_seen;
        bValue = b.last_seen;
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      return sortConfig.direction === 'asc' 
        ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
        : (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
    });
  }, [filteredAccounts, sortConfig]);

  const topCrewsData = useMemo(() => {
    const crewCounts: { [key: string]: number } = {};
    filteredAccounts.forEach(acc => {
      if (acc.crew_name && acc.crew_name !== "N/A") {
        crewCounts[acc.crew_name] = (crewCounts[acc.crew_name] || 0) + 1;
      }
    });
    return Object.entries(crewCounts)
      .map(([name, players]) => ({ name, players }))
      .sort((a, b) => b.players - a.players)
      .slice(0, 5);
  }, [filteredAccounts]);

  const monthlyActiveData = useMemo(() => {
    const activity = new Map<string, Set<number>>();
    dashboardData.accounts.forEach(acc => {
      const date = new Date(acc.last_seen * 1000);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!activity.has(key)) activity.set(key, new Set());
      activity.get(key)!.add(acc.role_id);
    });
    return Array.from(activity.entries())
      .map(([date, players]) => ({ date, "Active Players": players.size }))
      .sort((a,b) => a.date.localeCompare(b.date));
  }, [dashboardData.accounts]);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSearchQuery('');
    setSelectedYear(null);
    if (isMobile) setSidebarOpen(false);
  };

  const handleRefresh = () => window.location.reload();

  return (
    <div className={styles.dashboard}>
      {isMobile && (
        <div className={styles.mobileHeader}>
          <h1>Player Dashboard</h1>
          <div className={styles.headerActions}>
            <button onClick={handleRefresh} className={styles.refreshButton}><FaSync /> Refresh Data</button>
            <button onClick={() => setSidebarOpen(true)} className={styles.mobileMenuButton}><FaBars /> Menu</button>
          </div>
        </div>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        totalPlayers={dashboardData.index.total_accounts}
        regions={REGIONS}
        regionCounts={regionCounts}
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
        topCrewsData={topCrewsData}
      />

      <div className={styles.mainContent}>
        {!isMobile && (
          <div className={styles.desktopHeader}>
            <div>
              <h1>Player Dashboard</h1>
              <p>Last Updated: {new Date(dashboardData.index.last_update * 1000).toLocaleString()}</p>
            </div>
            <button onClick={handleRefresh} className={styles.refreshButton}><FaSync /> Refresh Data</button>
          </div>
        )}
        
        {/* --- Regional Activity Component has been REMOVED from here --- */}

        <div className={styles.chartsGrid}>
          <GenderChart accounts={filteredAccounts} />
          <RegistrationChart accounts={filteredAccounts} />
          <MonthlyActiveChart data={monthlyActiveData} />
        </div>

        <div className={styles.playerTableWrapper}>
          <PlayerTable
            accounts={sortedAccounts}
            allAccounts={dashboardData.accounts}
            sortConfig={sortConfig}
            onSort={setSortConfig}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            availableYears={availableYears}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
          />
        </div>
      </div>
    </div>
  );
}