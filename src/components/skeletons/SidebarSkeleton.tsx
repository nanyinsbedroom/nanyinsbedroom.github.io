import styles from '@/styles/skeleton-temp.module.css';

export default function SidebarSkeleton() {
  return (
    <aside className={styles.sidebarSkeleton}>
      <div className={`${styles.card} ${styles.skeleton}`}>
        <div className={`${styles.title} ${styles.skeleton}`}></div>
        <div className={`${styles.metric} ${styles.skeleton}`}></div>
      </div>
      <div className={`${styles.card} ${styles.skeleton}`}>
        <div className={`${styles.title} ${styles.skeleton}`}></div>
        {[...Array(7)].map((_, i) => (
          <div key={i} className={`${styles.listItem} ${styles.skeleton}`}></div>
        ))}
      </div>
      <div className={`${styles.card} ${styles.skeleton}`} style={{ flexGrow: 1 }}>
        <div className={`${styles.title} ${styles.skeleton}`}></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`${styles.listItem} ${styles.skeleton}`} style={{ height: '24px' }}></div>
        ))}
      </div>
    </aside>
  );
}