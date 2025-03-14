
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from 'date-fns';
import { Listing } from '@/types/listing';
import { 
  MapPin, Clock, Eye, Tag, Truck, Award, 
  DollarSign, Phone, Mail, Building, Globe, User 
} from 'lucide-react';

interface ListingInfoProps {
  listing: Listing;
}

const ListingInfo: React.FC<ListingInfoProps> = ({ listing }) => {
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Parse gallery images (assuming it's a JSON string)
  const getGalleryImages = (): string[] => {
    if (!listing.gallery_images) return [];
    try {
      return JSON.parse(listing.gallery_images);
    } catch (error) {
      console.error('Error parsing gallery images:', error);
      return [];
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Price */}
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-foreground tracking-tight">
              {listing.title}
            </h1>
            <div className="flex items-center space-x-2 mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{listing.address}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(listing.price)}
            </div>
            {listing.negotiable && (
              <span className="text-sm text-muted-foreground">Negotiable</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {listing.is_featured && (
            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
              Featured
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {listing.published_at 
              ? formatDistanceToNow(new Date(listing.published_at), { addSuffix: true })
              : 'Recently'
            }
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {listing.view} {listing.view === 1 ? 'view' : 'views'}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {listing.condition}
          </Badge>
        </div>
      </div>

      <Separator />
      
      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          {listing.description}
        </div>
      </div>
      
      <Separator />
      
      {/* Specifications */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full p-2">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Category</div>
              <div className="font-medium">
                {listing.category?.name || `Category ${listing.category_id}`}
              </div>
            </div>
          </div>
          
          {listing.brand_id && (
            <div className="flex items-center gap-3">
              <div className="bg-muted rounded-full p-2">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Brand</div>
                <div className="font-medium">
                  {listing.brand?.name || `Brand ${listing.brand_id}`}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full p-2">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Condition</div>
              <div className="font-medium">{listing.condition}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full p-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="font-medium">
                {formatPrice(listing.price)}
                {listing.negotiable && <span className="text-sm text-muted-foreground ml-1">(Negotiable)</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full p-2">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="font-medium">
                {listing.location?.full_address || listing.address}
              </div>
            </div>
          </div>
          
          {listing.status && (
            <div className="flex items-center gap-3">
              <div className="bg-muted rounded-full p-2">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium capitalize">{listing.status}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Contact Information */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full p-2">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Phone</div>
              {listing.phone_hidden ? (
                <div className="font-medium text-muted-foreground italic">Contact owner to view</div>
              ) : (
                <div className="font-medium">{listing.phone}</div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full p-2">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{listing.email}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Contact Person</div>
              <div className="font-medium">{listing.contact_name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;
