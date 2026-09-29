import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * SecureStore Service for Kedai Tong Djajakarta
 * 
 * Provides encrypted storage for sensitive data (auth session, tokens, credentials)
 * utilizing native iOS Keychain and Android Keystore via expo-secure-store.
 * Includes graceful fallback for Web environments (such as web preview/testing).
 * 
 * NOTE: Sensitive credentials are never logged to console or displayed in plain text.
 */

// Memory fallback cache in case platform storage is unavailable
const memoryStorage = new Map();

/**
 * Checks if native SecureStore is available on the current platform
 */
export const isSecureStorageNative = async () => {
  try {
    if (Platform.OS === 'web') return false;
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
};

/**
 * Store a key-value pair securely
 * @param {string} key 
 * @param {any} value (string or serializable object)
 */
export const setItem = async (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (Platform.OS !== 'web') {
      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        await SecureStore.setItemAsync(key, stringValue, {
          keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
        });
        return true;
      }
    }

    // Web / Fallback Storage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`__tdj_secure_${key}`, stringValue);
    } else {
      memoryStorage.set(key, stringValue);
    }
    return true;
  } catch (error) {
    // Never print sensitive data in error logs
    console.error(`[SecureStorage] Error saving key "${key}"`);
    return false;
  }
};

/**
 * Retrieve a value by key from secure storage
 * @param {string} key 
 * @returns {any} parsed JSON or string value, or null if not found
 */
export const getItem = async (key) => {
  try {
    let rawValue = null;

    if (Platform.OS !== 'web') {
      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        rawValue = await SecureStore.getItemAsync(key);
      }
    }

    if (!rawValue) {
      // Check Web / Fallback Storage
      if (typeof window !== 'undefined' && window.localStorage) {
        rawValue = window.localStorage.getItem(`__tdj_secure_${key}`);
      } else {
        rawValue = memoryStorage.get(key) || null;
      }
    }

    if (!rawValue) return null;

    // Attempt to parse JSON; if not JSON, return raw string
    try {
      return JSON.parse(rawValue);
    } catch {
      return rawValue;
    }
  } catch (error) {
    console.error(`[SecureStorage] Error reading key "${key}"`);
    return null;
  }
};

/**
 * Delete a key from secure storage (used during Logout to clear session)
 * @param {string} key 
 */
export const deleteItem = async (key) => {
  try {
    if (Platform.OS !== 'web') {
      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        await SecureStore.deleteItemAsync(key);
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(`__tdj_secure_${key}`);
    }
    memoryStorage.delete(key);
    return true;
  } catch (error) {
    console.error(`[SecureStorage] Error deleting key "${key}"`);
    return false;
  }
};
