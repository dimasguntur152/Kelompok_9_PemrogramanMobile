// ============================================================
// menuService.js
// TASK 02 — CONNECT KEDAI TONG DJAJAKARTA TO REST API
//
// Service ini bertanggung jawab untuk:
// 1. Mengirim HTTP GET ke endpoint /menus JSON Server
// 2. Memeriksa response.ok
// 3. Menjalankan response.json()
// 4. Memvalidasi struktur respons
// 5. Mapping data ke model MenuItem
// 6. Mengembalikan hasil beserta state loading/error
// ============================================================

// ---------------------------------------------------------------------------
// KONFIGURASI BASE URL
// ---------------------------------------------------------------------------
// Untuk emulator Android: gunakan 10.0.2.2 (loopback ke host)
// Untuk Expo Go di HP fisik: ganti dengan IP LAN komputer Anda, contoh:
//   const BASE_URL = 'http://192.168.1.xxx:4000';
// Untuk emulator iOS / web: gunakan localhost
//
// Catatan: IP LAN tidak dapat ditentukan secara otomatis.
// Jalankan `ipconfig` di terminal untuk menemukan IP LAN komputer Anda,
// lalu ubah nilai BASE_URL di bawah ini.
// ---------------------------------------------------------------------------

import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    // Emulator Android memetakan 10.0.2.2 ke host localhost
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:4000';
    }
    // iOS simulator dan web dapat menggunakan localhost
    return 'http://localhost:4000';
  }
  // Production: ganti dengan base URL server yang sudah di-deploy
  return 'http://localhost:4000';
};

export const API_BASE_URL = getBaseUrl();

// ---------------------------------------------------------------------------
// MODEL MenuItem
// TASK 01 — MODEL THE KEDAI TONG DJAJAKARTA DATA
// ---------------------------------------------------------------------------
/**
 * @typedef {Object} MenuItem
 * @property {number} id         - ID unik menu (number dari JSON Server)
 * @property {string} name       - Nama menu
 * @property {string} description - Deskripsi menu
 * @property {number} price      - Harga dalam Rupiah (integer)
 * @property {string} image      - URL gambar menu
 * @property {string} category   - Kategori: 'Kopi' | 'Non-Kopi' | 'Makanan' | 'Lain-lain'
 * @property {string|null} label - Badge label: 'FAVORIT!', 'BEST SELLER!', 'DARK SERIES', dll
 * @property {string} status     - Status ketersediaan: 'active' | 'habis'
 * @property {boolean} available - Derived field: true jika status === 'active'
 */

/**
 * Mapping raw JSON dari API ke model MenuItem aplikasi.
 * Memastikan field yang dibutuhkan selalu ada dengan nilai default yang aman.
 *
 * @param {Object} raw - Raw object dari response API
 * @returns {MenuItem} - Item yang sudah dimapping ke model aplikasi
 */
const mapToMenuItem = (raw) => {
  return {
    id: String(raw.id),          // Konversi ke string agar kompatibel dengan cart state lama
    name: raw.name ?? '',
    description: raw.description ?? '',
    price: typeof raw.price === 'number' ? raw.price : 0,
    image: raw.image ?? null,
    category: raw.category ?? 'Lain-lain',
    label: raw.label ?? null,
    status: raw.status ?? 'active',
    available: raw.status !== 'habis',  // Derived: true jika bukan 'habis'
  };
};

// ---------------------------------------------------------------------------
// FETCH MENUS — HTTP GET /menus
// PERTEMUAN 6: TASK 1 (API ERROR), TASK 2 (LOADING/RETRY), TASK 3 (OFFLINE)
// ---------------------------------------------------------------------------

let simulatedOffline = false;

/**
 * Helper untuk menyimulasikan mode offline saat testing/pengujian.
 * @param {boolean} value 
 */
export const setSimulatedOffline = (value) => {
  simulatedOffline = Boolean(value);
};

export const getSimulatedOffline = () => simulatedOffline;

