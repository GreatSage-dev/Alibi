'use client';

import { useState, useEffect } from 'react';

export function useParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    let animationFrameId: number;
    let lastScrollY = window.scrollY;

    const updateScroll = () => {
      if (lastScrollY !== window.scrollY) {
        lastScrollY = window.scrollY;
        setScrollY(lastScrollY);
      }
      animationFrameId = requestAnimationFrame(updateScroll);
    };

    animationFrameId = requestAnimationFrame(updateScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return scrollY;
}
