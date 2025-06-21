
export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  city_id: number;
  state_id: number;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  image: string | null;
  state_id: number;
  city_id: number;
  address: string | null;
  email_verified: boolean;
  verified_status: number | null;
  is_suspend: number | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token?: string;
    email_verification_required?: boolean;
    email_sent?: boolean;
    token_expires_in_minutes?: number;
    remaining_attempts?: number;
  } | null;
  errors?: any;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  } | null;
  errors?: any;
}

export interface ResendCodeRequest {
  email: string;
}

export interface ResendCodeResponse {
  success: boolean;
  message: string;
  data: {
    token_expires_in_minutes: number;
    remaining_attempts: number;
  } | null;
  errors?: {
    remaining_attempts?: number;
    wait_minutes?: number;
  };
}

export interface PasswordResetRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface UserSettings {
  security: {
    show_phone_to_buyers: boolean;
    enable_location_tracking: boolean;
    share_usage_data: boolean;
  };
  notifications: {
    enable_all_notifications: boolean;
    new_message_notifications: boolean;
    listing_comment_notifications: boolean;
    weekly_email_summary: boolean;
    email_matching_listings: boolean;
    email_offers_promotions: boolean;
    sms_notifications: boolean;
  };
  general: {
    theme: string;
    language: string;
    show_nearby_listings: boolean;
    show_currency_rates: boolean;
    enable_image_caching: boolean;
    disable_listing_comments: boolean;
  };
}

export interface VerificationInfo {
  id: number;
  user_id: number;
  identification_type: string;
  identification_number: string;
  front_document: string | null;
  back_document: string | null;
  country_id: number;
  state_id: number;
  city_id: number;
  zip_code: string;
  address: string;
  verify_by: number | null;
  status: number;
  status_text: string;
  created_at: string;
  updated_at: string;
  country?: {
    id: number;
    name: string;
    status: number;
  };
  state?: {
    id: number;
    name: string;
  };
  city?: {
    id: number;
    name: string;
  };
}
