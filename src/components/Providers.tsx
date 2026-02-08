'use client';

import { ReactNode } from 'react';
import { MobileMenuProvider } from '@/context/MobileMenuContext';
import { LanguageProvider } from '@/context/LanguageContext';
import GlobalHeader from '@/components/GlobalHeader';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <MobileMenuProvider>
        <GlobalHeader />
        <main>{children}</main>
      </MobileMenuProvider>
    </LanguageProvider>
  );
}