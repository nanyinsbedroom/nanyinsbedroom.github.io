'use client';

import styles from '@/styles/PlayerTable.module.css';
import { useTranslations } from '@/context/LanguageContext';

interface AdvancedFiltersProps {
  activityFilter: string;
  onActivityChange: (status: string) => void;
  genderFilter: string;
  onGenderChange: (gender: string) => void;
  crewFilter: string;
  onCrewChange: (status: string) => void;
}

export default function AdvancedFilters({
  activityFilter,
  onActivityChange,
  genderFilter,
  onGenderChange,
  crewFilter,
  onCrewChange,
}: AdvancedFiltersProps) {
  const t = useTranslations('Filters');
  return (
    <>
      <div className={styles.sortControls}>
        <button onClick={() => onActivityChange('all')} className={`${styles.sortButton} ${activityFilter === 'all' ? styles.active : ''}`}>{t('allStatus')}</button>
        <button onClick={() => onActivityChange('online')} className={`${styles.sortButton} ${activityFilter === 'online' ? styles.active : ''}`}>{t('online')}</button>
        <button onClick={() => onActivityChange('recent')} className={`${styles.sortButton} ${activityFilter === 'recent' ? styles.active : ''}`}>{t('recent')}</button>
        <button onClick={() => onActivityChange('inactive')} className={`${styles.sortButton} ${activityFilter === 'inactive' ? styles.active : ''}`}>{t('inactive')}</button>
      </div>

      <div className={styles.sortControls}>
        <button onClick={() => onGenderChange('all')} className={`${styles.sortButton} ${genderFilter === 'all' ? styles.active : ''}`}>{t('allGenders')}</button>
        <button onClick={() => onGenderChange('male')} className={`${styles.sortButton} ${genderFilter === 'male' ? styles.active : ''}`}>{t('male')}</button>
        <button onClick={() => onGenderChange('female')} className={`${styles.sortButton} ${genderFilter === 'female' ? styles.active : ''}`}>{t('female')}</button>
      </div>

      <div className={styles.sortControls}>
        <button onClick={() => onCrewChange('all')} className={`${styles.sortButton} ${crewFilter === 'all' ? styles.active : ''}`}>{t('allPlayers')}</button>
        <button onClick={() => onCrewChange('in_crew')} className={`${styles.sortButton} ${crewFilter === 'in_crew' ? styles.active : ''}`}>{t('inACrew')}</button>
        <button onClick={() => onCrewChange('no_crew')} className={`${styles.sortButton} ${crewFilter === 'no_crew' ? styles.active : ''}`}>{t('noCrew')}</button>
      </div>
    </>
  );
}