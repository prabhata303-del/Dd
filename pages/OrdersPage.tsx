
import React, { useEffect, useState, useCallback } from 'react';
import { PageId } from '../App';
import PageHeader from '../components/shared/PageHeader';
import { useAuth } from '../context/AuthContext';
import { Order, CustomerOrderStatus, OrderItem } from '../types'; // Fix: Imported OrderItem
import { listenForUserOrders, updateOrder, deleteOrder } from '../services/firebaseService';
import Spinner from '../components/ui/Spinner';

interface OrdersPageProps {
  showPage: (pageId: PageId) => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ showPage }) => {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    setLoadingOrders(true);
    let unsubscribe: (() => void) | undefined;
    if (currentUser?.uid) {
      unsubscribe = listenForUserOrders(currentUser.uid, (fetchedOrders) => {
        setOrders(fetchedOrders);
        setLoadingOrders(false);
      });
    } else {
      setOrders([]);
      setLoadingOrders(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser?.uid]);

  const confirmCancelOrder = useCallback(async (orderKey: string) => {
    if (!currentUser) return;
    if (window.confirm("Kya aap sach mein yeh order cancel karna chahte hain? Ek baar cancel hone ke baad wapas nahi ho payega.")) {
      try {
        await updateOrder(orderKey, { status: 'CANCELLED', cancellationReason: 'Cancelled by customer via app.' });
      } catch (e) {
        alert("Order cancel karne mein fail ho gaye. Kripya dobara try karein.");
        console.error("Cancellation Failed:", e);
      }
    }
  }, [currentUser]);

  const confirmDeleteOrder = useCallback(async (orderKey: string) => {
    if (!currentUser) return;
    if (window.confirm("Kya aap sach mein yeh order history se hatana chahte hain?")) {
      try {
        await deleteOrder(orderKey);
      } catch (e) {
        alert("Order history se hatane mein fail ho gaye. Kripya dobara try karein.");
        console.error("Deletion Failed:", e);
      }
    }
  }, [currentUser]);

  const renderOrderCard = (o: Order) => {
    const st = o.customerStatus;
    let s1 = '', s2 = '', s3 = '', s4 = '';

    if (st.startsWith('Cancelled')) {
      s1 = 'passed'; s2 = 'passed'; s3 = 'passed';
    } else if (st !== 'Done') {
      if (st === 'Placed') s1 = 'active';
      else if (st === 'Preparing') { s1 = 'passed'; s2 = 'active'; }
      else if (st === 'On Way') { s1 = 'passed'; s2 = 'passed'; s3 = 'active'; }
    } else if (st === 'Done') {
      s1 = 'passed'; s2 = 'passed'; s3 = 'passed'; s4 = 'active';
    }

    // Fix: Explicitly type orderItems as OrderItem[]
    const orderItems: OrderItem[] = Array.isArray(o.items)
      ? o.items
      : (o.items ? Object.values(o.items) : []);

    const itemsHtml = orderItems.map((item, index) => { // Fix: item is now correctly typed as OrderItem
      const itemPrice = parseFloat(item.price).toFixed(2); // Fix: Access item.price directly
      const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2); // Fix: Access item.price and item.quantity directly
      const itemImage = item.img || 'https://picsum.photos/50/50'; // Fix: Access item.img directly
      const isRemoved = item.status === 'CANCELLED_OUT_OF_STOCK'; // Fix: Access item.status directly
      const itemStatusStyle = isRemoved ? 'opacity-50 line-through' : '';
      const itemStatusText = isRemoved ? `<span class="text-danger text-xs font-semibold">(Out of Stock)</span>` : '';

      return (
        <div key={index} className={`flex items-center mb-2.5 border-b border-gray-100 pb-2.5 ${itemStatusStyle}`}>
          <img src={itemImage} alt={item.name} className="w-[50px] h-[50px] rounded-lg object-cover mr-2.5" /> {/* Fix: Access item.name directly */}
          <div className="flex-1">
            <h5 className="m-0 text-sm">{item.name} {itemStatusText}</h5> {/* Fix: Access item.name directly */}
            <p className="m-0 text-xs text-gray-500">Qty: {item.quantity} | ₹{itemPrice}/each</p> {/* Fix: Access item.quantity directly */}
          </div>
          <span className="font-bold text-text-color flex-shrink-0">₹{itemTotal}</span>
        </div>
      );
    });

    let actionButtonsHtml = null;
    let driverInfoHtml = null;
    const statusColor = st.startsWith('Cancelled') ? 'text-danger' : (st === 'Done' ? 'text-success' : 'text-primary');

    if (st === 'Placed') {
      actionButtonsHtml = (
        <div className="flex mt-3">
          <button
            className="flex-1 bg-danger text-white py-2.5 rounded-lg font-semibold text-sm shadow-none"
            onClick={() => confirmCancelOrder(o.k)}
          >
            <i className="fas fa-times-circle mr-2"></i> Order Cancel Karein
          </button>
        </div>
      );
    } else if (st === 'Done' || st.startsWith('Cancelled')) {
      actionButtonsHtml = (
        <div className="flex mt-3">
          <button
            className="flex-1 bg-gray-500 text-white py-2.5 rounded-lg font-semibold text-sm shadow-none"
            onClick={() => confirmDeleteOrder(o.k)}
          >
            <i className="fas fa-trash-alt mr-2"></i> History Se Hatayein
          </button>
        </div>
      );
    } else if (st === 'On Way' && o.driverDetails) {
      driverInfoHtml = (
        <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-lg mb-4 border border-purple-200">
          <img src={o.driverDetails.imageUrl} alt={o.driverDetails.name} className="w-15 h-15 rounded-full object-cover border-2 border-primary" />
          <div>
            <h4 className="m-0 text-base text-text-color">Delivery Partner: {o.driverDetails.name}</h4>
            <p className="m-0 mt-0.5 text-sm text-gray-500 font-semibold">Mobile: {o.driverDetails.mobile}</p>
            <p className="m-0 mt-0.5 font-bold text-danger text-sm">**Aapka order nikal chuka hai!**</p>
          </div>
        </div>
      );
      actionButtonsHtml = (
        <div className="flex mt-3">
          <button
            className="flex-1 bg-primary text-white py-2.5 rounded-lg font-semibold text-sm"
            onClick={() => window.open(`tel:${o.driverDetails?.mobile}`, '_system')}
          >
            <i className="fas fa-phone mr-2"></i> Call Delivery Boy
          </button>
        </div>
      );
    }

    const trackingBarHtml = (
      <div className="flex justify-between relative mt-6">
        <div className="absolute top-2 left-0 right-0 h-1 bg-gray-100 z-0 rounded-sm"></div>
        <div className={`relative z-10 flex flex-col items-center w-1/4 ${s1}`}>
          <div className="w-4 h-4 bg-gray-200 rounded-full border-2 border-white transition-all duration-300 shadow-sm active:scale-140 data-[passed]:bg-primary data-[active]:bg-primary" data-passed={s1==='passed'} data-active={s1==='active'}></div>
          <p className="text-xs mt-2 text-gray-500 font-semibold uppercase data-[passed]:text-primary data-[active]:text-primary" data-passed={s1==='passed'} data-active={s1==='active'}>Placed</p>
        </div>
        <div className={`relative z-10 flex flex-col items-center w-1/4 ${s2}`}>
          <div className="w-4 h-4 bg-gray-200 rounded-full border-2 border-white transition-all duration-300 shadow-sm data-[passed]:bg-primary data-[active]:bg-primary" data-passed={s2==='passed'} data-active={s2==='active'}></div>
          <p className="text-xs mt-2 text-gray-500 font-semibold uppercase data-[passed]:text-primary data-[active]:text-primary" data-passed={s2==='passed'} data-active={s2==='active'}>Prep</p>
        </div>
        <div className={`relative z-10 flex flex-col items-center w-1/4 ${s3}`}>
          <div className="w-4 h-4 bg-gray-200 rounded-full border-2 border-white transition-all duration-300 shadow-sm data-[passed]:bg-primary data-[active]:bg-primary" data-passed={s3==='passed'} data-active={s3==='active'}></div>
          <p className="text-xs mt-2 text-gray-500 font-semibold uppercase data-[passed]:text-primary data-[active]:text-primary" data-passed={s3==='passed'} data-active={s3==='active'}>On Way</p>
        </div>
        <div className={`relative z-10 flex flex-col items-center w-1/4 ${s4}`}>
          <div className="w-4 h-4 bg-gray-200 rounded-full border-2 border-white transition-all duration-300 shadow-sm data-[passed]:bg-primary data-[active]:bg-primary data-[passed]:bg-danger data-[passed]:bg-primary" data-passed={s4==='passed'} data-active={s4==='active'}></div>
          <p className={`text-xs mt-2 font-semibold uppercase data-[passed]:text-primary data-[active]:text-primary ${st.startsWith('Cancelled') ? 'text-danger' : 'text-gray-500'}`} data-passed={s4==='passed'} data-active={s4==='active'}>{st}</p>
        </div>
      </div>
    );

    return (
      <div key={o.k} id={`order-${o.k}`} className="bg-white rounded-xl p-5 mb-5 shadow-sm">
        <div className="flex justify-between font-semibold mb-2.5">
          <span>Order ID: #{o.k.substring(1, 6)}</span>
          <span className={statusColor}>{st}</span>
        </div>

        {driverInfoHtml}

        <div className="my-4 p-2.5 bg-gray-50 rounded-lg">
          {itemsHtml}
          <div className="flex justify-between font-bold mt-2.5 pt-2.5 border-t border-dashed border-gray-200">
            <span>Payment Method:</span>
            <span className="text-success">{o.method}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-primary mt-1.5">
            <span>Total Amount:</span>
            <span>₹{o.total}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-2.5 mb-5">
          **Delivering to:** {o.address}
        </p>

        {o.cancellationReason && o.status.startsWith('CANCELLED') && (
          <p className="text-danger text-sm font-semibold mt-2.5">Cancellation Reason: {o.cancellationReason}</p>
        )}

        {trackingBarHtml}

        {actionButtonsHtml}
      </div>
    );
  };

  if (isAuthLoading) {
    return (
      <div className="absolute inset-0 bg-secondary flex flex-col z-10">
        <PageHeader title="My Orders" showPage={showPage} backTarget="appContainer" />
        <div className="flex-1 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <PageHeader title="My Orders" showPage={showPage} backTarget="appContainer" />
      <div className="flex-1 p-5 overflow-y-auto" id="ordersListContainer">
        {orders.length === 0 && !loadingOrders ? (
          <p className="text-center text-gray-600 p-5">Abhi koi order nahi hai. Naya order place karein!</p>
        ) : loadingOrders ? (
          <div className="text-center p-5">Loading orders...</div>
        ) : (
          orders.map(renderOrderCard)
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
