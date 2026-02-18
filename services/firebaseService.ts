
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseAuthUser
} from "firebase/auth";
import { 
  getDatabase, 
  ref, 
  get, 
  set, 
  onValue, 
  remove, 
  push,
  update,
  Unsubscribe // Import Unsubscribe type
} from "firebase/database";

import { FIREBASE_CONFIG, PLACEHOLDER_DISHES, PLACEHOLDER_CATEGORIES, PLACEHOLDER_SLIDER_IMAGES, SIMULATED_DRIVER, CUSTOMER_STATUS_MAP } from '../constants';
import { 
  UserData, Dish, Category, SliderImage, WishlistItem, CartItem, Order, OrderItem,
  AppSettings, DeliverySettings, ThemeSettings, CurrentUser, CustomerOrderStatus, OrderStatus, DriverDetails
} from '../types';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getDatabase(app);

// --- Auth Functions ---
export const registerWithEmail = async (email: string, password: string): Promise<FirebaseAuthUser> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInWithEmail = async (email: string, password: string): Promise<FirebaseAuthUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInWithGoogle = async (): Promise<FirebaseAuthUser> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const onAuthChanged = (callback: (user: FirebaseAuthUser | null) => void): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};

// --- User Data Functions ---
export const saveNewUserData = async (uid: string, data: Partial<UserData>): Promise<void> => {
  await set(ref(db, 'users/' + uid), { 
    ...data,
    createdAt: new Date().toISOString()
  });
};

export const fetchUserData = async (uid: string): Promise<UserData | null> => {
  const snapshot = await get(ref(db, 'users/' + uid));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      uid: uid,
      name: data.name || 'User Name',
      email: data.email || null,
      mobile: data.mobile || '',
      pincode: data.pincode || '',
      address: {
        state: data.address?.state || '',
        district: data.address?.district || '',
        line: data.address?.line || '',
      },
      profileImageUrl: data.profileImageUrl || undefined,
      createdAt: data.createdAt || undefined,
    };
  }
  return null;
};

export const checkIsDeliveryPartner = async (uid: string): Promise<boolean> => {
  const dpCheck = await get(ref(db, 'delivery_partners/' + uid));
  return dpCheck.exists();
};

// --- App Settings (Theme & Delivery) ---
export const fetchAppSettings = async (): Promise<AppSettings> => {
  try {
    const settingsRef = ref(db, 'settings');
    const snapshot = await get(settingsRef);
    const settings = snapshot.val() || {};
    
    return {
      theme: {
        customerThemeColor: settings.theme?.customerThemeColor || '#673AB7',
      },
      delivery: {
        deliveryFee: parseFloat(settings.delivery?.deliveryFee || 10.00),
        freeDeliveryThreshold: parseFloat(settings.delivery?.freeDeliveryThreshold || 0),
      },
    };
  } catch (e) {
    console.error("Failed to fetch settings:", e);
    // Fallback to defaults
    return {
      theme: { customerThemeColor: '#673AB7' },
      delivery: { deliveryFee: 10.00, freeDeliveryThreshold: 0 },
    };
  }
};

// --- Data Fetching (Categories, Dishes, Banners) ---
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const snapshot = await get(ref(db, 'categories'));
    const categoriesData: Category[] = [];
    snapshot.forEach(c => { categoriesData.push({ id: c.key || '', ...c.val() }); });
    return categoriesData.length > 0 ? categoriesData : PLACEHOLDER_CATEGORIES;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return PLACEHOLDER_CATEGORIES;
  }
};

export const fetchDishes = async (userPincode: string | null): Promise<Dish[]> => {
  try {
    const snapshot = await get(ref(db, 'dishes'));
    const dishesData: Dish[] = [];
    snapshot.forEach(d => {
      const dish = { key: d.key || '', ...d.val() };
      // Ensure categoryId and pincode are always strings
      dish.categoryId = (dish.categoryId || 'uncategorized').toString();
      dish.pincode = (dish.pincode || 'ALL').toString();
      dish.discount = dish.discount || 0;
      dish.unit = dish.unit || 'Unit N/A';
      dish.description = dish.description || 'No description available.';
      dish.isInStock = dish.isInStock === undefined ? true : dish.isInStock;

      dish.price = dish.price && typeof dish.price === 'object'
        ? dish.price
        : { final: parseFloat(dish.price || 0), restaurantPrice: parseFloat(dish.price || 0), adminFee: 0 };

      const finalPriceBeforeDiscount = parseFloat(dish.price.final || 0);
      dish.customerPrice = finalPriceBeforeDiscount * (1 - dish.discount / 100);

      dish.images = Array.isArray(dish.images) && dish.images.length > 0 ? dish.images : [dish.imageUrl || 'https://picsum.photos/150/110'];

      if (userPincode && dish.pincode !== 'ALL' && dish.pincode !== userPincode) {
        return; // Skip if dish is not for user's pincode
      }
      dishesData.push(dish);
    });
    return dishesData;
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return PLACEHOLDER_DISHES.map(d => ({
      ...d,
      customerPrice: d.price.final * (1 - (d.discount || 0) / 100),
      images: Array.isArray(d.images) && d.images.length > 0 ? d.images : [d.imageUrl || 'https://picsum.photos/150/110'],
    }));
  }
};

