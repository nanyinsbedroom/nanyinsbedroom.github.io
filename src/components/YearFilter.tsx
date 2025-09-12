'use client';

import styles from '@/styles/PlayerTable.module.css';
import { useTranslations } from '@/context/LanguageContext';

interface YearFilterProps {
  years: string[];
  selectedYear: string | null;
  onSelectYear: (year: string | null) => void;
}

export default function YearFilter({ years, selectedYear, onSelectYear }: YearFilterProps) {
  const t = useTranslations('Filters');
  return (
    <div>
      <div className={styles.sortControls}>
        <button
          onClick={() => onSelectYear(null)}
          className={`${styles.sortButton} ${selectedYear === null ? styles.active : ''}`}
        >
          {t('allTime')}
        </button>
        {years.map(year => (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            className={`${styles.sortButton} ${selectedYear === year ? styles.active : ''}`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}