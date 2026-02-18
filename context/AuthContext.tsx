
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CurrentUser, UserData } from '../types';
import { 
  onAuthChanged, signOutUser, registerWithEmail, signInWithEmail, signInWithGoogle,
  fetchUserData, saveNewUserData, checkIsDeliveryPartner
} from '../services/firebaseService';
// Fix: Corrected import path for AppSettings type
import { AppSettings } from '../types';

interface AuthContextType {
  currentUser: CurrentUser | null;
  userData: UserData | null;
  userPincode: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, mobile: string, email: string, password: string, confirmPassword: string, pincode: string, state: string, district: string, addressLine: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refetchUserData: () => Promise<void>; // Added to refetch user data manually
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPincode, setUserPincode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refetchUserData = useCallback(async (firebaseUser: CurrentUser | null) => {
    if (!firebaseUser) {
      setUserData(null);
      setUserPincode(null);
      return;
    }

    try {
      const isDP = await checkIsDeliveryPartner(firebaseUser.uid);
      if (isDP) {
        alert("You are logged in as a Delivery Partner. Please use the Partner App.");
        await signOutUser();
        return;
      }

      const fetchedData = await fetchUserData(firebaseUser.uid);
      if (fetchedData) {
        setUserData(fetchedData);
        setUserPincode(fetchedData.pincode);
      } else {
        // Fallback for new Google users without full data yet
        setUserData({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Google User',
          email: firebaseUser.email || '',
          mobile: '',
          pincode: '',
          address: { state: '', district: '', line: '' },
          profileImageUrl: firebaseUser.photoURL || undefined,
        });
        setUserPincode(''); // Default empty pincode for new Google users
      }
    } catch (err) {
      console.error("Failed to fetch user data in AuthContext:", err);
      setError("Failed to load user profile. Please try again.");
      setUserData(null);
      setUserPincode(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthChanged(async (user) => {
      if (user) {
        const currentFirebaseUser: CurrentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        setCurrentUser(currentFirebaseUser);
        await refetchUserData(currentFirebaseUser);
      } else {
        setCurrentUser(null);
        setUserData(null);
        setUserPincode(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [refetchUserData]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await signInWithEmail(email, password);
      // onAuthChanged will handle setting currentUser and userData
    } catch (err: any) {
      console.error("Login Error:", err);
      setError("Login Failed: Invalid email or password.");
      throw err; // Re-throw for component to catch and display
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, mobile: string, email: string, password: string, confirmPassword: string, pincode: string, state: string, district: string, addressLine: string) => {
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setIsLoading(false);
      throw new Error("Passwords do not match.");
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      throw new Error("Password too short.");
    }
    if (mobile.length !== 10 || isNaN(Number(mobile))) {
      setError("Please enter a valid 10-digit mobile number.");
      setIsLoading(false);
      throw new Error("Invalid mobile number.");
    }
    if (pincode.length !== 6 || isNaN(Number(pincode))) {
      setError("Please enter a valid 6-digit pincode.");
      setIsLoading(false);
      throw new Error("Invalid pincode.");
    }

    try {
      const user = await registerWithEmail(email, password);
      await saveNewUserData(user.uid, {
        name,
        mobile,
        email,
        pincode,
        address: { state, district, line: addressLine },
      });
      // onAuthChanged will handle setting currentUser and userData
    } catch (err: any) {
      console.error("Registration Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please use the Login tab.");
      } else {
        setError("Registration Failed: " + err.message);
      }
      throw err; // Re-throw for component to catch and display
    } finally {
      setIsLoading(false);
    }
  }, []);

  const googleSignIn = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      const fetchedUserData = await fetchUserData(user.uid);
      if (!fetchedUserData) {
        // New Google user, save minimal data
        await saveNewUserData(user.uid, {
          name: user.displayName || 'Google User',
          email: user.email || '',
          mobile: '', // User needs to update this
          pincode: '', // User needs to update this
          address: { state: '', district: '', line: '' },
          profileImageUrl: user.photoURL || undefined,
        });
        alert("Welcome! Please go to your profile to complete your address and mobile number for deliveries.");
      }
      // onAuthChanged will handle setting currentUser and userData
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError("Google Sign-In failed. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signOutUser();
    } catch (err: any) {
      console.error("Logout Error:", err);
      setError("Logout failed. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const contextValue = {
    currentUser,
    userData,
    userPincode,
    isLoading,
    error,
    login,
    register,
    googleSignIn,
    logout,
    clearError,
    refetchUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
