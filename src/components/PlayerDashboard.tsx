'use client';

import { useState, useMemo } from 'react';
import { DashboardData, Account } from '@/lib/types';
import styles from '@/styles/Dashboard.module.css';
import GenderChart from './GenderChart';
import RegistrationChart from './RegistrationChart';
import TopCrewsChart from './TopCrewsChart';
import LineChartComponent from './LineChartComponent';
import { FaGithub, FaDiscord, FaEnvelope } from 'react-icons/fa';

type SortConfig = { key: keyof Account; direction: 'asc' | 'desc' };

const regions = ['All Regions', 'asia_pacific', 'europe', 'north_america', 'south_america', 'southeast_asia', 'korea'];
const formatRegionName = (region: string) => region.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const PLAYER_PAGE_SIZE = 100;

const socialLinks = [
    { href: "https://github.com/soevielofficial", icon: FaGithub, label: "Follow on GitHub" },
    { href: "https://discord.com/users/442224069899976707", icon: FaDiscord, label: "Join our Discord" },
    { href: "mailto:soevielofficial@gmail.com", icon: FaEnvelope, label: "Contact Us" },
];

export default function PlayerDashboard({ initialData }: { initialData: DashboardData }) {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'registered', direction: 'desc' });
  const [visibleCount, setVisibleCount] = useState(PLAYER_PAGE_SIZE);

  // Memoize region counts for performance.
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Regions': initialData.index.total_accounts };
    regions.slice(1).forEach(region => {
        counts[region] = initialData.accounts.filter(acc => acc.server_region === region).length;
    });
    return counts;
  }, [initialData.accounts, initialData.index.total_accounts]);

  // Memoize filtered and sorted results to prevent recalculation on every render.
  const filteredAndSortedAccounts = useMemo(() => {
    let accounts = initialData.accounts;

    if (selectedRegion !== 'All Regions') {
      accounts = accounts.filter(acc => acc.server_region === selectedRegion);
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      accounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(lowerQuery) ||
        (acc.crew_name && acc.crew_name.toLowerCase().includes(lowerQuery)) ||
        acc.role_id.toString().includes(lowerQuery)
      );
    }

    accounts.sort((a, b) => {
      const aValue = new Date(a[sortConfig.key] as string).getTime();
      const bValue = new Date(b[sortConfig.key] as string).getTime();
      if (isNaN(aValue) || isNaN(bValue)) return 0; // Handle invalid dates.
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return accounts;
  }, [initialData.accounts, selectedRegion, searchQuery, sortConfig]);
  
  // Memoize top crews calculation.
  const topCrewsData = useMemo(() => {
    const crewCounts: { [key: string]: number } = {};
    filteredAndSortedAccounts.forEach(acc => {
      if (acc.crew_name && acc.crew_name !== "N/A") {
        if (!crewCounts[acc.crew_name]) crewCounts[acc.crew_name] = 0;
        crewCounts[acc.crew_name]++;
      }
    });
    return Object.entries(crewCounts)
      .map(([name, players]) => ({ name, players }))
      .sort((a, b) => b.players - a.players)
      .slice(0, 5);
  }, [filteredAndSortedAccounts]);

  // Memoize monthly active player calculation.
  const monthlyActiveData = useMemo(() => {
    if (initialData.accounts.length === 0) return [];
    const monthlyActivity = new Map<string, Set<number>>();
    initialData.accounts.forEach(acc => {
        const lastSeenDate = new Date(acc.last_seen * 1000);
        const monthKey = `${lastSeenDate.getFullYear()}-${String(lastSeenDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyActivity.has(monthKey)) { monthlyActivity.set(monthKey, new Set()); }
        monthlyActivity.get(monthKey)!.add(acc.role_id);
    });
    return Array.from(monthlyActivity.entries())
        .map(([date, players]) => ({ date, "Active Players": players.size }))
        .sort((a,b) => a.date.localeCompare(b.date));
  }, [initialData.accounts]);

  const handleSort = (direction: 'asc' | 'desc') => setSortConfig({ key: 'registered', direction });
  const handleFilterChange = (region: string) => { setSelectedRegion(region); setVisibleCount(PLAYER_PAGE_SIZE); }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div><h1>Player Dashboard</h1><p>Last Updated: {new Date(initialData.index.last_update * 1000).toLocaleString()}</p></div>
      </header>
      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.card}>
              <h3>Total Players</h3>
              <p className={styles.metric}>{initialData.index.total_accounts.toLocaleString()}</p>
            </div>
          </div>
          <div className={`${styles.sidebarSection} ${styles.sidebarScrollable}`}>
            <div className={`${styles.card} ${styles.regionNav}`}>
              <h3>Regions</h3>
              <ul>
                {regions.map(region => (
                  <li key={region}><button onClick={() => handleFilterChange(region)} className={selectedRegion === region ? styles.active : ''}><span>{formatRegionName(region)}</span><span className={styles.regionCount}>{regionCounts[region]?.toLocaleString()}</span></button></li>
                ))}
              </ul>
            </div>
            <TopCrewsChart data={topCrewsData} />
          </div>
          <div className={`${styles.sidebarSection} ${styles.sidebarFooter}`}>
            <div className={styles.socialCard}>
              {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={styles.socialButton}><Icon size={20} /><span>{label}</span></a>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.chartsGrid}>
            <GenderChart accounts={filteredAndSortedAccounts} />
            <RegistrationChart accounts={filteredAndSortedAccounts} />
          </div>
          <LineChartComponent data={monthlyActiveData} title="Monthly Active Players" dataKey="Active Players" lineColor="var(--accent-blue)" />
          <div className={styles.tableCard}>
            <div className={styles.controlsContainer}>
              <input type="text" placeholder="Search players in current view..." className={styles.searchInput} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <div className={styles.sortControls}>
                <button onClick={() => handleSort('desc')} className={`${styles.sortButton} ${sortConfig.direction === 'desc' ? styles.active : ''}`}>Newest</button>
                <button onClick={() => handleSort('asc')} className={`${styles.sortButton} ${sortConfig.direction === 'asc' ? styles.active : ''}`}>Oldest</button>
              </div>
            </div>
            <div className={styles.tableContainer}>
              <table>
                <thead><tr><th>Name</th><th>Crew</th><th>Role ID</th><th>Region</th><th>Registered</th><th>Last Seen</th></tr></thead>
                <tbody>
                  {filteredAndSortedAccounts.slice(0, visibleCount).map((player) => (
                    <tr key={player.role_id}>
                      <td>{player.name}</td><td>{player.crew_name || 'N/A'}</td><td>{player.role_id}</td><td>{formatRegionName(player.server_region)}</td><td>{new Date(player.registered).toLocaleString()}</td><td>{formatLastSeen(player.last_seen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.tableNote}>Showing {Math.min(visibleCount, filteredAndSortedAccounts.length)} of {filteredAndSortedAccounts.length} players.</div>
            {visibleCount < filteredAndSortedAccounts.length && (
                <div className={styles.loadMoreContainer}><button onClick={() => setVisibleCount(prev => prev + PLAYER_PAGE_SIZE)} className={styles.loadMoreButton}>Load More</button></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Formats the last seen timestamp into a relative string.
const formatLastSeen = (timestamp: number) => {
  const now = new Date();
  const lastSeenDate = new Date(timestamp * 1000);
  const diffInSeconds = (now.getTime() - lastSeenDate.getTime()) / 1000;
  const diffInDays = Math.floor(diffInSeconds / 86400);

  const timeString = lastSeenDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (diffInDays === 0) return `Today, ${timeString}`;
  if (diffInDays === 1) return `Yesterday, ${timeString}`;
  return `${diffInDays} days ago, ${timeString}`;
};