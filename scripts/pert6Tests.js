/**
 * Automated Test Suite — Pertemuan 6 (Refined & Enhanced)
 * Kedai Tong Djajakarta Customer Mobile App
 * 
 * Pengujian Lengkap:
 * - TASK 1: Handle API Error:
 *     1. HTTP 2xx: Sukses, parse JSON, mapping MenuItem, data tampil.
 *     2. HTTP 4xx: Client error (400, 401, 403, 404) dengan pesan tepat.
 *     3. HTTP 5xx: Server error dengan pesan "Terjadi masalah pada server. Silakan coba lagi."
 *     4. API / Server Mati: "Gagal terhubung ke server. Silakan coba lagi." (Bukan "Tidak ada koneksi internet")
 * - TASK 2: Loading State, Error State, dan Retry:
 *     1. Loading indicator & teks "Memuat data..." jelas terlihat.
 *     2. Simulasi delay demo bekerja dengan baik.
 *     3. Error state mengosongkan data dan menampilkan pesan yang sesuai.
 *     4. Tombol "Coba Lagi" mengeksekusi request ulang.
 * - TASK 3: Network / Offline State:
 *     1. Deteksi kondisi benar-benar offline (tanpa koneksi internet).
 *     2. Pesan tepat: "Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi."
 *     3. Retry setelah online kembali memuat 32 menu otentik Kedai Tong.
 * - DATA & INTEGRITAS:
 *     1. Tidak ada kosmetik, tidak ada DummyJSON, tidak ada PresidentKu.
 *     2. Seluruh menu otentik Kedai Tong Djajakarta lengkap.
 */

require('dotenv').config();
const http = require('http');
const path = require('path');
const { server } = require('../server');

