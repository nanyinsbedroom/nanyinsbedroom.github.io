'use client';

import { FaTimes } from 'react-icons/fa';
import styles from '@/styles/Layout.module.css';
import Sidebar from '../Sidebar';
import { CrewActivity } from '@/lib/playerUtils';

interface LeftWingProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  totalPlayers: number;
  regions: string[];
  regionCounts: Record<string, number>;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  crewActivityData: CrewActivity[];
}

export default function LeftWing({ isMobile, isOpen, onClose, ...sidebarProps }: LeftWingProps) {
  if (isMobile) {
    return (
      <aside className={`${styles.mobileWing} ${styles.left} ${isOpen ? styles.open : ''}`}>
        <div className={styles.wingHeader}>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close menu"><FaTimes size={20} /></button>
        </div>
        <div className={styles.mobileWingScrollContent}> {/* Added a new div for scrollable content */}
          <Sidebar {...sidebarProps} isMobile={isMobile} />
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${styles.wing} ${styles.leftWing}`}>
      <Sidebar {...sidebarProps} isMobile={isMobile} />
    </aside>
  );
}