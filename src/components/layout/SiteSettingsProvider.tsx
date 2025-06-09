
import React, { createContext, useContext, useEffect } from 'react';
import { useSiteIdentity, useBasicSettings, useColorSettings } from '@/hooks/use-api';

interface SiteSettingsContextType {
  siteIdentity: {
    site_logo: string;
    site_white_logo: string;
    site_favicon: string;
  } | null;
  basicSettings: {
    site_title: string;
    site_tag_line: string;
    site_footer_copyright: string;
    user_email_verify_enable_disable: boolean | null;
    user_otp_verify_enable_disable: boolean | null;
  } | null;
  colorSettings: {
    site_main_color_one: string;
    site_main_color_two: string;
    site_main_color_three: string;
    heading_color: string;
    light_color: string;
    extra_light_color: string;
  } | null;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  siteIdentity: null,
  basicSettings: null,
  colorSettings: null,
  isLoading: true,
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

interface SiteSettingsProviderProps {
  children: React.ReactNode;
}

export function SiteSettingsProvider({ children }: SiteSettingsProviderProps) {
  const { data: siteIdentity, isLoading: loadingIdentity } = useSiteIdentity();
  const { data: basicSettings, isLoading: loadingBasic } = useBasicSettings();
  const { data: colorSettings, isLoading: loadingColors } = useColorSettings();

  const isLoading = loadingIdentity || loadingBasic || loadingColors;

  // Apply color settings to CSS variables
  useEffect(() => {
    if (colorSettings) {
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', colorSettings.site_main_color_one);
      root.style.setProperty('--brand-secondary', colorSettings.site_main_color_two);
      root.style.setProperty('--brand-tertiary', colorSettings.site_main_color_three);
      root.style.setProperty('--heading-color', colorSettings.heading_color);
      root.style.setProperty('--light-color', colorSettings.light_color);
      root.style.setProperty('--extra-light-color', colorSettings.extra_light_color);
    }
  }, [colorSettings]);

  // Update document title and favicon
  useEffect(() => {
    if (basicSettings?.site_title) {
      document.title = basicSettings.site_title;
    }
  }, [basicSettings]);

  useEffect(() => {
    if (siteIdentity?.site_favicon) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = siteIdentity.site_favicon;
      } else {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = siteIdentity.site_favicon;
        document.head.appendChild(newFavicon);
      }
    }
  }, [siteIdentity]);

  return (
    <SiteSettingsContext.Provider
      value={{
        siteIdentity,
        basicSettings,
        colorSettings,
        isLoading,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}
