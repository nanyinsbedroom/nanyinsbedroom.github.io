'use client';

import { useState, useEffect } from 'react';

// This is a simple utility to check if the screen is below a certain width.
export function useMediaQuery(query: number) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Set the initial value once the component mounts on the client.
    const media = window.matchMedia(`(max-width: ${query}px)`);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    // Listen for changes in the screen size.
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    
    // Clean up the listener when the component unmounts.
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}