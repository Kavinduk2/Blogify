import { useState, useEffect } from 'react';

/**
 * Custom hook for handling window resize events with debouncing
 * @returns {Object} - Object containing window width and height
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};

/**
 * Custom hook for detecting if viewport is mobile
 * @param {number} breakpoint - Breakpoint width for mobile detection (default: 768)
 * @returns {boolean} - Whether viewport is mobile
 */
export const useIsMobile = (breakpoint = 768) => {
  const { width } = useWindowSize();
  return width < breakpoint;
};

/**
 * Custom hook for detecting scroll position
 * @returns {number} - Current scroll Y position
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrollPosition(window.pageYOffset);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
};

export default { useWindowSize, useIsMobile, useScrollPosition };
