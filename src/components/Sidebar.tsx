'use client';

import TopCrewsByActivityChart from './charts/TopCrewsByActivityChart';
import { CrewActivity } from '@/lib/playerUtils';
import { formatRegionName } from '@/lib/formatters';
import styles from '@/styles/Sidebar.module.css';
import { useTranslations } from '@/context/LanguageContext';

interface SidebarProps {
  isMobile: boolean;
  totalPlayers: number;
  regions: string[];
  regionCounts: Record<string, number>;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  crewActivityData: CrewActivity[];
}

export default function Sidebar({
  isMobile,
  totalPlayers,
  regions,
  regionCounts,
  selectedRegion,
  onRegionChange,
  crewActivityData,
}: SidebarProps) {

  const sidebarClasses = `${styles.sidebar} ${isMobile ? styles.isMobile : ''}`;
  const t = useTranslations('Sidebar');
  return (
    <aside className={sidebarClasses}>
      <div className={styles.scrollableContent}>
        <div className={styles.card}>
          <h3>{t('totalPlayers')}</h3>
          <p className={styles.metric}>{totalPlayers.toLocaleString()}</p>
        </div>
        <div className={`${styles.card} ${styles.regionNav}`}>
          <h3>{t('regions')}</h3>
          <ul>
            {regions.map(region => (
              <li key={region}>
                <button
                  onClick={() => onRegionChange(region)}
                  className={selectedRegion === region ? styles.active : ''}
                >
                  <span>{formatRegionName(region)}</span>
                  <span className={styles.regionCount}>{regionCounts[region]?.toLocaleString() ?? '0'}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <TopCrewsByActivityChart data={crewActivityData} />
      </div>

    </aside>
  );
}