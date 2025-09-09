import styles from '@/styles/Skeleton.module.css';

export default function PlayerTableSkeleton() {
  return <div className={`${styles.tableCard} ${styles.skeleton}`}></div>;
}