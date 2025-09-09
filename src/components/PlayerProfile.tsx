'use client';

import Link from 'next/link';
import { Account } from '@/lib/types';
import { getCrewMemberCount, getActivityStatus } from '@/lib/playerUtils';
import { formatRegionName, formatRelativeDate } from '@/lib/formatters';
import { FaArrowLeft, FaUser, FaUsers, FaGlobe, FaVenusMars, FaCalendarCheck, FaClock } from 'react-icons/fa';
import styles from '@/styles/PlayerProfile.module.css';

interface PlayerProfileProps {
  player: Account;
  allAccounts: Account[];
}

export default function PlayerProfile({ player, allAccounts }: PlayerProfileProps) {
  const crewMemberCount = getCrewMemberCount(allAccounts, player.crew_name);
  const activityStatus = getActivityStatus(player.last_seen);

  return (
    <div className={styles.profileContainer}>
      <Link href="/" className={styles.backLink}>
        <FaArrowLeft />
        Back to Dashboard
      </Link>

      <header className={styles.header}>
        <h1 className={styles.playerName}>{player.name}</h1>
        <p className={styles.roleId}>ID: #{player.role_id}</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}><FaUsers /> Crew</p>
          <div className={styles.crewValue}>
            {player.crew_name && player.crew_name !== 'N/A' ? (
              <>
                <span className={styles.crewName}>{player.crew_name}</span>
                <span className={styles.crewMembers}>{crewMemberCount} members</span>
              </>
            ) : (
              <span className={styles.statValue}>N/A</span>
            )}
          </div>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}><FaUser /> Status</p>
          <span className={styles.statValue} style={{ color: activityStatus.color }}>
            {activityStatus.label}
          </span>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}><FaGlobe /> Region</p>
          <span className={styles.statValue}>{formatRegionName(player.server_region)}</span>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}><FaVenusMars /> Gender</p>
          <span className={styles.statValue}>{player.gender === 0 ? 'Male' : 'Female'}</span>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}><FaCalendarCheck /> Registered</p>
          <span className={styles.statValue}>{formatRelativeDate(player.registered)}</span>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}><FaClock /> Last Seen</p>
          <span className={styles.statValue}>{formatRelativeDate(player.last_seen * 1000)}</span>
        </div>
      </div>
    </div>
  );
}