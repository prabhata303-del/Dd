
import React from 'react';
import { PageId } from '../../App';

interface PageHeaderProps {
  title: string;
  showPage: (pageId: PageId) => void;
  backTarget: PageId;
  variant?: 'default' | 'profile';
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showPage, backTarget, variant = 'default' }) => {
  const isProfileVariant = variant === 'profile';
  const headerClasses = isProfileVariant 
    ? 'bg-primary-gradient text-white rounded-b-3xl' 
    : 'bg-secondary text-gray-900';
  const backButtonClasses = isProfileVariant ? 'text-white' : 'text-gray-900';

  return (
    <header className={`relative py-10 px-5 text-center ${headerClasses}`}>
      <i
        className={`fas fa-arrow-left absolute left-5 top-[43px] text-xl cursor-pointer p-1 ${backButtonClasses}`}
        onClick={() => showPage(backTarget)}
      ></i>
      <h2 className="m-0 text-xl font-bold">{title}</h2>
    </header>
  );
};

export default PageHeader;
