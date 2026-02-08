'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Account } from '@/lib/types';
import { formatRelativeDate, formatRegionName } from '@/lib/formatters';
import { getCrewMemberCount } from '@/lib/playerUtils';
import Pagination from './Pagination';
import PlayerProfileModal from './PlayerProfileModal';
import styles from '@/styles/PlayerTable.module.css';
import { useTranslations } from '@/context/LanguageContext';

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
  // --- STATE MANAGEMENT FOR THE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Account | null>(null);
  const [internalTitleData, setInternalTitleData] = useState<Record<string, string>>({});
  
  // Function to open the modal with the clicked player's data
  const handlePlayerClick = (player: Account) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };
  // ------------------------------------

  const totalPages = Math.ceil(accounts.length / PAGE_SIZE);
  const paginatedAccounts = accounts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const startRange = (currentPage - 1) * PAGE_SIZE + 1;
  const endRange = Math.min(currentPage * PAGE_SIZE, accounts.length);
  const t = useTranslations('Table');

  return (
    <>
      <div className={styles.card}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('headerName')}</th>
                <th>{t('headerCrew')}</th>
                <th>{t('headerRegion')}</th>
                <th>{t('headerRegistered')}</th>
                <th>{t('headerLastSeen')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAccounts.map((player, index) => {
                const crewMemberCount = getCrewMemberCount(allAccounts, player.crew_name);
                return (
                  <tr key={`${player.role_id}-${(currentPage - 1) * PAGE_SIZE + index}`}>
                    <td data-label="Name">
                      <div className={styles.playerName}>
                        <button
                          onClick={() => handlePlayerClick(player)}
                          className={styles.playerLink}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            textAlign: 'left',
                            color: 'var(--text-primary)',
                            fontSize: 'inherit'
                          }}
                        >
                          {player.name}
                        </button>
                        <span className={styles.roleId}>#{player.role_id}</span>
                      </div>
                    </td>
                    <td data-label="Crew">
                      <div className={styles.crewInfo}>
                        {player.crew_name && player.crew_name !== 'N/A' && player.crew_id !== 0 ? (
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
                    <td data-label="Last Seen">{formatRelativeDate(player.last_seen)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.footer}>
          <p className={styles.note}>
            {t('footerPagination')} {startRange} - {endRange} of {accounts.length.toLocaleString()}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      <PlayerProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        player={selectedPlayer}
        allAccounts={allAccounts}
      />
    </>
  );
}