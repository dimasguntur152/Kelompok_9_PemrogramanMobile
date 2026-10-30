import { Platform } from 'react-native';
import { getItem } from './secureStoreService';
import { API_BASE_URL } from './menuService';

/**
 * Profile Photo Service for Kedai Tong Djajakarta
 * 
 * Bertanggung jawab untuk:
 * 1. Mengunggah foto profil ke endpoint POST /profile/photo (MySQL LONGBLOB)
 * 2. Mengambil foto profil binary dari endpoint GET /profile/photo (MySQL)
 * 3. Mengonversi binary stream menjadi Data URL yang dapat dirender secara konsisten di React Native Web & Mobile
 */

/**
 * Mengambil foto profil aktif pengguna dari MySQL (GET /profile/photo)
 * @returns {Promise<{ success: boolean, notFound?: boolean, unauthorized?: boolean, uri?: string, message?: string }>}
 */
export const fetchProfilePhoto = async () => {
  try {
    const token = await getItem('access_token');
    if (!token) {
      return { success: false, unauthorized: true, message: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const response = await fetch(`${API_BASE_URL}/profile/photo`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const blob = await response.blob();

      // Konversi binary blob ke Data URL (data:image/jpeg;base64,...)
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      return {
        success: true,
        uri: dataUrl,
        contentType,
      };
    }

    if (response.status === 404) {
      // User belum memiliki foto di database MySQL -> gunakan avatar default
      return {
        success: false,
        notFound: true,
        message: 'Foto profil belum tersedia',
      };
    }

    if (response.status === 401) {
      return {
        success: false,
        unauthorized: true,
        message: 'Sesi telah berakhir. Silakan login kembali.',
      };
    }

    return {
      success: false,
      message: 'Gagal mengambil foto profil dari server',
    };
  } catch (error) {
    return {
      success: false,
      isNetworkError: true,
      message: 'Periksa koneksi dan pastikan backend API sedang berjalan.',
    };
  }
};

/**
 * Mengunggah foto hasil kamera ke backend MySQL (POST /profile/photo)
 * @param {string | Blob | object} photoSource - URI lokal foto kamera, Blob, atau object { uri }
 * @returns {Promise<{ success: boolean, message: string, title?: string, unauthorized?: boolean, status?: number, isNetworkError?: boolean }>}
 */
export const uploadProfilePhoto = async (photoSource) => {
  try {
    const token = await getItem('access_token');
    if (!token) {
      return {
        success: false,
        unauthorized: true,
        title: 'Sesi Telah Berakhir',
        message: 'Sesi telah berakhir. Silakan login kembali.',
        status: 401,
      };
    }

    const formData = new FormData();
    const sourceUri = typeof photoSource === 'string' ? photoSource : (photoSource?.uri || photoSource);

    if (Platform.OS === 'web') {
      if (photoSource instanceof Blob) {
        formData.append('photo', photoSource, 'profile_photo.jpg');
      } else if (typeof sourceUri === 'string') {
        const res = await fetch(sourceUri);
        const blob = await res.blob();
        formData.append('photo', blob, 'profile_photo.jpg');
      }
    } else {
      // React Native Mobile
      formData.append('photo', {
        uri: typeof sourceUri === 'string' ? sourceUri : sourceUri?.uri,
        name: 'profile_photo.jpg',
        type: 'image/jpeg',
      });
    }

    const response = await fetch(`${API_BASE_URL}/profile/photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      // Non-JSON response
    }

    if (response.ok && data.success) {
      return {
        success: true,
        title: 'Foto Profil Berhasil Disimpan',
        message: data.message || 'Foto profil berhasil disimpan',
      };
    }

    // HTTP 401
    if (response.status === 401) {
      return {
        success: false,
        unauthorized: true,
        title: 'Sesi Telah Berakhir',
        message: 'Sesi telah berakhir. Silakan login kembali.',
        status: 401,
      };
    }

    // HTTP 404
    if (response.status === 404) {
      return {
        success: false,
        title: 'Endpoint Tidak Ditemukan',
        message: 'Endpoint penyimpanan foto tidak ditemukan.',
        status: 404,
      };
    }

    // HTTP 5xx Server Error
    if (response.status >= 500) {
      return {
        success: false,
        isServerError: true,
        title: 'Gagal menyimpan foto',
        message: 'Server sedang mengalami masalah. Silakan coba lagi.',
        status: response.status,
      };
    }

    // HTTP 4xx Client Error
    return {
      success: false,
      title: 'Gagal Menyimpan Foto',
      message: data.message || data.error || 'Permintaan tidak dapat diproses. Silakan periksa kembali foto yang dipilih.',
      status: response.status,
    };
  } catch (error) {
    // Network Error saat upload / Backend API mati
    return {
      success: false,
      isNetworkError: true,
      title: 'Foto Berhasil Diambil',
      message: 'Foto belum dapat disimpan ke server. Pastikan backend API sedang berjalan lalu coba lagi.',
    };
  }
};
