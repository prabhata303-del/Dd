
import React, { useEffect, useState } from 'react';
import { PageId } from '../App';
import PageHeader from '../components/shared/PageHeader';
import Button from '../components/ui/Button';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';
import { fetchWishlistItems } from '../services/firebaseService';
import { WishlistItem } from '../types';
import Spinner from '../components/ui/Spinner';

interface WishlistPageProps {
  showPage: (pageId: PageId) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ showPage }) => {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const { addToCart, toggleWishlist, wishlist: contextWishlistKeys, loadingWishlist } = useCartWishlist();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const loadWishlistData = async () => {
      if (currentUser?.uid) {
        // Fetch full wishlist items using the keys from context
        const fetchedItems = await fetchWishlistItems(currentUser.uid);
        // Filter fetched items to only include those whose keys are still in the context's wishlist (live updated)
        const filteredItems = fetchedItems.filter(item => contextWishlistKeys.includes(item.key));
        setWishlistItems(filteredItems);
      } else {
        setWishlistItems([]);
      }
    };

    if (!isAuthLoading && !loadingWishlist) {
      loadWishlistData();
    }
  }, [currentUser, isAuthLoading, contextWishlistKeys, loadingWishlist]);

  const handleAddToCart = (item: WishlistItem) => {
    // We need the full Dish object for addToCart, so we create a partial one.
    // In a real app, you might refetch the full dish details or pass them along.
    const dishToAdd = {
      key: item.key,
      name: item.name,
      description: '', // Not available here
      unit: item.unit,
      imageUrl: item.imageUrl,
      categoryId: '', // Not available here
      pincode: 'ALL', // Assuming for cart purposes
      discount: item.discount,
      price: { final: item.price, restaurantPrice: item.price, adminFee: 0 }, // Placeholder for price split
      customerPrice: item.price,
      isInStock: true, // Assuming in stock, would need actual check
    };
    addToCart(dishToAdd, 1);
    alert(`${item.name} added to cart!`);
    showPage('cartPage');
  };

  const handleToggleWishlist = (item: WishlistItem) => {
    const dishToRemove = {
      key: item.key,
      name: item.name,
      description: '',
      unit: item.unit,
      imageUrl: item.imageUrl,
      categoryId: '',
      pincode: 'ALL',
      discount: item.discount,
      price: { final: item.price, restaurantPrice: item.price, adminFee: 0 },
      customerPrice: item.price,
      isInStock: true,
    };
    toggleWishlist(dishToRemove); // This will remove it from wishlist
  };

  if (isAuthLoading || loadingWishlist) {
    return (
      <div className="absolute inset-0 bg-secondary flex flex-col z-10">
        <PageHeader title="My Wishlist" showPage={showPage} backTarget="appContainer" />
        <div className="flex-1 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <PageHeader title="My Wishlist" showPage={showPage} backTarget="appContainer" />
      <div className="flex-1 p-5 overflow-y-auto">
        {wishlistItems.length === 0 ? (
          <div className="text-center mt-12 text-gray-500">
            <i className="fas fa-heart-broken text-4xl mb-4"></i>
            <p>Your wishlist is empty. Start adding items!</p>
          </div>
        ) : (
          wishlistItems.map(item => {
            const imageUrl = item.imageUrl || 'https://picsum.photos/150/150';
            const discountedPrice = item.price;
            const originalPrice = item.discount > 0 ? discountedPrice / (1 - item.discount / 100) : discountedPrice;

            return (
              <div key={item.key} className="flex items-center bg-white p-3 rounded-lg shadow-sm mb-3">
                <img src={imageUrl} alt={item.name} className="w-[65px] h-[65px] rounded-lg object-cover mr-4" />
                <div className="flex-1">
                  <h4 className="m-0 text-base">{item.name}</h4>
                  <p className="m-0 mt-0.5 text-primary font-semibold text-sm">
                    ₹{discountedPrice.toFixed(2)}
                    {item.discount > 0 && (
                      <span className="text-xs text-light-text line-through ml-1.5 font-normal">
                        ₹{originalPrice.toFixed(2)}
                      </span>
                    )}
                  </p>
                  {item.discount > 0 && (
                    <p className="m-0 text-xs text-danger">Save {item.discount}%</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    className="w-auto px-4 py-2 text-sm m-0 shadow-purple-button"
                    onClick={() => handleAddToCart(item)}
                  >
                    <i className="fas fa-shopping-basket mr-1"></i> Add
                  </Button>
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-danger text-white shadow-red-md"
                    onClick={() => handleToggleWishlist(item)}
                    aria-label="Remove from wishlist"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
