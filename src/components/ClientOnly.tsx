'use client';

import { useState, useEffect, ReactNode } from 'react';

// This wrapper component ensures its children only render on the client-side.
// It's useful for components like charts that need browser APIs to work.
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // We render a placeholder on the server to prevent the layout from shifting.
    return <div style={{ minHeight: '220px' }}></div>;
  }

  return <>{children}</>;
}