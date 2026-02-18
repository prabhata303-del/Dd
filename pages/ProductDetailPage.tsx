
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageId } from '../App';
import PageHeader from '../components/shared/PageHeader';
import Button from '../components/ui/Button';
import QuantityControls from '../components/shared/QuantityControls';
import DiscountTag from '../components/shared/DiscountTag';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';
import { Dish } from '../types';
import { fetchDishes } from '../services/firebaseService';
import { MAX_ITEM_QTY } from '../constants';
import usePdpSlider from '../hooks/usePdpSlider';
import Spinner from '../components/ui/Spinner';

interface ProductDetailPageProps {
  showPage: (pageId: PageId, dishKey?: string) => void;
  dishKey: string;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ showPage, dishKey }) => {
  const { currentUser, userPincode } = useAuth();
  const { cart, addToCart, wishlist, toggleWishlist } = useCartWishlist();
  const [dish, setDish] = useState<Dish | null>(null);
  const [pdpQuantity, setPdpQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch all dishes and find the specific one
  useEffect(() => {
    const loadDish = async () => {
      setLoading(true);
      try {
        const allDishes = await fetchDishes(userPincode);
        const foundDish = allDishes.find(d => d.key === dishKey);
        if (foundDish) {
          setDish(foundDish);
        } else {
          console.error("Dish not found for key:", dishKey);
          showPage('appContainer'); // Redirect if dish not found
        }
      } catch (error) {
        console.error("Failed to fetch dish details:", error);
        showPage('appContainer'); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadDish();
    } else {
      showPage('loginPage'); // Ensure user is logged in
    }
  }, [dishKey, currentUser, userPincode, showPage]);

  const images = useMemo(() => dish?.images || [dish?.imageUrl || 'https://picsum.photos/400/300'], [dish]);
  const { currentSlide, goToSlide } = usePdpSlider(images.length, 2000);

  const isWished = useMemo(() => (dish ? wishlist.includes(dish.key) : false), [dish, wishlist]);
  const isInStock = dish?.isInStock === undefined ? true : dish.isInStock;

  const handleAddToCart = useCallback(() => {
    if (!dish) return;

    const existingItem = cart.find(i => i.id === dish.key);
    const currentTotal = existingItem ? existingItem.quantity : 0;

    if (currentTotal + pdpQuantity > MAX_ITEM_QTY) {
      alert(`You can only have a maximum of ${MAX_ITEM_QTY} of this item in your cart (Current: ${currentTotal}, Adding: ${pdpQuantity}). Please reduce the quantity.`);
      return;
    }

    addToCart(dish, pdpQuantity);
    alert(`${pdpQuantity} x ${dish.name} added to cart!`);
    showPage('cartPage');
  }, [dish, pdpQuantity, cart, addToCart, showPage]);

  const handleToggleWishlist = useCallback(() => {
    if (dish) {
      toggleWishlist(dish);
    }
  }, [dish, toggleWishlist]);

  if (loading || !dish) {
    return (
      <div className="absolute inset-0 bg-secondary flex flex-col z-10">
        <PageHeader title="Product Details" showPage={showPage} backTarget="appContainer" />
        <div className="flex-1 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <PageHeader title={dish.name} showPage={showPage} backTarget="appContainer" />
      <div className="flex-1 overflow-y-auto">
        {/* Image Slider */}
        <div className="w-full h-[250px] overflow-hidden relative bg-gray-50">
          <div
            className="flex transition-transform duration-300 ease-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((img, index) => (
              <div key={index} className="min-w-full h-full">
                <img src={img} alt={`${dish.name} ${index + 1}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 bg-gray-300 rounded-full cursor-pointer ${index === currentSlide ? 'bg-primary' : ''}`}
                onClick={() => goToSlide(index)}
              ></div>
            ))}
          </div>
        </div>

        <div className="p-5">
          {/* Price & Discount */}
          <div className="flex justify-between items-start">
            <div>
              <span className="text-2xl font-bold text-primary">₹{dish.customerPrice.toFixed(2)}</span>
              {dish.discount > 0 && (
                <span className="text-sm text-light-text line-through ml-2.5 font-normal">
                  ₹{dish.price.final.toFixed(2)}
                </span>
              )}
            </div>
            <DiscountTag discount={dish.discount} />
          </div>

          {/* Product Info */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold mb-1.5 text-text-color">{dish.name}</h2>
            <p className="text-light-text m-0">Unit: {dish.unit}</p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <label className="font-semibold text-text-color">Quantity (Max {MAX_ITEM_QTY}):</label>
            <QuantityControls
              quantity={pdpQuantity}
              onDecrease={() => setPdpQuantity(prev => (prev > 1 ? prev - 1 : 1))}
              onIncrease={() => setPdpQuantity(prev => (prev < MAX_ITEM_QTY ? prev + 1 : MAX_ITEM_QTY))}
              className="bg-white border border-gray-200"
              showLabel={false}
              buttonVariant="secondary"
            />
          </div>
          <p className="text-danger text-sm font-semibold mt-1.5">
            Maximum purchase quantity per item: {MAX_ITEM_QTY}
          </p>

          <Button
            className="mt-5"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <i className="fas fa-shopping-basket mr-2"></i>{' '}
            {isInStock ? `Add to Cart (Max ${MAX_ITEM_QTY})` : 'Out of Stock'}
          </Button>

          <h3 className="text-lg font-bold mt-8 mb-2.5 text-primary">Product Description</h3>
          <p className="leading-relaxed text-text-color">{dish.description}</p>

          <Button
            variant="ghost"
            className="mt-8 bg-white border border-gray-200 text-text-color shadow-sm hover:bg-gray-50"
            onClick={handleToggleWishlist}
            disabled={!isInStock}
          >
            <i className={`fas fa-heart mr-2 ${isWished ? 'text-danger' : 'text-gray-400'}`}></i>{' '}
            {isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
