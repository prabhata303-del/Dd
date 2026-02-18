
import React, { useEffect } from 'react';
import { PageId } from '../App';
import PageHeader from '../components/shared/PageHeader';
import Button from '../components/ui/Button';
import QuantityControls from '../components/shared/QuantityControls';
import { useCartWishlist } from '../context/CartWishlistContext';
import { MIN_ORDER_QTY, MIN_ORDER_AMOUNT } from '../constants';

interface CartPageProps {
  showPage: (pageId: PageId) => void;
}

const CartPage: React.FC<CartPageProps> = ({ showPage }) => {
  const { cart, modQty, cartCount, subtotal, deliveryFee, total, isOrderValid, canGetFreeDelivery } = useCartWishlist();

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <PageHeader title="My Cart" showPage={showPage} backTarget="appContainer" />
      <div className="flex-1 p-5 overflow-y-auto">
        {!isOrderValid && (
          <p className="text-danger text-center mb-4">
            Minimum order: {MIN_ORDER_QTY} items AND ₹{MIN_ORDER_AMOUNT.toFixed(2)}
          </p>
        )}
        {canGetFreeDelivery && (
          <p className="text-success text-center mb-4">
            You qualify for free delivery!
          </p>
        )}

        <div className="space-y-3" id="cartItemsContainer">
          {cart.length === 0 ? (
            <p className="text-center text-gray-600 mt-12">
              <i className="fas fa-shopping-basket text-2xl mb-2"></i>
              <br />
              Your cart is empty.
            </p>
          ) : (
            cart.map(item => {
              const itemTotal = item.price * item.quantity;
              const imageUrl = item.img || 'https://picsum.photos/150/150';
              return (
                <div key={item.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                  <img src={imageUrl} alt={item.name} className="w-[65px] h-[65px] rounded-lg object-cover mr-4" />
                  <div className="flex-1">
                    <h4 className="m-0 text-base">{item.name}</h4>
                    <p className="m-0 mt-0.5 text-primary font-semibold text-sm">
                      ₹{item.price.toFixed(2)} x {item.quantity} = ₹{itemTotal.toFixed(2)}
                    </p>
                  </div>
                  <QuantityControls
                    quantity={item.quantity}
                    onDecrease={() => modQty(item.id, -1)}
                    onIncrease={() => modQty(item.id, 1)}
                    buttonVariant="secondary"
                  />
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-8 border-t border-border-color pt-5">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span id="subtotal-price">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery Fee</span>
              <span id="delivery-fee-display">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-gray-900 mt-4">
              <span>Total</span>
              <span id="total-price">₹{total.toFixed(2)}</span>
            </div>
            <Button
              className="mt-6"
              onClick={() => showPage('checkoutPage')}
              disabled={!isOrderValid}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
