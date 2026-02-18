
import { FirebaseConfig, Category, Dish, SliderImage, DriverDetails, CustomerOrderStatus, OrderStatus } from './types';

export const FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyD2ZpkPF0EIT4uK0YULGgBvfU7kHeCml2Q",
  authDomain: "shuvidha-seva-32df0.firebaseapp.com",
  databaseURL: "https://shuvidha-seva-32df0-default-rtdb.firebaseio.com",
  projectId: "shuvidha-seva-32df0",
  storageBucket: "shuvidha-seva-32df0.firebasestorage.app",
  messagingSenderId: "508915247632",
  appId: "1:50891547632:web:91c3df82b4eae3c750f895",
  measurementId: "G-MQ6BPYD4EP"
};

export const MIN_ORDER_QTY = 3;
export const MIN_ORDER_AMOUNT = 50;
export const MAX_ITEM_QTY = 5;

export const PLACEHOLDER_CATEGORIES: Category[] = [
  { id: "fastfood", name: "Fast Food", imageUrl: "https://cdn-icons-png.flaticon.com/512/857/857681.png" },
  { id: "grocery", name: "Grocery", imageUrl: "https://cdn-icons-png.flaticon.com/512/3081/3081977.png" },
  { id: "treats", name: "Treats", imageUrl: "https://cdn-icons-png.flaticon.com/512/4740/4740118.png" },
  { id: "indian", name: "Indian", imageUrl: "https://cdn-icons-png.flaticon.com/512/5753/5753127.png" },
];

export const PLACEHOLDER_SLIDER_IMAGES: SliderImage[] = [
  { downloadURL: "https://i.ibb.co/SwMq0bXj/Picsart-26-01-27-11-31-49-432.png", title: "Aapki Suvidha, Hamari Seva" },
];

export const PLACEHOLDER_DISHES: Dish[] = [
  {
    key: "dish_ff1",
    name: "Mega Meal Burger Combo",
    price: { final: 180.00, restaurantPrice: 150.00, adminFee: 30.00 },
    discount: 15,
    unit: "1 Combo",
    description: "Extra large double patty burger with crispy fries and a soft drink.",
    imageUrl: "https://i.ibb.co/hJ3RSF0f/pngtree-group-of-fast-food-products-png-image-14008130.png",
    images: ["https://i.ibb.co/hJ3RSF0f/pngtree-group-of-fast-food-products-png-image-14008130.png"],
    categoryId: "fastfood",
    pincode: "ALL",
    isInStock: true,
    customerPrice: 180.00 * (1 - 15 / 100),
  },
  {
    key: "dish_ff2",
    name: "Aloo Samosa (3 Pcs)",
    price: { final: 45.00, restaurantPrice: 35.00, adminFee: 10.00 },
    discount: 0,
    unit: "3 Pieces",
    description: "Crispy and hot potato samosas with tangy chutney.",
    imageUrl: "https://i.ibb.co/yFJw2NQm/samosa-recipe.jpg",
    images: ["https://i.ibb.co/yFJw2NQm/samosa-recipe.jpg"],
    categoryId: "fastfood",
    pincode: "ALL",
    isInStock: true,
    customerPrice: 45.00,
  },
  {
    key: "dish_gr1",
    name: "Fourtun Kachi Ghani 1kg",
    price: { final: 70.00, restaurantPrice: 65.00, adminFee: 5.00 },
    discount: 0,
    unit: "1kg Pouch",
    description: "Vacuum sealed for extra freshness.",
    imageUrl: "https://i.ibb.co/0j6w4zyL/61qs-W9-zfa-L-SX679.jpg",
    images: ["https://i.ibb.co/0j6w4zyL/61qs-W9-zfa-L-SX679.jpg"],
    categoryId: "grocery",
    pincode: "ALL",
    isInStock: true,
    customerPrice: 70.00,
  },
  {
    key: "dish_gr2",
    name: "Fourtun Soya Health 1Kg",
    price: { final: 65.00, restaurantPrice: 60.00, adminFee: 5.00 },
    discount: 5,
    unit: "1 Kg Pack",
    description: "Whole wheat flour for soft rotis.",
    imageUrl: "https://i.ibb.co/pBKKxD0t/612-KEk-Qn-TJL-SX679.jpg",
    images: ["https://i.ibb.co/pBKKxD0t/612-KEk-Qn-TJL-SX679.jpg"],
    categoryId: "grocery",
    pincode: "ALL",
    isInStock: true,
    customerPrice: 65.00 * (1 - 5 / 100),
  },
  {
    key: "dish_tr1",
    name: "Premium Chocolate Bar",
    price: { final: 180.00, restaurantPrice: 160.00, adminFee: 20.00 },
    discount: 10,
    unit: "1 Large Bar",
    description: "A delicious milk chocolate bar with crunchy bits and a smooth center.",
    imageUrl: "https://i.ibb.co/7JXPjrVT/sliding-images-jpeg-1df64a82-d773-41cd-bcdd-d919c0d65374jpgts1715597648-de4a52a2-8ad3-4360-bd6c-3493.jpg",
    images: ["https://i.ibb.co/7JXPjrVT/sliding-images-jpeg-1df64a82-d773-41cd-bcdd-d919c0d65374jpgts1715597648-de4a52a2-8ad3-4360-bd6c-3493.jpg"],
    categoryId: "treats",
    pincode: "ALL",
    isInStock: true,
    customerPrice: 180.00 * (1 - 10 / 100),
  },
];

export const SIMULATED_DRIVER: DriverDetails = {
  name: "Rajesh Kumar (Fallback)",
  mobile: "9876543210",
  imageUrl: "https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
};

export const CUSTOMER_STATUS_MAP: Record<OrderStatus, CustomerOrderStatus> = {
  'PLACED': 'Placed',
  'ACCEPTED': 'Preparing',
  'PREPARING': 'Preparing',
  'READY_FOR_PICKUP': 'Preparing',
  'PICKED_UP': 'On Way',
  'OUT_FOR_DELIVERY': 'On Way',
  'DELIVERED': 'Done',
  'CANCELLED': 'Cancelled',
  'CANCELLED_BY_DP': 'Cancelled (DP)',
  'CANCELLED_NO_ITEMS': 'Cancelled (No Items)',
  'CANCELLED_BY_ADMIN': 'Cancelled (Admin)'
};
