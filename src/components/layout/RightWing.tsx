'use client';

import { FaTimes } from 'react-icons/fa';
import styles from '@/styles/Layout.module.css';
import GenderChart from '../charts/GenderChart';
import RegistrationChart from '../charts/RegistrationChart';
import MonthlyActiveChart from '../charts/MonthlyActiveChart';
import ServerInformation from '../charts/ServerInformation';
import { Account } from '@/lib/types';

interface RightWingProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  filteredAccounts: Account[];
  monthlyActiveData: any[];
  serverData: any[];
  selectedRegion: string;
}

export default function RightWing({
  isMobile,
  isOpen,
  onClose,
  filteredAccounts,
  monthlyActiveData,
  serverData,
  selectedRegion
}: RightWingProps) {
  const content = (
    <div className={styles.chartsContainer}>
      {selectedRegion === 'All Regions' ? (
        <div className={styles.serverListScrollable}>
          <ServerInformation server={serverData} />
        </div>
      ) : (
        <ServerInformation server={serverData} />
      )}
      <GenderChart accounts={filteredAccounts} />
      <RegistrationChart accounts={filteredAccounts} />
      <MonthlyActiveChart data={monthlyActiveData} />
    </div>
  );

  if (isMobile) {
    return (
      <aside className={`${styles.mobileWing} ${styles.right} ${isOpen ? styles.open : ''}`}>
        <div className={styles.wingHeader}>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close visualizations"><FaTimes size={20} /></button>
        </div>
        <div className={styles.mobileWingScrollContent}>
          <div className={styles.wingContent}>{content}</div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${styles.wing} ${styles.rightWing}`}>
      {content}
    </aside>
  );
}