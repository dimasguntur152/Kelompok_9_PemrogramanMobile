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
// TASK 02 — CONNECT KEDAI TONG DJAJAKARTA TO REST API
// ---------------------------------------------------------------------------

/**
 * Mengambil seluruh data menu dari REST API JSON Server.
 *
 * Alur:
 *   HTTP GET /menus
 *     → periksa response.ok
 *     → response.json()
 *     → validasi struktur array
 *     → mapping tiap item ke MenuItem
 *     → return { data, error, count }
 *
 * @returns {Promise<{data: MenuItem[]|null, error: string|null, count: number}>}
 */
export const fetchMenus = async () => {
  try {
    const url = `${API_BASE_URL}/menus`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Periksa response.ok (status 200-299)
    if (!response.ok) {
      return {
        data: null,
        error: `Gagal mengambil data menu. Server merespons dengan status ${response.status}: ${response.statusText}`,
        count: 0,
      };
    }

    // Parse JSON dari response body
    const json = await response.json();

    // JSON Server pada endpoint /menus mengembalikan array langsung
    // Validasi bahwa respons adalah array
    const rawArray = Array.isArray(json) ? json : (json?.menus ?? []);

    if (!Array.isArray(rawArray) || rawArray.length === 0) {
      return {
        data: [],
        error: null,
        count: 0,
      };
    }

    // Mapping setiap item ke model MenuItem
    const menus = rawArray.map(mapToMenuItem);

    return {
      data: menus,
      error: null,
      count: menus.length,
    };
  } catch (err) {
    // Network error atau JSON parse error
    let errorMessage = 'Tidak dapat terhubung ke server menu Kedai.';

    if (err.name === 'TypeError' && err.message.includes('Network request failed')) {
      errorMessage =
        'Koneksi ke server menu gagal. Pastikan JSON Server sudah berjalan di port 4000.\n\n' +
        'Jalankan: npm run api\n\n' +
        'Jika menggunakan HP fisik, ubah BASE_URL di menuService.js dengan IP LAN komputer Anda.';
    } else if (err instanceof SyntaxError) {
      errorMessage = 'Format data dari server tidak valid. Pastikan db.json berisi JSON yang benar.';
    }

    return {
      data: null,
      error: errorMessage,
      count: 0,
    };
  }
};
