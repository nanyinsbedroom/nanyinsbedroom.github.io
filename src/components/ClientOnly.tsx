'use client';

import { useState, useEffect, ReactNode } from 'react';

// This wrapper component ensures its children are only rendered on the client side.
// This is crucial for components like charts that need access to the browser's DOM.
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Render a placeholder on the server to prevent layout shifts
    return <div style={{ minHeight: '220px' }}></div>;
  }

  return <>{children}</>;
}