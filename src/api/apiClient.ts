
import { toast } from "sonner";

const API_BASE_URL = "http://192.168.38.236:8000/api/v1";

// Helper function to get the authentication token
const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Function to refresh the token
const refreshToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Clear tokens if refresh fails
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return false;
  }
};

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiClientOptions {
  requiresAuth?: boolean;
  headers?: Record<string, string>;
}

// Main API client function
export const apiClient = async <T>(
  endpoint: string,
  method: RequestMethod = 'GET',
  data?: any,
  options: ApiClientOptions = { requiresAuth: true }
): Promise<T> => {
  const { requiresAuth = true, headers: customHeaders = {} } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders,
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Redirect to login or handle unauthorized state
      toast.error('Необходима авторизация');
      throw new Error('Unauthorized: Token not found');
    }
  }

  const config: RequestInit = {
    method,
    headers,
    mode: 'cors',
  };

  if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
    config.body = JSON.stringify(data);
  }

  try {
    let response = await fetch(url, config);

    // Handle 401 (Unauthorized) by attempting to refresh token
    if (response.status === 401 && requiresAuth) {
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        // Update headers with new token
        const newToken = getToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          config.headers = headers;
        }
        
        // Retry the request
        response = await fetch(url, config);
      } else {
        // If refresh failed, throw authentication error
        throw new Error('Authentication failed');
      }
    }

    if (!response.ok) {
      // Handle different error statuses
      if (response.status === 404) {
        throw new Error(`Resource not found: ${endpoint}`);
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to access this resource');
      } else if (response.status === 500) {
        throw new Error('Server error occurred');
      }

      // Try to get error details from response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    // For DELETE requests or when no content is expected
    if (response.status === 204 || method === 'DELETE') {
      return {} as T;
    }

    // Parse the JSON response
    const responseData = await response.json();
    return responseData as T;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};
