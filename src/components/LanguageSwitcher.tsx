'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from '@/styles/Layout.module.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLocaleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    setLocale(newLocale);

    const currentParams = new URLSearchParams(searchParams.toString());
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return (
    <div className={styles.languageSwitcher}>
      <label htmlFor="language-select" style={{ display: 'none' }}>Select Language</label>
      <select id="language-select" value={locale} onChange={handleLocaleChange}>
        <option value="en">English</option>
        <option value="id">Bahasa Indonesia</option>
        <option value="es">Español</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
}