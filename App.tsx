
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartWishlistProvider } from './context/CartWishlistContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import ThankYouPage from './pages/ThankYouPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import MobileContainer from './components/layout/MobileContainer';
import Navbar from './components/layout/Navbar';
import FAB from './components/layout/FAB';
import { AppSettingsProvider } from './context/AppSettingsContext';

// Define the available pages
export type PageId = 
  'loginPage' | 'registerPage' | 'appContainer' | 'productDetailPage' |
  'cartPage' | 'checkoutPage' | 'ordersPage' | 'wishlistPage' |
  'profilePage' | 'thankYouPage' | 'termsPage' | 'privacyPage';

const AppContent: React.FC = () => {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageId>('appContainer');
  const [pdpDishKey, setPdpDishKey] = useState<string | null>(null);

  // Define pages that require authentication
  const restrictedPages: PageId[] = ['ordersPage', 'wishlistPage', 'profilePage', 'cartPage', 'checkoutPage', 'productDetailPage'];

  const showPage = (pageId: PageId, dishKey?: string) => {
    if (restrictedPages.includes(pageId) && !currentUser && !isAuthLoading) {
      // If trying to access a restricted page without being logged in, redirect to login
      setCurrentPage('loginPage');
      return;
    }
    setCurrentPage(pageId);
    if (pageId === 'productDetailPage' && dishKey) {
      setPdpDishKey(dishKey);
    } else {
      setPdpDishKey(null);
    }
  };

  useEffect(() => {
    // If auth state changes and user logs out, redirect from restricted pages
    if (!currentUser && !isAuthLoading && restrictedPages.includes(currentPage)) {
      setCurrentPage('loginPage');
    }
    // On initial load, if user is not logged in, ensure current page is not restricted
    if (!currentUser && !isAuthLoading && currentPage !== 'loginPage' && currentPage !== 'registerPage' && currentPage !== 'appContainer' && currentPage !== 'termsPage' && currentPage !== 'privacyPage') {
      setCurrentPage('appContainer');
    }
  }, [currentUser, isAuthLoading, currentPage]);

  // Handle back button behavior for restricted pages
  const handleBackToHome = () => {
    if (currentUser) {
      showPage('appContainer');
    } else {
      showPage('loginPage');
    }
  };

  const commonPageProps = { showPage };

  return (
    <MobileContainer>
      {currentPage === 'loginPage' && <LoginPage {...commonPageProps} />}
      {currentPage === 'registerPage' && <RegisterPage {...commonPageProps} />}
      {currentPage === 'appContainer' && (
        <HomePage {...commonPageProps} />
      )}
      {currentPage === 'productDetailPage' && pdpDishKey && (
        <ProductDetailPage {...commonPageProps} dishKey={pdpDishKey} />
      )}
      {currentPage === 'cartPage' && <CartPage {...commonPageProps} />}
      {currentPage === 'checkoutPage' && <CheckoutPage {...commonPageProps} />}
      {currentPage === 'ordersPage' && <OrdersPage {...commonPageProps} />}
      {currentPage === 'wishlistPage' && <WishlistPage {...commonPageProps} />}
      {currentPage === 'profilePage' && <ProfilePage {...commonPageProps} />}
      {currentPage === 'thankYouPage' && <ThankYouPage {...commonPageProps} />}
      {currentPage === 'termsPage' && <TermsAndConditionsPage {...commonPageProps} />}
      {currentPage === 'privacyPage' && <PrivacyPolicyPage {...commonPageProps} />}

      {/* Navigation and FAB should be visible on relevant pages */}
      {(currentPage === 'appContainer' || currentPage === 'ordersPage' || currentPage === 'wishlistPage' || currentPage === 'profilePage') && (
        <>
          <FAB showPage={showPage} />
          <Navbar currentPage={currentPage} showPage={showPage} />
        </>
      )}
    </MobileContainer>
  );
};

const App: React.FC = () => {
  return (
    <AppSettingsProvider>
      <AuthProvider>
        <CartWishlistProvider>
          <AppContent />
        </CartWishlistProvider>
      </AuthProvider>
    </AppSettingsProvider>
  );
};

export default App;