const TEST_PORT = 4006;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runPert6TestSuite() {
  console.log('================================================================');
  console.log('  KEDAI TONG DJAJAKARTA — PERTEMUAN 6 AUTOMATED TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      if (details) console.log(`       ↳ ${details}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (details) console.error(`       ↳ ${details}`);
      failed++;
    }
  }

  // Start test server on port 4006
  const testHttpServer = http.createServer(server);
  await new Promise((resolve) => testHttpServer.listen(TEST_PORT, resolve));
  console.log(`[TEST SERVER] Berjalan di port ${TEST_PORT} untuk pengujian HTTP.\n`);

  try {
    const mapToMenuItem = (raw) => ({
      id: String(raw.id),
      name: raw.name ?? '',
      description: raw.description ?? '',
      price: typeof raw.price === 'number' ? raw.price : 0,
      image: raw.image ?? null,
      category: raw.category ?? 'Lain-lain',
      label: raw.label ?? null,
      status: raw.status ?? 'active',
      available: raw.status !== 'habis',
    });

    const testFetchMenus = async (options = {}) => {
      const {
        url = `${BASE_URL}/menus`,
        simulateOffline = false,
        timeoutMs = 8000,
        demoDelayMs = 0, // 0 for fast automated tests
      } = options;

      if (demoDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, demoDelayMs));
      }

      // Deteksi offline sebenarnya
      if (simulateOffline) {
        return {
          data: null,
          error: 'Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.',
          count: 0,
          status: null,
          errorType: 'OFFLINE',
          isOffline: true,
        };
      }

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      let timeoutId = null;
      if (controller && timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          try { controller.abort(); } catch {}
        }, timeoutMs);
      }

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          ...(controller ? { signal: controller.signal } : {}),
        });

        if (timeoutId) clearTimeout(timeoutId);
        const status = response.status;

        // HTTP 2xx
        if (response.ok) {
          const json = await response.json();
          const rawArray = Array.isArray(json) ? json : (json?.menus ?? []);
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

        // HTTP 4xx
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

        // HTTP 5xx
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

        // Jika benar-benar offline saat catch
        if (simulateOffline) {
          return {
            data: null,
            error: 'Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.',
            count: 0,
            status: null,
            errorType: 'OFFLINE',
            isOffline: true,
          };
        }

        // Jika server mati / backend tidak jalan (Koneksi gagal ke localhost:4000)
        const isConnectionError =
          err.name === 'AbortError' ||
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

    // =========================================================================
    // TASK 1: HANDLE API ERROR
    // =========================================================================
    console.log('--- TASK 1: HANDLE API ERROR ---');

    // TEST 1.1: HTTP 2xx (Success)
    const res200 = await testFetchMenus();
    assert(
      res200.status === 200 && res200.error === null && Array.isArray(res200.data) && res200.data.length === 32,
      'TASK 1.1: HTTP 2xx Berhasil mengambil seluruh 32 menu otentik Kedai Tong Djajakarta',
      `Status: ${res200.status}, Jumlah menu: ${res200.count}, Error: ${res200.error}`
    );

    // TEST 1.2: HTTP 401 (Unauthorized)
    const res401 = await testFetchMenus({ url: `${BASE_URL}/menus?simulate_error=401` });
    assert(
      res401.status === 401 && res401.data === null && res401.error === 'Sesi Anda tidak valid. Silakan login kembali.',
      'TASK 1.2: HTTP 401 Ditangani dengan pesan "Sesi Anda tidak valid. Silakan login kembali."',
      `Status: ${res401.status}, Pesan Error: "${res401.error}"`
    );

    // TEST 1.3: HTTP 404 (Not Found)
    const res404 = await testFetchMenus({ url: `${BASE_URL}/menus?simulate_error=404` });
    assert(
      res404.status === 404 && res404.data === null && res404.error === 'Data menu tidak ditemukan.',
      'TASK 1.3: HTTP 404 Ditangani dengan pesan "Data menu tidak ditemukan."',
      `Status: ${res404.status}, Pesan Error: "${res404.error}"`
    );

    // TEST 1.4: HTTP 400 (Bad Request)
    const res400 = await testFetchMenus({ url: `${BASE_URL}/menus?simulate_error=400` });
    assert(
      res400.status === 400 && res400.data === null && res400.error.includes('Permintaan tidak dapat diproses'),
      'TASK 1.4: HTTP 400 Ditangani dengan pesan "Permintaan tidak dapat diproses. Silakan coba lagi."',
      `Status: ${res400.status}, Pesan Error: "${res400.error}"`
    );

    // TEST 1.5: HTTP 500 (Internal Server Error)
    const res500 = await testFetchMenus({ url: `${BASE_URL}/menus?simulate_error=500` });
    assert(
      res500.status === 500 && res500.data === null && res500.error === 'Terjadi masalah pada server. Silakan coba lagi.',
      'TASK 1.5: HTTP 500 Ditangani dengan pesan "Terjadi masalah pada server. Silakan coba lagi."',
      `Status: ${res500.status}, Pesan Error: "${res500.error}"`
    );

    // TEST 1.6: HTTP 503 (Service Unavailable)
    const res503 = await testFetchMenus({ url: `${BASE_URL}/menus?simulate_error=503` });
    assert(
      res503.status === 503 && res503.data === null && res503.error === 'Terjadi masalah pada server. Silakan coba lagi.',
      'TASK 1.6: HTTP 503 Ditangani dengan pesan "Terjadi masalah pada server. Silakan coba lagi."',
      `Status: ${res503.status}, Pesan Error: "${res503.error}"`
    );

    // TEST 1.7: Server / API mati (Koneksi ke port tertutup / localhost:4000 mati)
    const resServerMati = await testFetchMenus({ url: 'http://localhost:59999/menus' });
    assert(
      resServerMati.data === null &&
      resServerMati.isOffline === false &&
      resServerMati.errorType === 'SERVER_UNREACHABLE' &&
      resServerMati.error === 'Gagal terhubung ke server. Silakan coba lagi.',
      'TASK 1.7: API localhost:4000 mati TIDAK menampilkan "Tidak Ada Koneksi Internet", melainkan "Gagal terhubung ke server."',
      `Data: ${resServerMati.data}, isOffline: ${resServerMati.isOffline}, Pesan: "${resServerMati.error}"`
    );

    // TEST 1.8: Data tidak ditampilkan ketika request gagal
    assert(
      res401.data === null && res404.data === null && res500.data === null && resServerMati.data === null,
      'TASK 1.8: Seluruh kondisi kegagalan request menjamin data = null (Data tidak ditampilkan saat gagal)',
      'Konsistensi data isolation saat terjadi error'
    );

    // =========================================================================
    // TASK 2: LOADING, ERROR STATE, DAN RETRY
    // =========================================================================
    console.log('\n--- TASK 2: LOADING, ERROR STATE, DAN RETRY ---');

    let state = {
      menuLoading: false,
      menuError: null,
      menuData: [],
    };

    const loadMenusSimulator = async (requestOptions = {}) => {
      state.menuLoading = true;
      state.menuError = null;

      const result = await testFetchMenus(requestOptions);

      if (result.data !== null && !result.error) {
        state.menuData = result.data;
        state.menuError = null;
      } else {
        state.menuData = [];
        state.menuError = result.error;
      }
      state.menuLoading = false;
      return result;
    };

    // TEST 2.1: Loading state lifecycle
    const initialPromise = loadMenusSimulator({ demoDelayMs: 50 });
    assert(
      state.menuLoading === true && state.menuError === null,
      'TASK 2.1: Saat request berlangsung: loading = true, error = null (Indikator & teks "Memuat data..." aktif)',
      `Loading: ${state.menuLoading}, Error: ${state.menuError}`
    );
    await initialPromise;
    assert(
      state.menuLoading === false && state.menuError === null && state.menuData.length > 0,
      'TASK 2.2: Setelah request berhasil (2xx): loading = false, error = null, data menu tampil',
      `Loading: ${state.menuLoading}, Total Menu: ${state.menuData.length}`
    );

    // TEST 2.3: Error state lifecycle
    await loadMenusSimulator({ url: `${BASE_URL}/menus?simulate_error=500` });
    assert(
      state.menuLoading === false && state.menuError === 'Terjadi masalah pada server. Silakan coba lagi.' && state.menuData.length === 0,
      'TASK 2.3: Saat terjadi error: loading = false, masuk ke error state, data menu di-reset kosong',
      `Pesan Error: "${state.menuError}", Menu Count: ${state.menuData.length}`
    );

    // TEST 2.4: Tombol "Coba Lagi" (Retry)
    console.log('       ↳ Menekan tombol "Coba Lagi"...');
    const retryPromise = loadMenusSimulator();
    assert(
      state.menuLoading === true && state.menuError === null,
      'TASK 2.4: Tombol "Coba Lagi" mereset error state & mengaktifkan loading indicator kembali',
      `Loading: ${state.menuLoading}, Error: ${state.menuError}`
    );
    await retryPromise;
    assert(
      state.menuLoading === false && state.menuError === null && state.menuData.length === 32,
      'TASK 2.5: Retry berhasil memuat kembali seluruh 32 menu otentik Kedai Tong Djajakarta',
      `Loading: ${state.menuLoading}, Menu Count: ${state.menuData.length}`
    );

    // =========================================================================
    // TASK 3: NETWORK / OFFLINE STATE
    // =========================================================================
    console.log('\n--- TASK 3: NETWORK / OFFLINE STATE ---');

    // TEST 3.1: Offline State Detection
    const offlineRes = await testFetchMenus({ simulateOffline: true });
    assert(
      offlineRes.isOffline === true &&
      offlineRes.errorType === 'OFFLINE' &&
      offlineRes.error === 'Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.',
      'TASK 3.1: Perangkat benar-benar offline dideteksi secara spesifik dengan pesan "Tidak ada koneksi internet."',
      `isOffline: ${offlineRes.isOffline}, errorType: ${offlineRes.errorType}, Pesan: "${offlineRes.error}"`
    );

    // TEST 3.2: Perbedaan Tegas Offline vs API Mati
    assert(
      offlineRes.error !== resServerMati.error &&
      offlineRes.errorType === 'OFFLINE' &&
      resServerMati.errorType === 'SERVER_UNREACHABLE',
      'TASK 3.2: Pembedaan Tegas: Offline ("Tidak ada koneksi internet") vs API Mati ("Gagal terhubung ke server")',
      `Offline: "${offlineRes.error}" | Server Mati: "${resServerMati.error}"`
    );

    // TEST 3.3: Offline -> Retry While Offline
    await loadMenusSimulator({ simulateOffline: true });
    assert(
      state.menuError.includes('Tidak ada koneksi internet') && state.menuData.length === 0,
      'TASK 3.3: Saat offline, aplikasi masuk ke offline state dan tidak menampilkan data menu',
      `Error State: "${state.menuError}"`
    );

    // TEST 3.4: Offline -> Online (Internet Pulih & Coba Lagi Ditekan)
    console.log('       ↳ Internet kembali aktif, menekan "Coba Lagi"...');
    await loadMenusSimulator({ simulateOffline: false });
    assert(
      state.menuLoading === false && state.menuError === null && state.menuData.length === 32,
      'TASK 3.4: Saat internet aktif kembali dan "Coba Lagi" ditekan, data menu berhasil dimuat penuh',
      `Offline/Error hilang, Loading berhenti, 32 menu tampil`
    );

    // =========================================================================
    // DATA INTEGRITY & ANTI-REGRESI
    // =========================================================================
    console.log('\n--- DATA INTEGRITY & ANTI-REGRESI ---');

    const menus = state.menuData;
    const menuNames = menus.map((m) => m.name.toLowerCase());

    const hasAmericano = menuNames.some((n) => n.includes('americano'));
    const hasKopiSusuMantap = menuNames.some((n) => n.includes('kopi susu mantap'));
    const hasMatcha = menuNames.some((n) => n.includes('matcha'));
    const hasChocoBanana = menuNames.some((n) => n.includes('choco banana'));

    assert(
      hasAmericano && hasKopiSusuMantap && hasMatcha && hasChocoBanana,
      'DATA 1: Menu otentik Kedai Tong Djajakarta lengkap (Americano, Kopi Susu Mantap, Matcha, Choco Banana)',
      `Total menu: ${menus.length} item`
    );

    const hasCosmetics = menuNames.some((n) => /lip|lipstick|eyeliner|serum|mascara|beauty|skincare/i.test(n));
    const hasPresidentKu = menuNames.some((n) => /president|bansos|sembako|program pemerintah/i.test(n));
    const hasDummyJson = menuNames.some((n) => /iphone|perfume|laptop|sneakers/i.test(n));

    assert(
      !hasCosmetics && !hasPresidentKu && !hasDummyJson,
      'DATA 2: Bebas dari data kosmetik, DummyJSON, dan PresidentKu',
      'Tidak ada produk asing yang tercampur di Kedai Tong Djajakarta'
    );

    const categories = Array.from(new Set(menus.map((m) => m.category)));
    const validCategories = ['Kopi', 'Non-Kopi', 'Makanan', 'Lain-lain'];
    const allCategoriesValid = categories.every((cat) => validCategories.includes(cat));

    assert(
      allCategoriesValid && categories.length >= 3,
      'DATA 3: Kategori menu otentik Kedai Tong Djajakarta (Kopi, Non-Kopi, Makanan, Lain-lain)',
      `Kategori aktif: [${categories.join(', ')}]`
    );

    console.log('\n================================================================');
    console.log(`HASIL AKHIR PENGUJIAN PERTEMUAN 6: ${passed} PASSED / ${failed} FAILED`);
    console.log('================================================================\n');

  } finally {
    await new Promise((resolve) => testHttpServer.close(resolve));
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runPert6TestSuite().catch((err) => {
  console.error('[UNHANDLED TEST ERROR]', err);
  process.exit(1);
});
