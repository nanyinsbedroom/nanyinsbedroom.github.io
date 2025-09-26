'use client';

import Link from 'next/link';
import { Account } from '@/lib/types';
import { formatRelativeDate, formatRegionName } from '@/lib/formatters';
import { getCrewMemberCount } from '@/lib/playerUtils';
import Pagination from './Pagination';
import styles from '@/styles/PlayerTable.module.css';

const PAGE_SIZE = 50;

interface PlayerTableProps {
  accounts: Account[];
  allAccounts: Account[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function PlayerTable({
  accounts,
  allAccounts,
  currentPage,
  onPageChange,
}: PlayerTableProps) {
  
  const totalPages = Math.ceil(accounts.length / PAGE_SIZE);
  const paginatedAccounts = accounts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const startRange = (currentPage - 1) * PAGE_SIZE + 1;
  const endRange = Math.min(currentPage * PAGE_SIZE, accounts.length);

  return (
    <div className={styles.card}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Crew</th>
              <th>Region</th>
              <th>Registered</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAccounts.map((player) => {
              const crewMemberCount = getCrewMemberCount(allAccounts, player.crew_name);
              return (
                <tr key={player.role_id}>

                  <td data-label="Name">
                    <div className={styles.playerName}>
                      {player.name}
                      <span className={styles.roleId}>#{player.role_id}</span>
                    </div>
                  </td>
                  <td data-label="Crew">
                    <div className={styles.crewInfo}>
                      {player.crew_name && player.crew_name !== 'N/A' ? (
                        <>
                          <Link href={`/crew/${player.crew_id}`} className={styles.crewLink}>
                            <span className={styles.crewName}>{player.crew_name}</span>
                          </Link>
                          <span className={styles.memberCount}>({crewMemberCount} members)</span>
                        </>
                      ) : ('N/A')}
                    </div>
                  </td>
                  <td data-label="Region">{formatRegionName(player.server_region)}</td>
                  <td data-label="Registered">{formatRelativeDate(player.registered)}</td>
                  <td data-label="Last Seen">{formatRelativeDate(player.last_seen * 1000)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <p className={styles.note}>
          Showing players {startRange} - {endRange} of {accounts.length.toLocaleString()}
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}