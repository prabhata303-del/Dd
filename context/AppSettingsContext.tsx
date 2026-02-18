
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppSettings, DeliverySettings, ThemeSettings } from '../types';
import { fetchAppSettings } from '../services/firebaseService';

interface AppSettingsContextType {
  settings: AppSettings;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  customerThemeColor: string;
  loading: boolean;
  error: string | null;
}

const defaultAppSettings: AppSettings = {
  theme: { customerThemeColor: '#673AB7' }, // Default Deep Purple
  delivery: { deliveryFee: 10.00, freeDeliveryThreshold: 0 },
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyTheme = useCallback((color: string) => {
    document.documentElement.style.setProperty('--primary-color', color);
    // For the gradient, assume a slightly lighter shade for the start, or just use the color itself for a solid gradient
    const fallbackGradientStart = '#7E57C2'; // A lighter purple, can be dynamic too
    document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${fallbackGradientStart} 0%, ${color} 100%)`);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const fetchedSettings = await fetchAppSettings();
        setSettings(fetchedSettings);
        if (fetchedSettings.theme?.customerThemeColor) {
          applyTheme(fetchedSettings.theme.customerThemeColor);
        }
      } catch (err) {
        console.error("Failed to load app settings:", err);
        setError("Failed to load app settings.");
        // Apply default theme colors if fetching fails
        applyTheme(defaultAppSettings.theme!.customerThemeColor);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [applyTheme]);

  const deliveryFee = settings.delivery?.deliveryFee ?? defaultAppSettings.delivery!.deliveryFee;
  const freeDeliveryThreshold = settings.delivery?.freeDeliveryThreshold ?? defaultAppSettings.delivery!.freeDeliveryThreshold;
  const customerThemeColor = settings.theme?.customerThemeColor ?? defaultAppSettings.theme!.customerThemeColor;

  const contextValue = {
    settings,
    deliveryFee,
    freeDeliveryThreshold,
    customerThemeColor,
    loading,
    error,
  };

  return (
    <AppSettingsContext.Provider value={contextValue}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
