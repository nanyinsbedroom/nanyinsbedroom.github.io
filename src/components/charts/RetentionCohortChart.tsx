'use client';

import styles from '@/styles/RetentionChart.module.css';

interface RetentionChartProps {
  onOpenModal: () => void;
}

export default function RetentionCohortChart({ onOpenModal }: RetentionChartProps) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.header}>
        <h3>Player Retention by Cohort</h3>
        <p>Analyze the long-term engagement of new player groups.</p>
      </div>
      <div className={styles.actionContainer}>
        <p className={styles.actionText}>
          View a detailed monthly breakdown of how long new players remain active after joining.
        </p>
        <button onClick={onOpenModal} className={styles.actionButton}>
          View Detailed Report
        </button>
      </div>
    </div>
  );
}