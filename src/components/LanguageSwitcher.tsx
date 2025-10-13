'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from '@/styles/Layout.module.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';
import { useTranslations } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Dashboard');
  const handleLocaleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    setLocale(newLocale);

    const currentParams = new URLSearchParams(searchParams.toString());
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return (
    <div className={styles.languageSwitcher}>
      <div style={{ display: 'flex', alignItems: 'left', gap: '1rem' }}>
        <label htmlFor="language-select" style={{ display: 'none' }}>Select Language</label>
        <div className={styles.selectWrapper}>
          <select
            id="language-select"
            value={locale}
            onChange={handleLocaleChange}
            className={styles.languageSelect}
            aria-label="Select Language"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="id">Bahasa Indonesia</option>
            <option value="ja">日本語</option>
            <option value="ms">Bahasa Melayu</option>
            <option value="pl">Polski</option>
            <option value="ru">Русский</option>
            <option value="th">ไทย</option>
            <option value="tl">Filipino</option>
            <option value="vi">Tiếng Việt</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>
    </div>
  );
}