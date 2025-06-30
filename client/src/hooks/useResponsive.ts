import { useState, useEffect } from 'react';

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('lg');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      
      let size: ScreenSize;
      if (width < 480) size = 'xs';
      else if (width < 640) size = 'sm';
      else if (width < 768) size = 'md';
      else if (width < 1024) size = 'lg';
      else if (width < 1280) size = 'xl';
      else size = '2xl';

      setScreenSize(size);
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getGridCols = (mobile: number = 1, tablet: number = 2, desktop: number = 3) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  const getSpacing = (mobile: string = 'p-4', tablet: string = 'p-6', desktop: string = 'p-8') => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  const getTextSize = (mobile: string = 'text-sm', tablet: string = 'text-base', desktop: string = 'text-lg') => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    getGridCols,
    getSpacing,
    getTextSize
  };
};

export default useResponsive;