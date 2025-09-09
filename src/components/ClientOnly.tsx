'use client';

import { useState, useEffect, ReactNode } from 'react';

/**
 * A wrapper component that ensures its children are only rendered on the client-side.
 * This is essential for components that use browser-specific APIs, like charts.
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div style={{ minHeight: '200px' }}></div>; // Placeholder for server render
  }

  return <>{children}</>;
}