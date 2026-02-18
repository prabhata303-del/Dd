
import React, { useState, useEffect, useCallback } from 'react';
import { PageId } from '../App';
import PageHeader from '../components/shared/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { placeNewOrder } from '../services/firebaseService';
import { MIN_ORDER_QTY, MIN_ORDER_AMOUNT } from '../constants';
// Fix: Added import for Spinner component
import Spinner from '../components/ui/Spinner';

interface CheckoutPageProps {
  showPage: (pageId: PageId) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ showPage }) => {
  const { currentUser, userData, isLoading: isAuthLoading } = useAuth();
  const { cart, subtotal, deliveryFee, total, isOrderValid, clearCart } = useCartWishlist();

  const [customerName, setCustomerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [addressPincode, setAddressPincode] = useState('');
  const [addressStateDistrict, setAddressStateDistrict] = useState('');
  const [addressFullLine, setAddressFullLine] = useState('');
  const [addressInstructions, setAddressInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);

  // Load initial address data from user profile
  useEffect(() => {
    if (userData) {
      setCustomerName(userData.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || '');
      setContactPhone(userData.mobile || '');
      setAddressPincode(userData.pincode || '');
      setAddressStateDistrict(`${userData.address?.state || 'N/A'}, ${userData.address?.district || 'N/A'}`);
      setAddressFullLine(userData.address?.line || '');
      setAddressInstructions(''); // Clear instructions by default
    } else if (!isAuthLoading) {
      // If no user data, but not loading, redirect to login or show error
      if (!currentUser) {
        showPage('loginPage');
      } else {
        // Fallback for new Google users without full data
        setCustomerName(currentUser.displayName || currentUser.email?.split('@')[0] || '');
        setContactPhone('');
        setAddressPincode('');
        setAddressStateDistrict('Address not set. Update in Profile.');
        setAddressFullLine('');
      }
    }
  }, [userData, currentUser, isAuthLoading, showPage]);

  // Validate address fields dynamically
  useEffect(() => {
    const isValid = customerName.trim() !== '' &&
      contactPhone.length === 10 && !isNaN(Number(contactPhone)) &&
      addressPincode.length === 6 && !isNaN(Number(addressPincode)) &&
      addressFullLine.trim() !== '';
    setIsAddressValid(isValid);
  }, [customerName, contactPhone, addressPincode, addressFullLine]);


  const handlePlaceOrder = useCallback(async () => {
    if (!currentUser || !isOrderValid || !isAddressValid) {
      alert("Please ensure all required fields are filled and minimum order criteria are met.");
      return;
    }

    setIsPlacingOrder(true);

    const fullAddress = `${addressFullLine}, ${addressStateDistrict} (Pincode: ${addressPincode}) - Instructions: ${addressInstructions || 'None'}`;

    const itemsToStore = cart.map(item => {
      // Find the original dish data to get restaurantPrice and adminFee
      // This assumes we have `allDishesData` available, which is true on HomePage, but not here directly.
      // For checkout, we rely on the `Dish` object passed to Cart to contain these if possible, or fallback.
      // For robustness, in a real app, this would involve re-fetching dish details or ensuring they're stored in cart.
      // For now, using direct price (customerPrice) and fallback for split.
      const restaurantPrice = item.price; // Placeholder, ideally should be from Dish original data
      const adminFee = 0; // Placeholder, ideally should be from Dish original data

      return {
        id: item.id,
        name: item.name,
        price: item.price.toFixed(2),
        img: item.img,
        quantity: item.quantity,
        restaurantPrice: restaurantPrice.toFixed(2),
        adminFee: adminFee.toFixed(2),
      };
    });

    try {
      await placeNewOrder({
        userId: currentUser.uid,
        customerName: customerName.trim(),
        email: currentUser.email || '',
        phone: contactPhone.trim(),
        address: fullAddress,
        items: itemsToStore,
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        total: total.toFixed(2),
        status: 'PLACED',
        method: 'COD',
        timestamp: Date.now(),
      });

      clearCart();
      showPage('thankYouPage');
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Order placement failed. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  }, [
    currentUser, isOrderValid, isAddressValid,
    customerName, contactPhone, addressPincode, addressStateDistrict, addressFullLine, addressInstructions,
    cart, subtotal, deliveryFee, total, clearCart, showPage
  ]);

  if (isAuthLoading) {
    return (
      <div className="absolute inset-0 bg-secondary flex flex-col z-10">
        <PageHeader title="Checkout" showPage={showPage} backTarget="cartPage" />
        <div className="flex-1 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <PageHeader title="Checkout" showPage={showPage} backTarget="cartPage" />
      <div className="flex-1 p-5 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4 text-primary">1. Confirm Delivery Address</h3>

        <div className="mb-5">
          <Input
            label="Customer Name"
            type="text"
            placeholder="Full Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            disabled={isPlacingOrder}
          />
          <Input
            label="Mobile Number (For Delivery)"
            type="tel"
            placeholder="10-digit Mobile Number"
            maxLength={10}
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
            disabled={isPlacingOrder}
          />
          <Input
            label="Pincode"
            type="tel"
            placeholder="Pincode"
            maxLength={6}
            value={addressPincode}
            onChange={(e) => setAddressPincode(e.target.value)}
            required
            disabled={isPlacingOrder}
          />
          <Input
            label="State & District (From Registration - Read Only)"
            type="text"
            value={addressStateDistrict}
            className="bg-gray-100 text-gray-600 font-medium cursor-not-allowed"
            readOnly
            disabled={isPlacingOrder}
          />
          <Input
            label="Village / Building / House"
            type="text"
            placeholder="Flat No, Building Name, Village"
            value={addressFullLine}
            onChange={(e) => setAddressFullLine(e.target.value)}
            required
            disabled={isPlacingOrder}
          />
          <Input
            label="Delivery Instructions / Landmark (Optional)"
            type="text"
            placeholder="e.g., Near Hanuman Temple, Call before arriving"
            value={addressInstructions}
            onChange={(e) => setAddressInstructions(e.target.value)}
            disabled={isPlacingOrder}
          />
        </div>

        <div className="flex items-center text-center text-gray-500 my-6 font-semibold text-sm tracking-wide before:flex-1 before:border-b before:border-gray-200 before:mr-4 after:flex-1 after:border-b after:border-gray-200 after:ml-4">
          ORDER CONFIRMATION (COD Only)
        </div>

        <Button
          onClick={handlePlaceOrder}
          className="mt-6"
          isLoading={isPlacingOrder}
          disabled={!isOrderValid || !isAddressValid || isPlacingOrder}
        >
          {isPlacingOrder
            ? 'Confirming Order...'
            : !isOrderValid
            ? `Min Order ₹${MIN_ORDER_AMOUNT.toFixed(2)} / ${MIN_ORDER_QTY} items`
            : !isAddressValid
            ? 'Fill all required address details'
            : 'Confirm Order'}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
