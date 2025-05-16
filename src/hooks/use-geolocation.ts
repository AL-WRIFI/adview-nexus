
import { useState, useCallback } from 'react';

type LocationData = {
  lat: number;
  lng: number;
};

type GeolocationError = 
  | 'PERMISSION_DENIED' 
  | 'POSITION_UNAVAILABLE' 
  | 'TIMEOUT' 
  | 'UNKNOWN_ERROR';

interface UseGeolocationReturn {
  locationData: LocationData | null;
  locationError: GeolocationError | null;
  getLocation: () => void;
  isLoading: boolean;
}

export function useGeolocation(): UseGeolocationReturn {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<GeolocationError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('POSITION_UNAVAILABLE');
      return;
    }

    setIsLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('PERMISSION_DENIED');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('POSITION_UNAVAILABLE');
            break;
          case error.TIMEOUT:
            setLocationError('TIMEOUT');
            break;
          default:
            setLocationError('UNKNOWN_ERROR');
        }
      }
    );
  }, []);

  return { locationData, locationError, getLocation, isLoading };
}
