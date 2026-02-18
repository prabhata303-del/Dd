
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, WishlistItem, Dish } from '../types';
import { useAuth } from './AuthContext';
import { 
  listenForWishlistUpdates, addWishlistItem, removeWishlistItem
} from '../services/firebaseService';
import { MIN_ORDER_QTY, MIN_ORDER_AMOUNT, MAX_ITEM_QTY } from '../constants';
import { useAppSettings } from './AppSettingsContext';

interface CartWishlistContextType {
  cart: CartItem[];
  wishlist: string[]; // Stores only keys of wished items
  addToCart: (dish: Dish, quantity?: number) => void;
  modQty: (itemId: string, delta: number) => void;
  toggleWishlist: (dish: Dish) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isOrderValid: boolean;
  canGetFreeDelivery: boolean;
  loadingWishlist: boolean;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { deliveryFee: adminDeliveryFee, freeDeliveryThreshold } = useAppSettings();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]); // Only store keys
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  // --- Wishlist Logic ---
  useEffect(() => {
    setLoadingWishlist(true);
    let unsubscribe: (() => void) | undefined;
    if (currentUser?.uid) {
      unsubscribe = listenForWishlistUpdates(currentUser.uid, (wishlistKeys) => {
        setWishlist(wishlistKeys);
        setLoadingWishlist(false);
      });
    } else {
      setWishlist([]);
      setLoadingWishlist(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser?.uid]);

  const toggleWishlist = useCallback(async (dish: Dish) => {
    if (!currentUser) {
      // Logic for redirect to login handled in App.tsx
      return;
    }

    if (dish.isInStock === false) {
      alert('This product is currently out of stock.');
      return;
    }

    const isWished = wishlist.includes(dish.key);
    const wishlistItem: WishlistItem = {
      key: dish.key,
      name: dish.name,
      price: dish.customerPrice,
      imageUrl: dish.images?.[0] || dish.imageUrl || 'https://picsum.photos/150/110',
      discount: dish.discount,
      unit: dish.unit,
    };

    try {
      if (isWished) {
        await removeWishlistItem(currentUser.uid, dish.key);
      } else {
        await addWishlistItem(currentUser.uid, wishlistItem);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist item:", error);
      alert("Could not update wishlist. Please try again.");
    }
  }, [currentUser, wishlist]);

  // --- Cart Logic ---
  const addToCart = useCallback((dish: Dish, quantity: number = 1) => {
    if (!currentUser) {
      // Logic for redirect to login handled in App.tsx
      return;
    }

    if (dish.isInStock === false) {
      alert('This product is currently out of stock.');
      return;
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === dish.key);
      let newQuantity = quantity;

      if (existingItemIndex !== -1) {
        newQuantity = prevCart[existingItemIndex].quantity + quantity;
        if (newQuantity > MAX_ITEM_QTY) {
          alert(`Cannot add more. Maximum quantity for this item is ${MAX_ITEM_QTY}.`);
          return prevCart; // Do not modify cart if max exceeded
        }
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = { ...updatedCart[existingItemIndex], quantity: newQuantity };
        return updatedCart;
      } else {
        if (newQuantity > MAX_ITEM_QTY) {
          alert(`Cannot add. Maximum quantity for this item is ${MAX_ITEM_QTY}.`);
          return prevCart;
        }
        return [...prevCart, {
          id: dish.key,
          name: dish.name,
          price: dish.customerPrice,
          img: dish.images?.[0] || dish.imageUrl,
          quantity: newQuantity,
        }];
      }
    });
  }, [currentUser]);

  const modQty = useCallback((itemId: string, delta: number) => {
    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return prevCart;

      const updatedCart = [...prevCart];
      const currentItem = updatedCart[itemIndex];
      const newQty = currentItem.quantity + delta;

      if (newQty < 1) {
        return prevCart.filter(item => item.id !== itemId); // Remove item if qty is 0 or less
      } else if (newQty > MAX_ITEM_QTY) {
        alert(`Cannot increase quantity above maximum limit of ${MAX_ITEM_QTY}.`);
        return prevCart; // Do not modify if max exceeded
      } else {
        updatedCart[itemIndex] = { ...currentItem, quantity: newQty };
        return updatedCart;
      }
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // --- Cart Calculations & Validity ---
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  const canGetFreeDelivery = subtotal >= freeDeliveryThreshold && freeDeliveryThreshold > 0;
  const deliveryFee = canGetFreeDelivery ? 0 : adminDeliveryFee;
  const total = subtotal + deliveryFee;

  const isOrderValid = cartCount >= MIN_ORDER_QTY && subtotal >= MIN_ORDER_AMOUNT;

  const contextValue = {
    cart,
    wishlist,
    addToCart,
    modQty,
    toggleWishlist,
    clearCart,
    cartCount,
    subtotal,
    deliveryFee,
    total,
    isOrderValid,
    canGetFreeDelivery,
    loadingWishlist,
  };

  return (
    <CartWishlistContext.Provider value={contextValue}>
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (context === undefined) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};