export const fetchBanners = async (): Promise<SliderImage[]> => {
  try {
    const snapshot = await get(ref(db, 'banners'));
    const sliderImages: SliderImage[] = [];
    snapshot.forEach(s => {
      const banner = s.val();
      if (banner.imageUrl) {
        sliderImages.push({ downloadURL: banner.imageUrl, title: banner.title });
      }
    });
    return sliderImages.length > 0 ? sliderImages : PLACEHOLDER_SLIDER_IMAGES;
  } catch (error) {
    console.error("Error fetching banners:", error);
    // Fix: Corrected typo from PLACEER_SLIDER_IMAGES to PLACEHOLDER_SLIDER_IMAGES
    return PLACEHOLDER_SLIDER_IMAGES;
  }
};

// --- Wishlist Functions ---
export const listenForWishlistUpdates = (uid: string, callback: (wishlistItems: string[]) => void): Unsubscribe => {
  const wishlistRef = ref(db, `users/${uid}/wishlist`);
  return onValue(wishlistRef, (snapshot) => {
    const wishlistKeys: string[] = [];
    if (snapshot.exists()) {
      snapshot.forEach(childSnap => {
        wishlistKeys.push(childSnap.key || '');
      });
    }
    callback(wishlistKeys);
  });
};

export const addWishlistItem = async (uid: string, dish: WishlistItem): Promise<void> => {
  await set(ref(db, `users/${uid}/wishlist/${dish.key}`), dish);
};

export const removeWishlistItem = async (uid: string, dishKey: string): Promise<void> => {
  await remove(ref(db, `users/${uid}/wishlist/${dishKey}`));
};

export const fetchWishlistItems = async (uid: string): Promise<WishlistItem[]> => {
  const snapshot = await get(ref(db, `users/${uid}/wishlist`));
  const items: WishlistItem[] = [];
  if (snapshot.exists()) {
    snapshot.forEach(childSnap => {
      items.push(childSnap.val());
    });
  }
  return items;
};

// --- Order Functions ---
export const placeNewOrder = async (orderData: Omit<Order, 'k' | 'customerStatus'>): Promise<string> => {
  const newOrderRef = push(ref(db, 'orders'));
  await set(newOrderRef, orderData);
  return newOrderRef.key || '';
};

export const listenForUserOrders = (uid: string, callback: (orders: Order[]) => void): Unsubscribe => {
  const ordersRef = ref(db, 'orders');
  return onValue(ordersRef, async (snapshot) => {
    const userOrders: Order[] = [];
    const dpPromises: Promise<void>[] = [];
    const dpCache: { [key: string]: DriverDetails } = {};

    snapshot.forEach(childSnap => {
      const val = childSnap.val();
      if (val.userId === uid) {
        const customerStatus: CustomerOrderStatus = CUSTOMER_STATUS_MAP[val.status as OrderStatus] || 'Processing';
        const order: Order = { k: childSnap.key || '', ...val, customerStatus };

        if (order.customerStatus === 'On Way' && order.dboyId) {
          if (!dpCache[order.dboyId]) {
            dpPromises.push(
              get(ref(db, `delivery_partners/${order.dboyId}`))
                .then(dpSnap => {
                  const dpData = dpSnap.val();
                  dpCache[order.dboyId] = dpData ? {
                    name: dpData.name,
                    mobile: dpData.mobile,
                    imageUrl: dpData.profileImageUrl || 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png'
                  } : SIMULATED_DRIVER;
                })
                .catch(e => {
                  console.error("Error fetching DP data:", e);
                  dpCache[order.dboyId] = SIMULATED_DRIVER;
                })
            );
          }
        }
        userOrders.push(order);
      }
    });

    await Promise.all(dpPromises);

    const ordersWithDriverDetails = userOrders.map(order => {
      if (order.customerStatus === 'On Way' && order.dboyId) {
        return { ...order, driverDetails: dpCache[order.dboyId] };
      }
      return order;
    });

    ordersWithDriverDetails.sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
    callback(ordersWithDriverDetails);
  });
};

export const updateOrder = async (orderKey: string, updates: Partial<Order>): Promise<void> => {
  await update(ref(db, `orders/${orderKey}`), updates);
};

export const deleteOrder = async (orderKey: string): Promise<void> => {
  await remove(ref(db, `orders/${orderKey}`));
};
