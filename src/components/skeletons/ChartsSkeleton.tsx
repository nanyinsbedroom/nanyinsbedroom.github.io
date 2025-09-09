import styles from '@/styles/Skeleton.module.css';
import gridStyles from '@/styles/Dashboard.module.css';

export default function ChartsSkeleton() {
  return (
    <div className={gridStyles.chartsGrid}>
      <div className={`${styles.chartCard} ${styles.skeleton}`}></div>
      <div className={`${styles.chartCard} ${styles.skeleton}`}></div>
      <div className={`${styles.chartCard} ${styles.skeleton}`}></div>
    </div>
  );
}