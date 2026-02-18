
// --- User Types ---
export interface Address {
  state: string;
  district: string;
  line: string;
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  mobile: string;
  pincode: string;
  address: Address;
  profileImageUrl?: string;
  createdAt?: string;
}

export interface CurrentUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// --- Product/Dish Types ---
export interface Price {
  final: number; // The base final price before any discounts
  restaurantPrice: number;
  adminFee: number;
}

export interface Dish {
  key: string;
  name: string;
  description: string;
  unit: string;
  imageUrl: string; // Main image URL
  images?: string[]; // Array of additional image URLs for PDP
  categoryId: string;
  pincode: string; // 'ALL' or specific pincode
  discount: number; // Percentage discount
  price: Price;
  customerPrice: number; // Calculated price after discount for display
  isInStock?: boolean; // New field for stock status
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface SliderImage {
  downloadURL: string;
  title: string;
}

// --- Cart & Wishlist Types ---
export interface CartItem {
  id: string; // Dish key
  name: string;
  price: number; // Discounted customer price
  img: string;
  quantity: number;
}

export interface WishlistItem {
  key: string; // Dish key
  name: string;
  price: number; // Discounted customer price
  imageUrl: string;
  discount: number;
  unit: string;
}

// --- Order Types ---
export interface OrderItem {
  id: string;
  name: string;
  price: string; // Stored as string to retain precision
  img: string;
  quantity: number;
  restaurantPrice: string; // Stored as string
  adminFee: string; // Stored as string
  status?: 'CANCELLED_OUT_OF_STOCK'; // For items removed by Admin/DP
}

export interface DriverDetails {
  name: string;
  mobile: string;
  imageUrl: string;
}

export type OrderStatus = 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'CANCELLED_BY_DP' | 'CANCELLED_NO_ITEMS' | 'CANCELLED_BY_ADMIN';
export type CustomerOrderStatus = 'Placed' | 'Preparing' | 'On Way' | 'Done' | 'Cancelled' | 'Cancelled (DP)' | 'Cancelled (No Items)' | 'Cancelled (Admin)' | 'Processing';

export interface Order {
  k: string; // Firebase key for the order
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: string;
  deliveryFee: string;
  total: string;
  status: OrderStatus;
  customerStatus: CustomerOrderStatus; // User-friendly status
  method: 'COD' | 'Online';
  timestamp: number;
  dboyId?: string;
  driverDetails?: DriverDetails;
  cancellationReason?: string;
}

// --- Firebase Configuration ---
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// --- App Settings ---
export interface ThemeSettings {
  customerThemeColor: string;
}

export interface DeliverySettings {
  deliveryFee: number;
  freeDeliveryThreshold: number;
}

export interface AppSettings {
  theme?: ThemeSettings;
  delivery?: DeliverySettings;
}
