'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Account } from '@/lib/types';
import { getActivityStatus } from '@/lib/playerUtils';
import { formatRegionName, formatRelativeDate } from '@/lib/formatters';
import { FaArrowLeft, FaUsers, FaChartLine, FaGlobe } from 'react-icons/fa';
import styles from '@/styles/CrewProfile.module.css';

interface CrewProfileProps {
  crewName: string;
  crewUid: number;
  crewMembers: Account[];
}

type SortConfig = {
  key: keyof Account | 'activity_status';
  direction: 'asc' | 'desc';
};

export default function CrewProfile({ crewName, crewUid, crewMembers }: CrewProfileProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'last_seen', direction: 'desc' });
  
  const router = useRouter();

  const crewStats = useMemo(() => {
    let totalDaysSinceSeen = 0;
    const regionCounts: Record<string, number> = {};

    crewMembers.forEach(member => {
      const daysSince = (Date.now() - (member.last_seen)) / (1000 * 60 * 60 * 24);
      totalDaysSinceSeen += daysSince;
      regionCounts[member.server_region] = (regionCounts[member.server_region] || 0) + 1;
    });

    const activityScore = totalDaysSinceSeen / crewMembers.length;
    const primaryRegion = Object.keys(regionCounts).length > 0
      ? Object.entries(regionCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : 'N/A';

    return { activityScore, primaryRegion };
  }, [crewMembers]);

  const sortedMembers = useMemo(() => {
    return [...crewMembers].sort((a, b) => {
      let aValue: any, bValue: any;
      if (sortConfig.key === 'activity_status') {
        const statusOrder = { online: 0, recent: 1, inactive: 2, dormant: 3 };
        aValue = statusOrder[getActivityStatus(a.last_seen).status as keyof typeof statusOrder];
        bValue = statusOrder[getActivityStatus(b.last_seen).status as keyof typeof statusOrder];
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      return sortConfig.direction === 'asc'
        ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
        : (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
    });
  }, [crewMembers, sortConfig]);
  
  const handleSort = (key: keyof Account | 'activity_status') => {
    const direction = sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    setSortConfig({ key, direction });
  };

  return (
    <div className={styles.profileContainer}>
      <button onClick={() => router.back()} className={styles.backLink}>
        <FaArrowLeft /> Back to Dashboard
      </button>
      
      <header className={styles.header}>
        <h1 className={styles.crewName}>{crewName}</h1>
        <span className={styles.crewUid}>#{crewUid}</span>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}><FaUsers /> Total Members</p>
          <span className={styles.statValue}>{crewMembers.length}</span>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}><FaChartLine /> Activity Score</p>
          <span className={styles.statValue}>{crewStats.activityScore.toFixed(1)}</span>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}><FaGlobe /> Primary Region</p>
          <span className={styles.statValue}>{formatRegionName(crewStats.primaryRegion)}</span>
        </div>
      </div>

      <div className={styles.rosterContainer}>
        <h2 className={styles.rosterHeader}>Member Roster</h2>
        <table className={styles.memberTable}>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name</th>
              <th onClick={() => handleSort('activity_status')}>Status</th>
              <th onClick={() => handleSort('last_seen')}>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {sortedMembers.map((member) => {
              const status = getActivityStatus(member.last_seen);
              return (
                <tr key={member.role_id}>
                  <td>
                    {member.name}
                  </td>
                  <td style={{ color: status.color }}>{status.label}</td>
                  <td>{formatRelativeDate(member.last_seen)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}