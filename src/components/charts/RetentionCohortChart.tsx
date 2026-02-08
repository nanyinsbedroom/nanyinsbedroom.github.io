'use client';

import styles from '@/styles/RetentionChart.module.css';
import { useTranslations } from '@/context/LanguageContext';

interface RetentionChartProps {
  onOpenModal: () => void;
}

export default function RetentionCohortChart({ onOpenModal }: RetentionChartProps) {
  const t = useTranslations('Charts');
  return (
    <div className={styles.chartCard}>
      <div className={styles.header}>
        <h3>{t('playerRetention')}</h3>
        <p>Analyze the long-term engagement of new player groups.</p>
      </div>
      <div className={styles.actionContainer}>
        <p className={styles.actionText}>
          View a detailed monthly breakdown of how long new players remain active after joining.
        </p>
        <button onClick={onOpenModal} className={styles.actionButton}>
          {t('viewReport')}
        </button>
      </div>
    </div>
  );
}