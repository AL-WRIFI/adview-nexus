
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  lat?: string;
  lon?: string;
  address: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ lat, lon, address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  const hasCoordinates = lat && lon && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon));
  
  return (
    <div className="rounded-xl overflow-hidden border bg-card shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Location
        </h3>
      </div>
      
      <div className="aspect-video relative overflow-hidden bg-muted">
        {hasCoordinates ? (
          <img 
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lon}&key=YOUR_API_KEY`}
            alt="Map location"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full p-6 text-center text-muted-foreground">
            <div>
              <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p>Map location not available</p>
              <p className="text-sm mt-2">{address}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-sm text-muted-foreground">{address}</p>
      </div>
    </div>
  );
};

export default LocationMap;
