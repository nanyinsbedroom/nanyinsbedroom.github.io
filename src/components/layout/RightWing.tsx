'use client';

import { FaTimes } from 'react-icons/fa';
import styles from '@/styles/Layout.module.css';
import GenderChart from '../charts/GenderChart';
import RegistrationChart from '../charts/RegistrationChart';
import MonthlyActiveChart from '../charts/MonthlyActiveChart';
import { Account } from '@/lib/types';

interface RightWingProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  filteredAccounts: Account[];
  monthlyActiveData: any[];
}

export default function RightWing({ isMobile, isOpen, onClose, filteredAccounts, monthlyActiveData }: RightWingProps) {
  const content = (
    <div className={styles.chartsContainer}>
      <GenderChart accounts={filteredAccounts} />
      <RegistrationChart accounts={filteredAccounts} />
      <MonthlyActiveChart data={monthlyActiveData} />
    </div>
  );

  if (isMobile) {
    return (
      <aside className={`${styles.mobileWing} ${styles.right} ${isOpen ? styles.open : ''}`}>
        <div className={styles.wingHeader}>
          <h3 className={styles.wingTitle}>Visualizations</h3>
          <button onClick={onClose} className={styles.closeButton}><FaTimes size={20} /></button>
        </div>
        <div className={styles.wingContent}>{content}</div>
      </aside>
    );
  }

  return (
    <aside className={`${styles.wing} ${styles.rightWing}`}>
      {content}
    </aside>
  );
}