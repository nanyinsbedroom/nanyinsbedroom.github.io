'use client';

import { useState, useEffect } from 'react';
import { Account } from '@/lib/types';
import { formatRelativeDate, formatRegionName } from '@/lib/formatters';
// The 'getActivityStatus' import is no longer needed in the main component body
import { getCrewMemberCount, getActivityStatus } from '@/lib/playerUtils'; 
import YearFilter from './YearFilter';
import styles from '@/styles/PlayerTable.module.css';

const PAGE_SIZE = 50;

type SortConfig = { 
  key: keyof Account | 'activity_status'; 
  direction: 'asc' | 'desc' 
};

interface PlayerTableProps {
  accounts: Account[];
  sortConfig: SortConfig;
  onSort: (config: SortConfig) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  availableYears: string[];
  selectedYear: string | null;
  onSelectYear: (year: string | null) => void;
  allAccounts: Account[];
}

export default function PlayerTable({
  accounts,
  sortConfig,
  onSort,
  searchQuery,
  onSearch,
  availableYears,
  selectedYear,
  onSelectYear,
  allAccounts,
}: PlayerTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [accounts]);

  const handleSort = (key: keyof Account | 'activity_status') => {
    const direction = 
      sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    onSort({ key, direction });
  };

  const visibleAccounts = accounts.slice(0, visibleCount);

  return (
    <div className={styles.card}>
      <div className={styles.controlsContainer}>
        <input
          type="text"
          placeholder="Search players or crews..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className={styles.searchInput}
        />
        
        <div className={styles.filterToolbar}>
          <YearFilter 
            years={availableYears}
            selectedYear={selectedYear}
            onSelectYear={onSelectYear}
          />

          <div className={styles.sortControls}>
            <button
              onClick={() => handleSort('registered')}
              className={`${styles.sortButton} ${sortConfig.key === 'registered' ? styles.active : ''}`}
            >
              Newest {sortConfig.key === 'registered' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('last_seen')}
              className={`${styles.sortButton} ${sortConfig.key === 'last_seen' ? styles.active : ''}`}
            >
              Last Seen {sortConfig.key === 'last_seen' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Crew</th>
              <th>Region</th>
              {/* --- "Status" Header REMOVED --- */}
              <th>Registered</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {visibleAccounts.map((player) => {
              // This calculation is no longer needed here
              // const activityStatus = getActivityStatus(player.last_seen);
              const crewMemberCount = getCrewMemberCount(allAccounts, player.crew_name);
              
              return (
                <tr key={player.role_id}>
                  <td>
                    <div className={styles.playerName}>
                      {player.name}
                      <span className={styles.roleId}>#{player.role_id}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.crewInfo}>
                      {player.crew_name && player.crew_name !== 'N/A' ? (
                        <>
                          <span className={styles.crewName}>{player.crew_name}</span>
                          <span className={styles.memberCount}>({crewMemberCount} members)</span>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </td>
                  <td>{formatRegionName(player.server_region)}</td>
                  
                  {/* --- "Status" TD Column REMOVED --- */}
                  
                  <td>{formatRelativeDate(player.registered)}</td>
                  <td>{formatRelativeDate(player.last_seen * 1000)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <p className={styles.note}>
          Showing {Math.min(visibleCount, accounts.length)} of {accounts.length.toLocaleString()} players
        </p>
        {visibleCount < accounts.length && (
          <button
            onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
            className={styles.loadMoreButton}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}