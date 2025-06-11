
import { ApiResponse, PaginatedResponse } from '@/types';
import { PromotionPackage, ListingPromotion, PromoteListingRequest, StripePromotionResponse } from '@/types/promotions';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://haraj-syria.test/api/v1';

const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const isFormData = options?.body instanceof FormData;
    
    const defaultHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Promotions API request failed:', error);
    throw error;
  }
}

export const promotionAPI = {
  // Get available promotion packages
  getPromotionPackages: async (): Promise<ApiResponse<PromotionPackage[]>> => {
    return fetchAPI('/promotion-packages');
  },

  // Promote a listing
  promoteListingWithBankTransfer: async (
    listingId: number,
    data: { promotion_package_id: number; bank_transfer_proof: File; payment_method: 'bank_transfer' }
  ): Promise<ApiResponse<ListingPromotion>> => {
    const formData = new FormData();
    formData.append('promotion_package_id', data.promotion_package_id.toString());
    formData.append('payment_method', 'bank_transfer');
    formData.append('bank_transfer_proof', data.bank_transfer_proof);

    return fetchAPI(`/user/listings/${listingId}/promote`, {
      method: 'POST',
      body: formData,
    });
  },

  promoteListingWithStripe: async (
    listingId: number,
    promotionPackageId: number
  ): Promise<ApiResponse<StripePromotionResponse>> => {
    return fetchAPI(`/user/listings/${listingId}/promote`, {
      method: 'POST',
      body: JSON.stringify({
        promotion_package_id: promotionPackageId,
        payment_method: 'stripe',
      }),
    });
  },

  promoteListingWithWallet: async (
    listingId: number,
    promotionPackageId: number
  ): Promise<ApiResponse<ListingPromotion>> => {
    return fetchAPI(`/listings/${listingId}/promote`, {
      method: 'POST',
      body: JSON.stringify({
        promotion_package_id: promotionPackageId,
        payment_method: 'wallet',
      }),
    });
  },

  // Get user's promotion history
  getUserPromotions: async (): Promise<ApiResponse<PaginatedResponse<ListingPromotion>>> => {
    return fetchAPI('/user/listing-promotions');
  },
};
