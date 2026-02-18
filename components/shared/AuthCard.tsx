
import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  headerContent: {
    title: string;
    description: string;
    showLogo?: boolean;
  };
}

const AuthCard: React.FC<AuthCardProps> = ({ children, headerContent }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-5 box-border bg-[#ecf0f1]">
      <div className="bg-white w-full rounded-2xl shadow-xl shadow-black/8 overflow-hidden animate-fadeIn relative max-h-[95vh] sm:max-h-[80vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary-gradient"></div>
        
        <div className="text-center p-10 pb-2.5 sm:p-7 sm:pb-2.5">
          {headerContent.showLogo && (
            <div className="w-20 h-20 mx-auto mb-4 bg-white text-primary rounded-full flex items-center justify-center text-4xl shadow-purple-md overflow-hidden">
              <img src="https://i.ibb.co/kgVKVjz0/IMG-20260117-112546.jpg" alt="Shuvidha Seva Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <h1 className="text-2xl font-bold m-0 text-gray-900">{headerContent.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{headerContent.description}</p>
        </div>
        
        <div className="p-7 sm:p-5 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
