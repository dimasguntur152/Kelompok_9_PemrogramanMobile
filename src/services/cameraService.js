import * as ImagePicker from 'expo-image-picker';

/**
 * Camera Service for Kedai Tong Djajakarta
 * 
 * Modul untuk mengakses kamera perangkat dengan alur permission yang benar:
 * 1. Cek permission kamera sebelum membuka kamera.
 * 2. Minta permission kamera hanya jika belum diberikan dan saat user meminta ("Ambil Foto").
 * 3. Jika izin diberikan: buka kamera sistem untuk mengambil foto profil.
 * 4. Jika izin ditolak: kembalikan pesan jelas tanpa menyebabkan aplikasi crash.
 * 5. Jika user membatalkan: kembalikan status pembatalan tanpa error.
 * 6. Tangani error tak terduga secara aman.
 */

export const CAMERA_ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Kamera tidak diizinkan. Silakan izinkan akses kamera untuk mengambil foto.',
  CAMERA_FAILED: 'Gagal membuka kamera. Pastikan perangkat Anda memiliki kamera yang aktif dan coba lagi.',
  UNEXPECTED: 'Terjadi kesalahan tidak terduga saat mengakses kamera. Silakan coba lagi.',
};

/**
 * Memeriksa status izin kamera saat ini tanpa langsung memunculkan pop-up izin.
 * @returns {Promise<{ granted: boolean, status: string, canAskAgain: boolean }>}
 */
export const checkCameraPermission = async () => {
  try {
    const permission = await ImagePicker.getCameraPermissionsAsync();
    return {
      granted: permission.granted,
      status: permission.status,
      canAskAgain: permission.canAskAgain,
    };
  } catch (error) {
    return {
      granted: false,
      status: 'undetermined',
      canAskAgain: true,
      error: error.message,
    };
  }
};

/**
 * Meminta izin kamera kepada pengguna.
 * @returns {Promise<{ granted: boolean, status: string, canAskAgain: boolean }>}
 */
export const requestCameraPermission = async () => {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    return {
      granted: permission.granted,
      status: permission.status,
      canAskAgain: permission.canAskAgain,
    };
  } catch (error) {
    return {
      granted: false,
      status: 'denied',
      canAskAgain: false,
      error: error.message,
    };
  }
};

/**
 * Alur lengkap pengambilan foto profil menggunakan kamera perangkat:
 * 1. Periksa izin kamera
 * 2. Minta izin jika belum diberikan
 * 3. Buka kamera jika izin aktif
 * 4. Ambil hasil foto dan kembalikan URI gambar
 * 
 * @param {object} customOptions - Opsi tambahan untuk ImagePicker
 * @returns {Promise<{ success: boolean, canceled?: boolean, uri?: string, errorType?: string, message?: string }>}
 */
export const captureProfilePhoto = async (customOptions = {}) => {
  try {
    // 1. Cek status izin kamera saat ini
    let permission = await checkCameraPermission();

    // 2. Jika izin belum diberikan, ajukan permintaan izin kepada pengguna
    if (!permission.granted) {
      permission = await requestCameraPermission();
    }

    // 3. Jika izin tetap ditolak pengguna, berikan feedback jelas tanpa crash
    if (!permission.granted) {
      return {
        success: false,
        canceled: false,
        errorType: 'PERMISSION_DENIED',
        message: CAMERA_ERROR_MESSAGES.PERMISSION_DENIED,
        canAskAgain: permission.canAskAgain,
      };
    }

    // 4. Izin telah diberikan -> Buka kamera perangkat
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // Format persegi proporsional untuk foto profil
      quality: 0.8,
      ...customOptions,
    });

    // 5. User membatalkan proses kamera
    if (result.canceled) {
      return {
        success: false,
        canceled: true,
        message: null,
      };
    }

    // 6. User sukses mengambil foto
    if (result.assets && result.assets.length > 0) {
      const capturedAsset = result.assets[0];
      return {
        success: true,
        canceled: false,
        uri: capturedAsset.uri,
        width: capturedAsset.width,
        height: capturedAsset.height,
      };
    }

    // Kasus fallback jika tidak ada aset yang dihasilkan
    return {
      success: false,
      canceled: true,
      message: null,
    };
  } catch (error) {
    // Tangani error jika perangkat tidak memiliki kamera atau terjadi kesalahan platform
    const isPermissionError =
      error?.message?.toLowerCase().includes('permission') ||
      error?.message?.toLowerCase().includes('not allowed');

    return {
      success: false,
      canceled: false,
      errorType: isPermissionError ? 'PERMISSION_DENIED' : 'CAMERA_FAILED',
      message: isPermissionError
        ? CAMERA_ERROR_MESSAGES.PERMISSION_DENIED
        : CAMERA_ERROR_MESSAGES.CAMERA_FAILED,
      rawError: error?.message,
    };
  }
};
