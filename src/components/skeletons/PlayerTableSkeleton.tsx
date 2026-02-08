import styles from '@/styles/skeleton-temp.module.css';

export default function PlayerTableSkeleton() {
  return <div className={`${styles.tableCard} ${styles.skeleton}`}></div>;
}