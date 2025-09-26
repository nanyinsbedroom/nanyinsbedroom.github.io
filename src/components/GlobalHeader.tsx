'use client';

import { Suspense } from 'react';
import { useMobileMenu } from '@/context/MobileMenuContext';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from '@/context/LanguageContext';

export default function GlobalHeader() {
  const router = useRouter();
  const { isLeftWingOpen, isRightWingOpen, setIsLeftWingOpen, setIsRightWingOpen } = useMobileMenu();
  const t = useTranslations('GlobalHeader');

  const handleGoBack = () => {
    if (isLeftWingOpen) {
      setIsLeftWingOpen(false);
    } else if (isRightWingOpen) {
      setIsRightWingOpen(false);
    } else {
      router.back();
    }
  };

  return (
    <header className="global-header">
      <button onClick={handleGoBack} className="go-back-btn" aria-label="Go back">
        <FaArrowLeft size={18} />
      </button>

      <nav className="header-nav-center">
        <a
          href="https://soevielofficial.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="switch-project-btn"
        >
          {t('mainButton')}
        </a>
        <p className="switch-project-text">{t('subText')}</p>
      </nav>

      <Suspense fallback={<div style={{ width: '80px' }} />}>
        <LanguageSwitcher />
      </Suspense>
    </header>
  );
}