import { useEffect, useState } from 'react';

export const ScrollUp = 'up';
export const ScrollDown = 'down';

const useScrollDirection = ({ initialDirection = ScrollUp, thresholdPixels = 60 } = {}) => {
  const [scrollDir, setScrollDir] = useState(initialDirection);

  useEffect(() => {
    const threshold = thresholdPixels || 0;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.scrollY;
      const thresholdSub = scrollY > lastScrollY ? 60 : scrollY > 200 ? 200 : 0;
      if (Math.abs(scrollY - lastScrollY) < thresholdSub) {
        ticking = false;
        return;
      }

      setScrollDir(scrollY > lastScrollY ? ScrollDown : ScrollUp);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [initialDirection, thresholdPixels]);
  return scrollDir;
};

export default useScrollDirection;