/**
 * Mengambil seluruh data menu dari REST API JSON Server.
 *
 * Alur Penanganan Respon (Pertemuan 6):
 *   1. Loading State & Simulasi Delay Demo (Task 02)
 *   2. Deteksi Jaringan & Status Offline Sebenarnya (Task 03)
 *   3. Evaluasi Status Response Sebelum Data Digunakan (Task 01):
 *      - HTTP 2xx: Request berhasil → parse JSON, mapping MenuItem, kembalikan data
 *      - HTTP 4xx: Client Error (400, 401, 403, 404) → "Permintaan tidak dapat diproses."
 *      - HTTP 5xx: Server Error (500, 503) → "Terjadi masalah pada server. Silakan coba lagi."
 *   4. Kegagalan Koneksi (Catch):
 *      - Benar-benar Offline: "Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi."
 *      - Server/API localhost:4000 Mati: "Gagal terhubung ke server. Silakan coba lagi."
 *
 * @param {Object} [options]
 * @param {string} [options.url] - URL override (misal untuk simulasi query param ?simulate_error=500)
 * @param {boolean} [options.simulateOffline] - Opsi simulasi mode offline
 * @param {number} [options.timeoutMs] - Batas waktu request (default: 8000ms)
 * @param {number} [options.demoDelayMs] - Delay simulasi loading untuk demo (default: 450ms)
 * @returns {Promise<{
 *   data: MenuItem[]|null,
 *   error: string|null,
 *   count: number,
 *   status: number|null,
 *   errorType: 'OFFLINE'|'SERVER_UNREACHABLE'|'CLIENT_ERROR'|'SERVER_ERROR'|'PARSE_ERROR'|'UNKNOWN'|null,
 *   isOffline: boolean
 * }>}
 */
