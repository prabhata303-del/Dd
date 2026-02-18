
import React from 'react';
import { Dish } from '../../types';
import { useCartWishlist } from '../../context/CartWishlistContext';
import DiscountTag from '../shared/DiscountTag';
import { MAX_ITEM_QTY } from '../../constants';

interface DishCardProps {
  dish: Dish;
  showProductDetail: (dishKey: string) => void;
}

const DishCard: React.FC<DishCardProps> = ({ dish, showProductDetail }) => {
  const { wishlist, addToCart, toggleWishlist } = useCartWishlist();
  const isWished = wishlist.includes(dish.key);
  const isInStock = dish.isInStock === undefined ? true : dish.isInStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInStock) {
      addToCart(dish, 1);
    } else {
      alert('This product is out of stock.');
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(dish);
  };

  const handleClick = () => {
    if (isInStock) {
      showProductDetail(dish.key);
    } else {
      alert('This product is out of stock.');
    }
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer ${
        !isInStock ? 'opacity-50 pointer-events-none' : ''
      }`}
      onClick={handleClick}
    >
      {!isInStock && (
        <div className="absolute inset-0 bg-white/80 flex justify-center items-center text-base font-bold text-danger z-20">
          Out of Stock
        </div>
      )}
      <DiscountTag discount={dish.discount} />
      <img src={dish.imageUrl} alt={dish.name} className="w-full h-[110px] object-contain bg-gray-100" />
      <div className="absolute bottom-2.5 right-2.5 flex gap-1 z-10">
        <button
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors duration-200 
            ${isWished ? 'bg-danger text-white shadow-red-md' : 'bg-white/80 text-gray-300'}`}
          onClick={handleToggleWishlist}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i className="fas fa-heart"></i>
        </button>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white shadow-purple-button transition-colors duration-200"
          onClick={handleAddToCart}
          disabled={!isInStock}
          aria-label="Add to cart"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="p-3">
        <h3 className="m-0 mb-1 text-sm whitespace-nowrap overflow-hidden text-ellipsis font-semibold">{dish.name}</h3>
        <p className="text-primary font-bold text-sm m-0">
          ₹{dish.customerPrice.toFixed(2)}
          {dish.discount > 0 && (
            <span className="text-xs text-light-text line-through ml-1.5 font-normal">
              ₹{dish.price.final.toFixed(2)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default DishCard;
