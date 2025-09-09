'use client';

import AdvancedFilters from '../AdvancedFilters';
import YearFilter from '../YearFilter';
import styles from '@/styles/PlayerTable.module.css';
import { Account } from '@/lib/types';

type SortConfig = { key: keyof Account | 'activity_status'; direction: 'asc' | 'desc'; };

interface ControlPanelProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  sortConfig: SortConfig;
  onSort: (config: SortConfig) => void;
  activityFilter: string;
  onActivityChange: (status: string) => void;
  genderFilter: string;
  onGenderChange: (gender: string) => void;
  crewFilter: string;
  onCrewChange: (status: string) => void;
  availableYears: string[];
  selectedYear: string | null;
  onSelectYear: (year: string | null) => void;
}

export default function ControlPanel(props: ControlPanelProps) {
  const handleSort = (key: keyof Account | 'activity_status') => {
    const direction =
      props.sortConfig.key === key && props.sortConfig.direction === 'desc' ? 'asc' : 'desc';
    props.onSort({ key, direction });
  };

  return (
    <div className={styles.card}>
      <div className={styles.controlsContainer}>
        <input
          type="text"
          placeholder="Search players or crews..."
          value={props.searchQuery}
          onChange={(e) => props.onSearch(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.filterToolbar}>
          <AdvancedFilters
            activityFilter={props.activityFilter}
            onActivityChange={props.onActivityChange}
            genderFilter={props.genderFilter}
            onGenderChange={props.onGenderChange}
            crewFilter={props.crewFilter}
            onCrewChange={props.onCrewChange}
          />
          <YearFilter
            years={props.availableYears}
            selectedYear={props.selectedYear}
            onSelectYear={props.onSelectYear}
          />
          <div className={styles.sortControls}>
            <button
              onClick={() => handleSort('registered')}
              className={`${styles.sortButton} ${props.sortConfig.key === 'registered' ? styles.active : ''}`}
            >
              Newest {props.sortConfig.key === 'registered' && (props.sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('last_seen')}
              className={`${styles.sortButton} ${props.sortConfig.key === 'last_seen' ? styles.active : ''}`}
            >
              Last Seen {props.sortConfig.key === 'last_seen' && (props.sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}