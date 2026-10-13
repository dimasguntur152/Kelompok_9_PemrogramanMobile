import { setItem, getItem, deleteItem } from './secureStoreService';
import { API_BASE_URL } from './menuService';

/**
 * Authentication & Session Service for Kedai Tong Djajakarta
 * Week 5: From API to Secure API (Token Authentication, Secure Requests, Session Protection)
 * 
 * Features:
 * - Real HTTP REST API integration for Register, Login, Profile, and Logout
 * - JWT Bearer Token management stored via expo-secure-store ('access_token')
 * - Protected session validation via GET /profile
 * - Server-side token revocation via POST /logout
 * - Zero plain-text password or password hash exposure
 */

export const ACCESS_TOKEN_KEY = 'access_token';
export const SECURE_SESSION_KEY = 'tdj_auth_session';

/**
 * Get stored JWT access token from Secure Storage
 * @returns {Promise<string|null>}
 */
export const getAccessToken = async () => {
  try {
    return await getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
};

/**
 * Register a new user via Backend REST API
 * POST /register (Public Endpoint)
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Returns sanitized user: { id, name, email, role } (NO password/hash)
      return {
        success: true,
        user: data.user,
      };
    }

    return {
      success: false,
      error: data.error || 'Gagal mendaftarkan akun. Silakan periksa kembali input Anda.',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Tidak dapat terhubung ke server Kedai Tong Djajakarta. Pastikan backend aktif (npm run api).',
    };
  }
};

/**
 * Authenticate user with credentials via Backend REST API
 * POST /login (Public Endpoint)
 * Returns JWT Access Token
 * @param {string} identifier - Email or Username
 * @param {string} password 
 * @returns {Promise<{success: boolean, session?: object, error?: string}>}
 */
export const authenticateUser = async (identifier, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        identifier: identifier.trim(),
        password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success && data.access_token) {
      const token = data.access_token;
      const user = data.user;

      // 1. Simpan access token ke SecureStore (Week 5: Slide 9 & 10)
      await setItem(ACCESS_TOKEN_KEY, token);

      // 2. Simpan session metadata ke SecureStore
      const session = {
        token,
        user,
        createdAt: Date.now(),
        expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
      };
      await setItem(SECURE_SESSION_KEY, session);

      return {
        success: true,
        session,
      };
    }

    return {
      success: false,
      error: data.error || 'Email atau password salah.',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Gagal terhubung ke server autentikasi (port 4000). Pastikan backend sudah dijalankan.',
    };
  }
};

/**
 * Fetch authenticated user profile using stored JWT Bearer Token
 * GET /profile (Protected Endpoint)
 * @returns {Promise<{success: boolean, user?: object, error?: string, unauthorized?: boolean}>}
 */
export const fetchUserProfile = async () => {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, unauthorized: true, error: 'Tidak ada access token.' };
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Token invalid, expired, or revoked
      await deleteItem(ACCESS_TOKEN_KEY);
      await deleteItem(SECURE_SESSION_KEY);
      return { success: false, unauthorized: true, error: 'Sesi telah kedaluwarsa atau dicabut.' };
    }

    const data = await response.json();
    if (response.ok && data.success && data.user) {
      return { success: true, user: data.user };
    }

    return { success: false, error: data.error || 'Gagal mengambil data profil.' };
  } catch (error) {
    return { success: false, error: 'Koneksi ke backend gagal.' };
  }
};

/**
 * Read and validate active session from Secure Storage & Backend
 * Week 5: Task 03 — Protect Session
 * @returns {Promise<object|null>}
 */
export const getActiveSession = async () => {
  try {
    const token = await getAccessToken();
    if (!token) {
      return null;
    }

    // Verify session integrity with backend
    const profileResult = await fetchUserProfile();
    if (profileResult.success && profileResult.user) {
      return {
        token,
        user: profileResult.user,
      };
    }

    if (profileResult.unauthorized) {
      // Backend rejected token -> Clear session
      await deleteItem(ACCESS_TOKEN_KEY);
      await deleteItem(SECURE_SESSION_KEY);
      return null;
    }

    // Network error fallback: check local cached session if available
    const cachedSession = await getItem(SECURE_SESSION_KEY);
    if (cachedSession && cachedSession.token && cachedSession.user) {
      return cachedSession;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Terminate session: notify backend for revocation and wipe Secure Storage
 * Week 5: Task 03 — Logout & Token Revocation
 * @returns {Promise<boolean>}
 */
export const clearActiveSession = async () => {
  try {
    const token = await getAccessToken();

    // 1. Send revocation request to server if token exists
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch {
        // Continue clearing client storage even if server is unreachable
      }
    }

    // 2. Wipe access token and session from Secure Storage (Week 5: Slide 12)
    await deleteItem(ACCESS_TOKEN_KEY);
    await deleteItem(SECURE_SESSION_KEY);
    return true;
  } catch {
    return false;
  }
};
