'use client';

import { useMemo } from 'react';
import { Account } from '@/lib/types';
import { getRegionalActivitySummary } from '@/lib/playerUtils';
import { formatRegionName } from '@/lib/formatters';
import styles from '@/styles/RegionalActivity.module.css';

interface RegionActivityData {
  online: number;
  recent: number;
  inactive: number;
  dormant: number;
  total: number;
}

interface RegionalActivitySummaryProps {
  accounts: Account[];
}

export default function RegionalActivitySummary({ accounts }: RegionalActivitySummaryProps) {
  const regionalSummary = useMemo(() => getRegionalActivitySummary(accounts), [accounts]);

  const totalStats = useMemo(() => {
    const totals: RegionActivityData = { online: 0, recent: 0, inactive: 0, dormant: 0, total: 0 };
    
    Object.values(regionalSummary).forEach((regionData: RegionActivityData) => {
      totals.online += regionData.online;
      totals.recent += regionData.recent;
      totals.inactive += regionData.inactive;
      totals.dormant += regionData.dormant;
      totals.total += regionData.total;
    });
    
    return totals;
  }, [regionalSummary]);

  const getActivityPercentage = (count: number, total: number) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className={styles.card}>
      <h3>Regional Activity Overview</h3>
      
      {/* Global Summary */}
      <div className={styles.globalSummary}>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.onlineColor}`}>
            {totalStats.online}
          </span>
          <span className={styles.statLabel}>Online</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.recentColor}`}>
            {totalStats.recent}
          </span>
          <span className={styles.statLabel}>Recent</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.inactiveColor}`}>
            {totalStats.inactive}
          </span>
          <span className={styles.statLabel}>Inactive</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.dormantColor}`}>
            {totalStats.dormant}
          </span>
          <span className={styles.statLabel}>Dormant</span>
        </div>
      </div>

      {/* Regional Breakdown */}
      <div className={styles.regionList}>
        {Object.entries(regionalSummary)
          .sort(([, a], [, b]: [string, RegionActivityData]) => 
            (b.online + b.recent) - (a.online + a.recent)
          )
          .map(([region, data]: [string, RegionActivityData]) => (
          <div key={region} className={styles.regionItem}>
            <div className={styles.regionHeader}>
              <span className={styles.regionName}>{formatRegionName(region)}</span>
              <span className={styles.regionTotal}>{data.total} players</span>
            </div>
            <div className={styles.activityBar}>
              <div 
                className={`${styles.activitySegment} ${styles.onlineSegment}`}
                style={{ 
                  width: `${getActivityPercentage(data.online, data.total)}%`
                }}
                title={`${data.online} online (${getActivityPercentage(data.online, data.total)}%)`}
              />
              <div 
                className={`${styles.activitySegment} ${styles.recentSegment}`}
                style={{ 
                  width: `${getActivityPercentage(data.recent, data.total)}%`
                }}
                title={`${data.recent} recent (${getActivityPercentage(data.recent, data.total)}%)`}
              />
              <div 
                className={`${styles.activitySegment} ${styles.inactiveSegment}`}
                style={{ 
                  width: `${getActivityPercentage(data.inactive, data.total)}%`
                }}
                title={`${data.inactive} inactive (${getActivityPercentage(data.inactive, data.total)}%)`}
              />
            </div>
            <div className={styles.activityStats}>
              <span className={styles.onlineColor}>{data.online}</span>
              <span className={styles.recentColor}>{data.recent}</span>
              <span className={styles.inactiveColor}>{data.inactive}</span>
              <span className={styles.dormantColor}>{data.dormant}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
