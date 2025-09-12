'use client';

import TopCrewsByActivityChart from './charts/TopCrewsByActivityChart';
import { CrewActivity } from '@/lib/playerUtils';
import { formatRegionName } from '@/lib/formatters';
import styles from '@/styles/Sidebar.module.css';
import { FaGithub, FaDiscord, FaEnvelope } from 'react-icons/fa';

const socialLinks = [
  { href: "https://github.com/nanyinsbedroom", icon: FaGithub, label: "Follow Us" }, 
  { href: "https://discord.gg/Bs5cPKumFX", icon: FaDiscord, label: "Join Our Community" }, 
  { href: "mailto:soevielofficial@gmail.com", icon: FaEnvelope, label: "Contact" },
];

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

  return (
    <aside className={sidebarClasses}>
      <div className={styles.scrollableContent}>
        <div className={styles.card}>
          <h3>Total Players</h3>
          <p className={styles.metric}>{totalPlayers.toLocaleString()}</p>
        </div>
        <div className={`${styles.card} ${styles.regionNav}`}>
          <h3>Regions</h3>
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

      <div className={styles.socialCard}>
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
            <Icon size={18} />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}