
import React, { createContext, useContext, useEffect } from 'react';
import { useColorSettings, useBasicSettings, useSiteIdentity } from '@/hooks/use-settings';
import { applyDynamicStyles } from '@/utils/dynamic-styles';
import type { ApiResponse } from '@/types';
import type { ColorSettings, BasicSettings, SiteIdentity } from '@/services/settings-api';

interface SiteSettingsContextType {
  applyColorSettings: () => void;
  siteData: {
    colors?: ColorSettings;
    basic?: BasicSettings;
    identity?: SiteIdentity;
  };
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return context;
};

interface SiteSettingsProviderProps {
  children: React.ReactNode;
}

export function SiteSettingsProvider({ children }: SiteSettingsProviderProps) {
  const { data: colorSettings, isLoading: colorsLoading } = useColorSettings();
  const { data: basicSettings, isLoading: basicLoading } = useBasicSettings();
  const { data: siteIdentity, isLoading: identityLoading } = useSiteIdentity();

  const applyColorSettings = () => {
    const colorData = (colorSettings as ApiResponse<ColorSettings>)?.data;
    if (!colorData) {
      console.log('⚠️ No color data available');
      return;
    }

    const isDarkMode = document.documentElement.classList.contains('dark');
    console.log('🎨 Applying colors:', colorData);
    applyDynamicStyles(colorData, isDarkMode ? 'dark' : 'light');
  };

  // Apply colors when data loads
  useEffect(() => {
    const colorData = (colorSettings as ApiResponse<ColorSettings>)?.data;
    if (colorData) {
      console.log('📥 Color settings loaded, applying...', colorData);
      applyColorSettings();
    }
  }, [colorSettings]);

  // Apply title from basic settings
  useEffect(() => {
    const basicData = (basicSettings as ApiResponse<BasicSettings>)?.data;
    if (basicData?.site_title) {
      document.title = basicData.site_title;
    }
  }, [basicSettings]);

  // Apply favicon
  useEffect(() => {
    const identityData = (siteIdentity as ApiResponse<SiteIdentity>)?.data;
    if (identityData?.site_favicon) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = identityData.site_favicon;
      } else {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = identityData.site_favicon;
        document.head.appendChild(newFavicon);
      }
    }
  }, [siteIdentity]);

  const value = {
    applyColorSettings,
    siteData: {
      colors: (colorSettings as ApiResponse<ColorSettings>)?.data,
      basic: (basicSettings as ApiResponse<BasicSettings>)?.data,
      identity: (siteIdentity as ApiResponse<SiteIdentity>)?.data,
    },
    isLoading: colorsLoading || basicLoading || identityLoading,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
