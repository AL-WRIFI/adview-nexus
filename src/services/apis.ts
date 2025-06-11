import { ApiResponse, PaginatedResponse, Listing, Comment, User, SearchFilters, Favorite, Category, SubCategory, Brand, State, City } from '@/types';

    // Configuration - Update to use the correct API URL
    const API_CONFIG = {
    BASE_URL: 'http://haraj-syria.test/api/v1',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    } as const;

class TokenManager {
    private static readonly TOKEN_KEY = 'authToken';
    private static readonly SESSION_TOKEN_KEY = 'sessionAuthToken';

    static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.SESSION_TOKEN_KEY);
    }

    static setToken(token: string, remember: boolean = true): void {
    if (remember) {
        localStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.removeItem(this.SESSION_TOKEN_KEY);
    } else {
        sessionStorage.setItem(this.SESSION_TOKEN_KEY, token);
        localStorage.removeItem(this.TOKEN_KEY);
    }
    }

    static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.SESSION_TOKEN_KEY);
    }

    static hasToken(): boolean {
    return !!this.getToken();
    }
}

// HTTP Client with retry logic and proper error handling
class ApiClient {
    private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
    ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const token = TokenManager.getToken();
    
    console.log(`API Request: ${options.method || 'GET'} ${url} (attempt 1)`);
    
    const isFormData = options.body instanceof FormData;
    
    const defaultHeaders: Record<string, string> = {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    };

    const requestOptions: RequestInit = {
        ...options,
        headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
        },
        mode: 'cors', // Enable CORS
        credentials: 'include', // Include credentials
    };

    for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
        try {
        if (attempt > 1) {
            console.log(`API Request: ${options.method || 'GET'} ${url} (attempt ${attempt})`);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const response = await fetch(url, {
            ...requestOptions,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 401) {
            TokenManager.removeToken();
            window.location.href = '/auth/login';
            throw new Error('Authentication required');
            }

            throw new Error(
            errorData.message || 
            `API Error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        return data as T;

        } catch (error) {
        console.error(`API request attempt ${attempt} failed:`, error);
        
        if (attempt === API_CONFIG.RETRY_ATTEMPTS) {
            throw error;
        }
        
        await new Promise(resolve => 
            setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt)
        );
        }
    }

    throw new Error('Max retry attempts exceeded');
    }

    static get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
    }

    static post<T>(endpoint: string, data?: any): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request<T>(endpoint, { method: 'POST', body });
    }

    static put<T>(endpoint: string, data?: any): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request<T>(endpoint, { method: 'PUT', body });
    }

    static delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
    }
}



export const profileAPI = {
    getProfile: (): Promise<ApiResponse<User>> => 
        ApiClient.get('/user/profile'),

    updateProfile: (data: FormData): Promise<ApiResponse<User>> => 
        ApiClient.post('/user/profile', data),

    getUserStats: (): Promise<ApiResponse<any>> => 
        ApiClient.get('/user/stats'),

    getFavorites: (): Promise<ApiResponse<PaginatedResponse<Favorite>>> => 
        ApiClient.get('/user/favorites'),

    addToFavorites: (listingId: number): Promise<ApiResponse<void>> => 
        ApiClient.post(`/user/listings/${listingId}/favorite`),

    removeFromFavorites: (listingId: number): Promise<ApiResponse<void>> => 
        ApiClient.delete(`/user/listings/${listingId}/favorite`),

    checkIsFavorite: (listingId: number): Promise<ApiResponse<{ is_favorite: boolean }>> => 
        ApiClient.get(`/user/listings/${listingId}/is-favorite`),
};