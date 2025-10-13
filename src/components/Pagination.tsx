import styles from '@/styles/PlayerTable.module.css';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useTranslations } from '@/context/LanguageContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isMobile = useMediaQuery(1199);
  const maxPageButtons = isMobile ? 1 : 10;
  const pageNumbers = [];
  const t = useTranslations('Pagination');

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        {t('previous')}
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={styles.paginationButton}>1</button>
          {startPage > 2 && <span className={styles.paginationEllipsis}>...</span>}
        </>
      )}

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`${styles.paginationButton} ${currentPage === number ? styles.active : ''}`}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className={styles.paginationEllipsis}>...</span>}
          <button onClick={() => onPageChange(totalPages)} className={styles.paginationButton}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
      >
        {t('next')}
      </button>
    </div>
  );
}