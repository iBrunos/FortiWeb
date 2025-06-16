import { ReactNode, useState, useEffect } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else if (width < 1280) setScreenSize('xl');
      else setScreenSize('2xl');
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
};

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const screenSize = useScreenSize();

  const getLayoutClasses = () => {
    switch (screenSize) {
      case 'sm':
        return 'grid-cols-1 gap-4 p-4';
      case 'md':
        return 'grid-cols-1 gap-6 p-6';
      case 'lg':
        return 'grid-cols-2 gap-6 p-6';
      case 'xl':
        return 'grid-cols-3 gap-6 p-8';
      default:
        return 'grid-cols-3 gap-8 p-8';
    }
  };

  return (
    <div className={`grid ${getLayoutClasses()} w-full max-w-full`}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;