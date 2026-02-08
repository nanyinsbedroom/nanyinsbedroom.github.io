'use client';

import { useTranslations } from '@/context/LanguageContext';
import styles from '@/styles/WelcomeNote.module.css';

export default function WelcomeNote() {
  const t = useTranslations('WelcomeNote');

  return (
    <div className={styles.welcomeCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('title')}</h3>
      </div>
      <div className={styles.content}>
        <p>{t('intro')}</p>
        <div>
          <h4>{t('howTitle')}</h4>
          <p>{t('howText')}</p>
        </div>
        
        <div>
          <h4>{t('disclaimerTitle')}</h4>
          <p>
            {t('disclaimerP1_part1')}
            <strong className={styles.importantText}>
              {t('disclaimerP1_part2_important')}
            </strong>
            {t('disclaimerP1_part3')}
            <strong className={styles.importantText}>
              {t('disclaimerP1_part4_important')}
            </strong>
            {t('disclaimerP1_part5')}
          </p>
          <p>{t('disclaimerP2')}</p>
          <p>
            {t('disclaimerP3_part1')}
            <strong className={styles.companyName}>
              {t('disclaimerP3_part2_company')}
            </strong>
            {t('disclaimerP3_part3')}
            <strong className={styles.companyName}>
              {t('disclaimerP3_part4_company')}
            </strong>
            {t('disclaimerP3_part5')}
            <strong className={styles.importantText}>
              {t('disclaimerP3_part6_important')}
            </strong>
            {t('disclaimerP3_part7')}
          </p>
        </div>
      </div>
    </div>
  );
}