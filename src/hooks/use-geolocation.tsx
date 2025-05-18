
import { useState } from 'react';

interface LocationData {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('الموقع الجغرافي غير مدعوم في هذا المتصفح');
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
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض طلب الموقع الجغرافي.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متوفرة.';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة طلب الموقع الجغرافي.';
            break;
          default:
            errorMessage = 'حدث خطأ غير معروف أثناء محاولة الحصول على الموقع الجغرافي.';
        }
        setLocationError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return {
    getLocation,
    locationData,
    isLoading,
    locationError
  };
}
