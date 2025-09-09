'use client';

import { FaTimes } from 'react-icons/fa';
import styles from '@/styles/WelcomeNote.module.css';

interface WelcomeNoteProps {
  onDismiss: () => void;
}

export default function WelcomeNote({ onDismiss }: WelcomeNoteProps) {
  return (
    <div className={styles.welcomeCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>Welcome to the Player Dashboard</h3>
        <button onClick={onDismiss} className={styles.closeButton} aria-label="Dismiss welcome message">
          <FaTimes size={20} />
        </button>
      </div>
      <div className={styles.content}>
        <p>
          This dashboard is a community-driven project designed to provide statistics and insights into the player base of the game.
        </p>
        <div>
          <h4>How is this data collected?</h4>
          <p>
            The information is gathered using publicly available, third-party tools in a semi-automated process. Think of it like a periodic "in-game census"—a snapshot of the player data that is visible at a specific moment in time. This process is run periodically to keep the stats as up-to-date as possible.
          </p>
        </div>
        
        <p>
          Because of this method, please keep in mind that this dashboard is <strong>not</strong> an official, real-time feed from the game servers and is <strong>not affiliated</strong> with the game developers. It represents a large sample of the player base, but may not be 100% complete.
        </p>
      </div>
    </div>
  );
}