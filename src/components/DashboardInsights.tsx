'use client';

import { FaUserPlus, FaGlobeAmericas, FaAward } from 'react-icons/fa';
import Link from 'next/link';
import { formatRegionName } from '@/lib/formatters';
import { AccountAgeInfo } from '@/lib/insightsUtils';
import styles from '@/styles/Insights.module.css';

interface InsightsProps {
  newPlayers: number;
  activeRegion: string;
  topCrew: string;
  ageExtremes: {
    oldest: AccountAgeInfo;
    newest: AccountAgeInfo;
  } | null;
}

export default function DashboardInsights({ newPlayers, activeRegion, topCrew, ageExtremes }: InsightsProps) {
  return (
    <div className={styles.insightsGrid}>
      <div className={styles.primaryCard}>
        <div className={styles.primaryValue}>
          <FaUserPlus className={styles.primaryIcon} />
          <span>+{newPlayers.toLocaleString()}</span>
        </div>
        <p className={styles.primaryLabel}>New players in the last week</p>
      </div>

      <div className={styles.stackedCard}>
        {ageExtremes && (
          <>
            <div className={styles.stackedItem}>
              <span className={`${styles.stackedValue} ${styles.oldest}`}>
                {ageExtremes.oldest.ageInDays.toLocaleString()} days
              </span>
              <span className={styles.stackedLabel}>Oldest Account</span>
              <span className={styles.playerNameLink}>
                {ageExtremes.oldest.account.name}
              </span>
            </div>
            <div className={styles.stackedItem}>
              <span className={`${styles.stackedValue} ${styles.newest}`}>
                {ageExtremes.newest.ageInDays.toLocaleString()} days
              </span>
              <span className={styles.stackedLabel}>Newest Account</span>
              <span className={styles.playerNameLink}>
                {ageExtremes.newest.account.name}
              </span>
            </div>
          </>
        )}
      </div>

      <div className={styles.stackedCard}>
        <div className={styles.stackedItem}>
          <div className={styles.leaderboardItem}>
            <FaGlobeAmericas className={styles.leaderboardIcon} style={{ color: 'var(--accent-green)' }} />
            <div className={styles.leaderboardContent}>
              <h3>{formatRegionName(activeRegion)}</h3>
              <p>Most active region today</p>
            </div>
          </div>
        </div>
        <div className={styles.stackedItem}>
          <div className={styles.leaderboardItem}>
            <FaAward className={styles.leaderboardIcon} style={{ color: 'var(--accent-orange)' }} />
            <div className={styles.leaderboardContent}>
              <h3>{topCrew}</h3>
              <p>Fastest-growing crew this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}