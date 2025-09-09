import styles from '@/styles/PlayerTable.module.css';

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
  return (
    <>
      <div className={styles.sortControls}>
        <button onClick={() => onActivityChange('all')} className={`${styles.sortButton} ${activityFilter === 'all' ? styles.active : ''}`}>All Status</button>
        <button onClick={() => onActivityChange('online')} className={`${styles.sortButton} ${activityFilter === 'online' ? styles.active : ''}`}>Online</button>
        <button onClick={() => onActivityChange('recent')} className={`${styles.sortButton} ${activityFilter === 'recent' ? styles.active : ''}`}>Recent</button>
        <button onClick={() => onActivityChange('inactive')} className={`${styles.sortButton} ${activityFilter === 'inactive' ? styles.active : ''}`}>Inactive</button>
      </div>

      <div className={styles.sortControls}>
        <button onClick={() => onGenderChange('all')} className={`${styles.sortButton} ${genderFilter === 'all' ? styles.active : ''}`}>All Genders</button>
        <button onClick={() => onGenderChange('male')} className={`${styles.sortButton} ${genderFilter === 'male' ? styles.active : ''}`}>Male</button>
        <button onClick={() => onGenderChange('female')} className={`${styles.sortButton} ${genderFilter === 'female' ? styles.active : ''}`}>Female</button>
      </div>

      <div className={styles.sortControls}>
        <button onClick={() => onCrewChange('all')} className={`${styles.sortButton} ${crewFilter === 'all' ? styles.active : ''}`}>All Players</button>
        <button onClick={() => onCrewChange('in_crew')} className={`${styles.sortButton} ${crewFilter === 'in_crew' ? styles.active : ''}`}>In a Crew</button>
        <button onClick={() => onCrewChange('no_crew')} className={`${styles.sortButton} ${crewFilter === 'no_crew' ? styles.active : ''}`}>No Crew</button>
      </div>
    </>
  );
}