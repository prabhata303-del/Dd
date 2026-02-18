
import React from 'react';
import { PageId } from '../../App';
import { useCartWishlist } from '../../context/CartWishlistContext';

interface FABProps {
  showPage: (pageId: PageId) => void;
}

const FAB: React.FC<FABProps> = ({ showPage }) => {
  const { cartCount } = useCartWishlist();

  return (
    <div className="fixed bottom-[85px] right-5 z-50">
      <button
        className="w-[60px] h-[60px] bg-white rounded-full flex justify-center items-center text-primary text-2xl shadow-md cursor-pointer transition-transform duration-200 active:scale-90"
        onClick={() => showPage('cartPage')}
      >
        <i className="fas fa-shopping-basket"></i>
        {cartCount > 0 && (
          <div className="absolute -top-0.5 -right-0.5 bg-danger text-white rounded-full w-[22px] h-[22px] text-sm flex justify-center items-center font-extrabold shadow-md border-2 border-white">
            {cartCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default FAB;