export const fetchMenus = async (options = {}) => {
  const {
    url = `${API_BASE_URL}/menus`,
    simulateOffline: optionSimulateOffline,
    timeoutMs = 8000,
    demoDelayMs = 450,
  } = options;

  // -------------------------------------------------------------------------
  // 1. DEMO LOADING SIMULATION DELAY (TASK 02)
  // Menambahkan jeda singkat (~450ms) khusus agar ActivityIndicator dan teks
  // "Memuat data..." dapat diamati dengan jelas saat demo di localhost (yang biasanya <5ms).
  // Nilai ini dapat dinonaktifkan dengan { demoDelayMs: 0 } saat unit testing.
  // -------------------------------------------------------------------------
  if (demoDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, demoDelayMs));
  }

  // -------------------------------------------------------------------------
  // 2. DETEKSI STATUS OFFLINE SEBENARNYA (TASK 03)
  // Memeriksa apakah perangkat benar-benar offline (tanpa koneksi jaringan/internet)
  // -------------------------------------------------------------------------
  const isOfflineDetected =
    optionSimulateOffline === true ||
    simulatedOffline === true ||
    (typeof navigator !== 'undefined' && navigator.onLine === false);

  if (isOfflineDetected) {
    return {
      data: null,
      error: 'Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.',
      count: 0,
      status: null,
      errorType: 'OFFLINE',
      isOffline: true,
    };
  }

  // -------------------------------------------------------------------------
  // 3. TIMEOUT PROTECTION DENGAN ABORT CONTROLLER
  // Mencegah loading terus-menerus tanpa batas ketika jaringan macet
  // -------------------------------------------------------------------------
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  let timeoutId = null;

  if (controller && timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      try {
        controller.abort();
      } catch {}
    }, timeoutMs);
  }

  try {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...(controller ? { signal: controller.signal } : {}),
    };

    const response = await fetch(url, fetchOptions);

    if (timeoutId) clearTimeout(timeoutId);

    // -----------------------------------------------------------------------
    // 4. PEMERIKSAAN STATUS RESPONSE SEBELUM DATA DIGUNAKAN (TASK 01)
    // -----------------------------------------------------------------------
    const status = response.status;

    // A. HTTP 2xx: Request Berhasil
    if (response.ok) {
      const json = await response.json();
      const rawArray = Array.isArray(json) ? json : (json?.menus ?? []);

      if (!Array.isArray(rawArray) || rawArray.length === 0) {
        return {
          data: [],
          error: null,
          count: 0,
          status,
          errorType: null,
          isOffline: false,
        };
      }

      const menus = rawArray.map(mapToMenuItem);
      return {
        data: menus,
        error: null,
        count: menus.length,
        status,
        errorType: null,
        isOffline: false,
      };
    }

    // B. HTTP 4xx: Client Error
    if (status >= 400 && status < 500) {
      let clientErrorMessage;
      if (status === 401) {
        clientErrorMessage = 'Sesi Anda tidak valid. Silakan login kembali.';
      } else if (status === 404) {
        clientErrorMessage = 'Data menu tidak ditemukan.';
      } else if (status === 400) {
        clientErrorMessage = 'Permintaan tidak dapat diproses. Silakan coba lagi.';
      } else if (status === 403) {
        clientErrorMessage = 'Akses ke data menu ditolak. Silakan coba lagi.';
      } else {
        clientErrorMessage = 'Permintaan tidak dapat diproses. Silakan coba lagi.';
      }

      return {
        data: null,
        error: clientErrorMessage,
        count: 0,
        status,
        errorType: 'CLIENT_ERROR',
        isOffline: false,
      };
    }

    // C. HTTP 5xx: Server Error
    if (status >= 500 && status < 600) {
      return {
        data: null,
        error: 'Terjadi masalah pada server. Silakan coba lagi.',
        count: 0,
        status,
        errorType: 'SERVER_ERROR',
        isOffline: false,
      };
    }

    // D. Status Tak Terduga Lainnya
    return {
      data: null,
      error: 'Terjadi kesalahan saat memuat menu. Silakan coba lagi.',
      count: 0,
      status,
      errorType: 'UNKNOWN',
      isOffline: false,
    };
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);

    // -----------------------------------------------------------------------
    // 5. PENANGANAN OFFLINE VS SERVER MATI (TASK 01 & TASK 03)
    // -----------------------------------------------------------------------
    // A. Periksa apakah perangkat offline saat exception terjadi
    const isActuallyOffline =
      (typeof navigator !== 'undefined' && navigator.onLine === false) ||
      simulatedOffline === true ||
      optionSimulateOffline === true;

    if (isActuallyOffline) {
      return {
        data: null,
        error: 'Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.',
        count: 0,
        status: null,
        errorType: 'OFFLINE',
        isOffline: true,
      };
    }

    // B. AbortError / Timeout
    if (err.name === 'AbortError') {
      return {
        data: null,
        error: 'Gagal terhubung ke server. Silakan coba lagi.',
        count: 0,
        status: null,
        errorType: 'SERVER_UNREACHABLE',
        isOffline: false,
      };
    }

    // C. Backend / API localhost:4000 mati (Koneksi jaringan ada, tapi server tidak berjalan)
    const isConnectionError =
      err.name === 'TypeError' ||
      /network|failed to fetch|econnrefused|aborted|connect/i.test(err.message || '');

    if (isConnectionError) {
      return {
        data: null,
        error: 'Gagal terhubung ke server. Silakan coba lagi.',
        count: 0,
        status: null,
        errorType: 'SERVER_UNREACHABLE',
        isOffline: false,
      };
    }

    // D. JSON Syntax Error
    if (err instanceof SyntaxError) {
      return {
        data: null,
        error: 'Terjadi kesalahan saat memproses data menu. Silakan coba lagi.',
        count: 0,
        status: null,
        errorType: 'PARSE_ERROR',
        isOffline: false,
      };
    }

    // E. General Fallback
    return {
      data: null,
      error: 'Terjadi kesalahan saat memuat menu. Silakan coba lagi.',
      count: 0,
      status: null,
      errorType: 'UNKNOWN',
      isOffline: false,
    };
  }
};
