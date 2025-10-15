'use client';

import { Account } from '@/lib/types';
import PlayerProfile from './PlayerProfile';
import styles from '@/styles/StatisticsModal.module.css';
import { FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getTitleData } from '@/lib/data-fetching';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Account | null;
  allAccounts: Account[];
  titleData: Record<string, string>;
}

export default function PlayerProfileModal({ isOpen, onClose, player, allAccounts, titleData }: PlayerProfileModalProps) {
  const [internalTitleData, setInternalTitleData] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadTitleData = async () => {
      if (titleData) {
        setInternalTitleData(titleData);
      } else {
        const data = await getTitleData();
        setInternalTitleData(data);
      }
    };

    if (isOpen && player) {
      loadTitleData();
    }
  }, [isOpen, player, titleData]);

  if (!isOpen || !player) {
    return null; // Don't render anything if it's closed or there's no player xdd
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      {/* The content div stops the click from closing the modal */}
      <div className={styles.modalContent} style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h3>Player Profile</h3>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
            <FaTimes size={20} />
          </button>
        </header>
        <div className={styles.modalBody}>
          {/* We just render the existing PlayerProfile component inside. xdd! */}
          <PlayerProfile player={player} allAccounts={allAccounts} titleData={internalTitleData} />
        </div>
      </div>
    </div>
  );
}