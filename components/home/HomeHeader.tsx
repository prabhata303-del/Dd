
import React from 'react';

interface HomeHeaderProps {
  onSearchChange: (searchTerm: string) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onSearchChange }) => {
  return (
    <header className="bg-primary-gradient py-12 px-5 text-white rounded-b-3xl shadow-purple-xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl m-0 font-bold flex items-center">
          <div className="w-12 h-12 mr-2 rounded-full overflow-hidden flex-shrink-0 bg-white">
            <img src="https://i.ibb.co/kgVKVjz0/IMG-20260117-112546.jpg" alt="Shuvidha Seva Logo" className="w-full h-full object-contain" />
          </div>
          Shuvidha Seva
        </h1>
      </div>
      <div className="mt-4 relative">
        <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-light-text"></i>
        <input
          type="text"
          placeholder="What are you craving?"
          className="w-full py-3.5 px-5 pl-12 border-none rounded-full text-base box-border shadow-md outline-none text-gray-700"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </header>
  );
};

export default HomeHeader;
