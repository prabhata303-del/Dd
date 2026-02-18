
import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div
      className="relative w-full max-w-mobile-container h-screen-mobile max-h-mobile-container bg-secondary rounded-none overflow-hidden flex flex-col
                 sm:rounded-mobile-container sm:shadow-2xl sm:shadow-black/20 sm:h-[90vh]"
    >
      {children}
    </div>
  );
};

export default MobileContainer;
