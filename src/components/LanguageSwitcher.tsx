'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from '@/styles/Layout.module.css';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={styles.languageSwitcher}>
      <label htmlFor="language-select" style={{ display: 'none' }}>Select Language</label>
      <select id="language-select" value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en">English</option>
        <option value="id">Bahasa Indonesia</option>
        <option value="es">Español</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
}