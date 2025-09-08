import { FaGithub, FaDiscord, FaEnvelope, FaTimes } from 'react-icons/fa';
import TopCrewsChart from './charts/TopCrewsChart';
import { formatRegionName } from '@/lib/formatters';
import styles from '@/styles/Sidebar.module.css';

const socialLinks = [
  { href: "https://github.com/nanyinsbedroom", icon: FaGithub, label: "Follow on GitHub" },
  { href: "https://discord.gg/Bs5cPKumFX", icon: FaDiscord, label: "Join our Discord" },
  { href: "mailto:soevielofficial@gmail.com", icon: FaEnvelope, label: "Contact Us" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  totalPlayers: number;
  regions: string[];
  regionCounts: Record<string, number>;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  topCrewsData: { name: string; players: number }[];
}

export default function Sidebar({
  isOpen,
  onClose,
  totalPlayers,
  regions,
  regionCounts,
  selectedRegion,
  onRegionChange,
  topCrewsData,
}: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2>Menu</h2>
        <button onClick={onClose} className={styles.closeButton} aria-label="Close menu">
          <FaTimes size={20} />
        </button>
      </div>

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
        <TopCrewsChart data={topCrewsData} />
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