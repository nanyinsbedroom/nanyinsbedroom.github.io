'use client';

import { useState, useEffect } from 'react';

// A simple hook to check if the screen width is below a certain size.
export function useMediaQuery(query: number) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${query}px)`);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}