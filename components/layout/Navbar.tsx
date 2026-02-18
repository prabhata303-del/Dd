
import React from 'react';
import { PageId } from '../../App';

interface NavbarProps {
  currentPage: PageId;
  showPage: (pageId: PageId) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, showPage }) => {
  const navItems = [
    { id: 'appContainer', icon: 'fas fa-home', text: 'Home' },
    { id: 'ordersPage', icon: 'fas fa-receipt', text: 'Orders' },
    { id: 'wishlistPage', icon: 'fas fa-heart', text: 'Wishlist' },
    { id: 'profilePage', icon: 'fas fa-user', text: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-primary-gradient shadow-purple-nav rounded-t-3xl z-10 p-x-7 flex justify-around items-center mx-auto max-w-mobile-container">
      {navItems.map(item => (
        <div
          key={item.id}
          className={`flex flex-col items-center cursor-pointer transition-all duration-300 
            ${currentPage === item.id ? 'text-white text-shadow-md' : 'text-white/60'}`}
          onClick={() => showPage(item.id as PageId)}
        >
          <i className={`${item.icon} text-xl mb-0.5`}></i>
          <p className="m-0 text-xs font-medium">{item.text}</p>
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
