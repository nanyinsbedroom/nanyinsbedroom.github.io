'use client';

import { Suspense } from 'react';
import { useMobileMenu } from '@/context/MobileMenuContext';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { useMediaQuery } from '@/lib/useMediaQuery';
import styles from '@/styles/Layout.module.css';
import { FaGithub, FaDiscord, FaEnvelope } from 'react-icons/fa';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from '@/context/LanguageContext';

export default function GlobalHeader() {
  const isMobile = useMediaQuery(1199);
  const router = useRouter();
  const { isLeftWingOpen, isRightWingOpen, setIsLeftWingOpen, setIsRightWingOpen } = useMobileMenu();
  const t = useTranslations('GlobalHeader');
  const socialLinks = [
    { href: "https://github.com/nanyinsbedroom", icon: FaGithub, label: "Follow Us" },
    { href: "https://discord.gg/Bs5cPKumFX", icon: FaDiscord, label: "Join Our Community" }
  ];
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
      <div className="header-actions">
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialButton}
          >
            <Icon size={18} />
            {!isMobile && <span>{label}</span>}
          </a>
        ))}
        <Suspense fallback={<div style={{ width: '80px' }} />}>
          <LanguageSwitcher />
        </Suspense>
      </div>
    </header>
  );
}