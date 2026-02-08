'use client';

import { Account } from '@/lib/types';
import PlayerProfile from './PlayerProfile';
import styles from '@/styles/StatisticsModal.module.css';
import { FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Account | null;
  allAccounts: Account[];
}

export default function PlayerProfileModal({ isOpen, onClose, player, allAccounts }: PlayerProfileModalProps) {
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
          <PlayerProfile player={player} allAccounts={allAccounts}/>
        </div>
      </div>
    </div>
  );
}