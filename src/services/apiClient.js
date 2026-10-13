import { getItem } from './secureStoreService';
import { API_BASE_URL } from './menuService';

/**
 * Shared Authenticated API Client for Kedai Tong Djajakarta
 * Week 5: Task 02 — Attach Token to API Request
 * 
 * Automatically attaches `Authorization: Bearer <access_token>`
 * retrieved from SecureStore to outgoing protected HTTP requests.
 */
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = await getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers,
  });
};

export { API_BASE_URL };
