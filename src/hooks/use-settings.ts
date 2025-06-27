
import { useQuery } from '@tanstack/react-query';
import { settingsAPI } from '@/services/settings-api';

// Hook to fetch site identity
export const useSiteIdentity = () => {
  return useQuery({
    queryKey: ['site-identity'],
    queryFn: () => settingsAPI.getSiteIdentity(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch basic settings
export const useBasicSettings = () => {
  return useQuery({
    queryKey: ['basic-settings'],
    queryFn: () => settingsAPI.getBasicSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch color settings
export const useColorSettings = () => {
  return useQuery({
    queryKey: ['color-settings'],
    queryFn: () => settingsAPI.getColorSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch listing settings
export const useListingSettings = () => {
  return useQuery({
    queryKey: ['listing-settings'],
    queryFn: () => settingsAPI.getListingSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Comprehensive hook for all settings
export const useAllSettings = () => {
  const siteIdentity = useSiteIdentity();
  const basicSettings = useBasicSettings();
  const colorSettings = useColorSettings();
  const listingSettings = useListingSettings();
  
  return {
    siteIdentity,
    basicSettings,
    colorSettings,
    listingSettings,
    isLoading: siteIdentity.isLoading || basicSettings.isLoading || colorSettings.isLoading || listingSettings.isLoading,
    isError: siteIdentity.isError || basicSettings.isError || colorSettings.isError || listingSettings.isError
  };
};
