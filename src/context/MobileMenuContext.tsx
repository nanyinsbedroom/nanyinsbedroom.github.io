'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MobileMenuContextType {
  isLeftWingOpen: boolean;
  isRightWingOpen: boolean;
  setIsLeftWingOpen: (isOpen: boolean) => void;
  setIsRightWingOpen: (isOpen: boolean) => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
}

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isLeftWingOpen, setIsLeftWingOpen] = useState(false);
  const [isRightWingOpen, setIsRightWingOpen] = useState(false);

  return (
    <MobileMenuContext.Provider
      value={{
        isLeftWingOpen,
        setIsLeftWingOpen,
        isRightWingOpen,
        setIsRightWingOpen,
      }}
    >
      {children}
    </MobileMenuContext.Provider>
  );
}