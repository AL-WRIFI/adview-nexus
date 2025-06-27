
import { useState, useEffect } from 'react';

interface GeolocationState {
  lat: number | null;
  lon: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    lat: null,
    lon: null,
    accuracy: null,
    loading: false,
    error: null
  });

  const getCurrentLocation = () => {
    // Check if location is already stored
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      const parsed = JSON.parse(storedLocation);
      setLocation({
        lat: parsed.lat,
        lon: parsed.lon,
        accuracy: parsed.accuracy || null,
        loading: false,
        error: null
      });
      return;
    }

    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by this browser.'
      }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null
        };
        
        setLocation(newLocation);
        
        // Store in localStorage for future use
        localStorage.setItem('userLocation', JSON.stringify({
          lat: newLocation.lat,
          lon: newLocation.lon,
          accuracy: newLocation.accuracy,
          timestamp: Date.now()
        }));
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const clearLocation = () => {
    localStorage.removeItem('userLocation');
    setLocation({
      lat: null,
      lon: null,
      accuracy: null,
      loading: false,
      error: null
    });
  };

  useEffect(() => {
    // Auto-load stored location on mount
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      const parsed = JSON.parse(storedLocation);
      const isStale = Date.now() - parsed.timestamp > 1800000; // 30 minutes
      
      if (!isStale) {
        setLocation({
          lat: parsed.lat,
          lon: parsed.lon,
          accuracy: parsed.accuracy || null,
          loading: false,
          error: null
        });
      }
    }
  }, []);

  return {
    ...location,
    getCurrentLocation,
    clearLocation,
    hasLocation: location.lat !== null && location.lon !== null
  };
}
