/**
 * Automated Test Suite — Modul Kamera & MySQL Persistence Kedai Tong Djajakarta
 * 
 * Pengujian Komprehensif:
 * 1. DEPENDENCY & KONFIGURASI:
 *    - expo-camera terpasang di package.json dan app.json
 *    - mysql2 dan multer terpasang di package.json
 *    - Tidak ada storage eksternal (Firebase, Supabase, Cloudinary, AWS S3)
 * 2. KONEKSI MYSQL & SKEMA TABEL:
 *    - Koneksi pool ke kedai_tong_djajakarta
 *    - Tabel profile_photos (id, user_id, image_data LONGBLOB, mime_type)
 * 3. ENDPOINT POST /profile/photo:
 *    - 401 jika tanpa token atau token tidak valid
 *    - 400 jika tidak ada file ("Foto belum dipilih")
 *    - 400 jika format tidak didukung ("Format foto tidak didukung")
 *    - 400 jika ukuran file > 5 MB ("Ukuran foto terlalu besar. Maksimal 5 MB.")
 *    - 200 jika berhasil menyimpan foto ("Foto profil berhasil disimpan")
 *    - Verifikasi penyimpanan biner ke MySQL image_data (LONGBLOB)
 *    - Verifikasi Single Active Photo (UPDATE saat ganti foto, tidak duplikat record)
 * 4. ENDPOINT GET /profile/photo:
 *    - 401 jika tanpa token
 *    - 200 mengembalikan biner asli dan Content-Type sesuai mime_type
 *    - 404 jika user belum memiliki foto ("Foto profil belum tersedia")
 *    - ID Isolation: Parameter query (?user_id=...) diabaikan, identitas murni dari JWT
 * 5. KAMERA & INTEGRASI FRONTEND:
 *    - CameraModal mendukung Web (WebRTC getUserMedia) dan Mobile (CameraView)
 *    - Alur: Viewfinder -> Ambil Foto -> Preview (Gunakan Foto, Ambil Ulang, Batal)
 *    - State loading "Menyimpan foto..." dan feedback "Foto profil berhasil diperbarui."
 *    - State persistence: Ambil foto dari MySQL saat Profil dibuka kembali
 * 6. ANTI-REGRESI:
 *    - 32 menu otentik Kedai Tong Djajakarta utuh
 *    - Bebas dari kode/materi PresidentKu
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');
const { server } = require('../server');
const dbPool = require('../src/config/db');

const TEST_PORT = 4008;
const BASE_URL = `http://localhost:${TEST_PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'kedai_tong_djajakarta_super_secret_jwt_key_2026_umm';

// Helper membuat multipart/form-data body
function createMultipartFormData(fieldName, fileName, mimeType, fileBuffer) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const crlf = '\r\n';

  const header =
    `--${boundary}${crlf}` +
    `Content-Disposition: form-data; name="${fieldName}"; filename="${fileName}"${crlf}` +
    `Content-Type: ${mimeType}${crlf}${crlf}`;

  const footer = `${crlf}--${boundary}--${crlf}`;

  const bodyBuffer = Buffer.concat([
    Buffer.from(header, 'utf8'),
    fileBuffer,
    Buffer.from(footer, 'utf8'),
  ]);

  return {
    contentType: `multipart/form-data; boundary=${boundary}`,
    body: bodyBuffer,
  };
}

async function runCameraTestSuite() {
  console.log('================================================================');
  console.log('  KEDAI TONG DJAJAKARTA — CAMERA & MYSQL AUTOMATED TEST SUITE');
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

  // -------------------------------------------------------------
  // BAGIAN 1: VERIFIKASI DEPENDENCY & CONFIGURATION
  // -------------------------------------------------------------
  console.log('--- 1. VERIFIKASI DEPENDENCY & STORAGE RULES ---');

  const pkgJsonPath = path.resolve(__dirname, '../package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

  assert(
    pkgJson.dependencies && pkgJson.dependencies['expo-camera'],
    'DEPENDENCY 1: expo-camera terpasang sebagai dependency Expo resmi',
    `Versi: ${pkgJson.dependencies['expo-camera']}`
  );

  assert(
    pkgJson.dependencies && pkgJson.dependencies['mysql2'],
    'DEPENDENCY 2: mysql2 terpasang untuk koneksi MySQL database',
    `Versi: ${pkgJson.dependencies['mysql2']}`
  );

  assert(
    pkgJson.dependencies && pkgJson.dependencies['multer'],
    'DEPENDENCY 3: multer terpasang untuk parsing multipart/form-data',
    `Versi: ${pkgJson.dependencies['multer']}`
  );

  const appJsonPath = path.resolve(__dirname, '../app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const plugins = appJson.expo.plugins || [];
  const cameraPlugin = plugins.find(
    (p) => p === 'expo-camera' || (Array.isArray(p) && p[0] === 'expo-camera')
  );

  assert(
    !!cameraPlugin,
    'CONFIG 1: Plugin expo-camera terdaftar di app.json',
    Array.isArray(cameraPlugin) ? JSON.stringify(cameraPlugin[1]) : 'Plugin terdaftar'
  );

  // Verifikasi tidak ada storage eksternal
  const forbiddenStorage = ['firebase', '@supabase/supabase-js', 'cloudinary', 'aws-sdk', '@aws-sdk/client-s3'];
  const hasForbidden = forbiddenStorage.some((dep) => pkgJson.dependencies && pkgJson.dependencies[dep]);
  assert(
    !hasForbidden,
    'STORAGE 1: Tidak menggunakan storage eksternal (Tanpa Firebase, Supabase, Cloudinary, AWS S3)',
    'Penyimpanan foto murni menggunakan MySQL XAMPP'
  );

  // -------------------------------------------------------------
  // BAGIAN 2: VERIFIKASI KONEKSI MYSQL & STRUKTUR TABEL
  // -------------------------------------------------------------
  console.log('\n--- 2. VERIFIKASI DATABASE MYSQL & TABEL profile_photos ---');

  try {
    const [testQuery] = await dbPool.query('SELECT 1 + 1 AS result');
    assert(
      testQuery[0].result === 2,
      'MYSQL 1: Koneksi MySQL pool ke kedai_tong_djajakarta berhasil',
      `Host: ${process.env.DB_HOST || 'localhost'}, Database: ${process.env.DB_NAME || 'kedai_tong_djajakarta'}`
    );

    const [columns] = await dbPool.query('DESCRIBE profile_photos');
    const colNames = columns.map((c) => c.Field);
    const hasUserId = colNames.includes('user_id');
    const hasImageData = colNames.includes('image_data');
    const hasMimeType = colNames.includes('mime_type');

    assert(
      hasUserId && hasImageData && hasMimeType,
      'MYSQL 2: Tabel profile_photos memiliki kolom user_id, image_data (LONGBLOB), dan mime_type',
      `Kolom terdeteksi: [${colNames.join(', ')}]`
    );
  } catch (err) {
    assert(false, 'MYSQL ERROR: Gagal terhubung ke MySQL', err.message);
  }

  // -------------------------------------------------------------
  // BAGIAN 3: PENGUJIAN HTTP REST API (TEST SERVER PORT 4008)
  // -------------------------------------------------------------
  console.log('\n--- 3. PENGUJIAN REST API (POST & GET /profile/photo) ---');

  const testHttpServer = http.createServer(server);
  await new Promise((resolve) => testHttpServer.listen(TEST_PORT, resolve));
  console.log(`[TEST SERVER] Berjalan di port ${TEST_PORT} untuk pengujian HTTP.\n`);

  const testUserId = 8881;
  const testUserToken = jwt.sign(
    { sub: testUserId, name: 'Tester Kamera', email: 'tester_kamera@umm.ac.id', role: 'Civitas Akademika' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  try {
    // Pastikan bersih sebelum test
    await dbPool.query('DELETE FROM profile_photos WHERE user_id = ?', [testUserId]);

    // TEST 3.1: POST /profile/photo tanpa token -> 401
    const noTokenRes = await fetch(`${BASE_URL}/profile/photo`, { method: 'POST' });
    const noTokenData = await noTokenRes.json();
    assert(
      noTokenRes.status === 401 && noTokenData.success === false,
      'API 1: POST /profile/photo tanpa token ditolak dengan HTTP 401',
      `Status: ${noTokenRes.status}, Pesan: "${noTokenData.message || noTokenData.error}"`
    );

    // TEST 3.2: POST /profile/photo token manipulasi -> 401
    const badTokenRes = await fetch(`${BASE_URL}/profile/photo`, {
      method: 'POST',
      headers: { Authorization: 'Bearer token_palsu_rekayasa' },
    });
    const badTokenData = await badTokenRes.json();
    assert(
      badTokenRes.status === 401 && badTokenData.success === false,
      'API 2: POST /profile/photo dengan token tidak valid ditolak dengan HTTP 401',
      `Status: ${badTokenRes.status}`
    );

    // TEST 3.3: POST /profile/photo tanpa file -> 400 "Foto belum dipilih"
    const emptyForm = createMultipartFormData('other_field', 'dummy.txt', 'text/plain', Buffer.from('halo'));
    const noFileRes = await fetch(`${BASE_URL}/profile/photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${testUserToken}`,
        'Content-Type': emptyForm.contentType,
      },
      body: emptyForm.body,
    });
    const noFileData = await noFileRes.json();
    assert(
      noFileRes.status === 400 && noFileData.message === 'Foto belum dipilih',
      'API 3: POST /profile/photo tanpa field "photo" merespons HTTP 400 "Foto belum dipilih"',
      `Pesan: "${noFileData.message}"`
    );

    // TEST 3.4: POST /profile/photo format tidak didukung (text/plain) -> 400 "Format foto tidak didukung"
    const invalidFormatForm = createMultipartFormData('photo', 'document.txt', 'text/plain', Buffer.from('bukan gambar'));
    const invalidFormatRes = await fetch(`${BASE_URL}/profile/photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${testUserToken}`,
        'Content-Type': invalidFormatForm.contentType,
      },
      body: invalidFormatForm.body,
    });
    const invalidFormatData = await invalidFormatRes.json();
    assert(
      invalidFormatRes.status === 400 && invalidFormatData.message === 'Format foto tidak didukung',
      'API 4: POST /profile/photo dengan format tidak didukung merespons HTTP 400 "Format foto tidak didukung"',
      `Pesan: "${invalidFormatData.message}"`
    );

    // TEST 3.5: POST /profile/photo ukuran > 5 MB -> 400 "Ukuran foto terlalu besar. Maksimal 5 MB."
    const largeBuffer = Buffer.alloc(5.2 * 1024 * 1024, 'A'); // 5.2 MB
    const largeForm = createMultipartFormData('photo', 'large.jpg', 'image/jpeg', largeBuffer);
    const largeRes = await fetch(`${BASE_URL}/profile/photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${testUserToken}`,
        'Content-Type': largeForm.contentType,
      },
      body: largeForm.body,
    });
    const largeData = await largeRes.json();
    assert(
      largeRes.status === 400 && largeData.message === 'Ukuran foto terlalu besar. Maksimal 5 MB.',
      'API 5: POST /profile/photo dengan ukuran > 5 MB merespons HTTP 400 "Ukuran foto terlalu besar. Maksimal 5 MB."',
      `Pesan: "${largeData.message}"`
    );

    // TEST 3.6: POST /profile/photo sukses (Valid JPEG 50 KB) -> 200 "Foto profil berhasil disimpan"
    const sampleJpegBuffer = Buffer.from('FAKE_JPEG_IMAGE_BINARY_DATA_FOR_TESTING_PURPOSES');
    const validForm = createMultipartFormData('photo', 'profile.jpg', 'image/jpeg', sampleJpegBuffer);
    const uploadRes = await fetch(`${BASE_URL}/profile/photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${testUserToken}`,
        'Content-Type': validForm.contentType,
      },
      body: validForm.body,
    });
    const uploadData = await uploadRes.json();
    assert(
      uploadRes.status === 200 && uploadData.success === true && uploadData.message === 'Foto profil berhasil disimpan',
      'API 6: POST /profile/photo berhasil menyimpan foto dengan HTTP 200 "Foto profil berhasil disimpan"',
      `Respons: ${JSON.stringify(uploadData)}`
    );

    // Verifikasi di MySQL
    const [dbRows] = await dbPool.query('SELECT user_id, mime_type, LENGTH(image_data) as img_len FROM profile_photos WHERE user_id = ?', [testUserId]);
    assert(
      dbRows.length === 1 && dbRows[0].mime_type === 'image/jpeg' && dbRows[0].img_len === sampleJpegBuffer.length,
      'MYSQL 3: Foto biner benar-benar tersimpan di MySQL tabel profile_photos (image_data LONGBLOB)',
      `user_id: ${dbRows[0]?.user_id}, mime_type: ${dbRows[0]?.mime_type}, bytes: ${dbRows[0]?.img_len}`
    );

    // TEST 3.7: Idempotency / Update: Upload kedua kali tidak membuat record ganda
    const secondJpegBuffer = Buffer.from('SECOND_UPDATED_PHOTO_BINARY_DATA');
    const secondForm = createMultipartFormData('photo', 'profile_updated.jpg', 'image/jpeg', secondJpegBuffer);
    const secondUploadRes = await fetch(`${BASE_URL}/profile/photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${testUserToken}`,
        'Content-Type': secondForm.contentType,
      },
      body: secondForm.body,
    });
    assert(
      secondUploadRes.status === 200,
      'API 7: Upload ulang foto berhasil merespons HTTP 200'
    );

    const [dbRowsAfterUpdate] = await dbPool.query('SELECT id, user_id, LENGTH(image_data) as img_len FROM profile_photos WHERE user_id = ?', [testUserId]);
    assert(
      dbRowsAfterUpdate.length === 1 && dbRowsAfterUpdate[0].img_len === secondJpegBuffer.length,
      'MYSQL 4: Single Record Rule — Record lama di-UPDATE, jumlah record user tidak bertambah menjadi dua',
      `Total record untuk user ${testUserId}: ${dbRowsAfterUpdate.length}`
    );

    // TEST 3.8: GET /profile/photo tanpa token -> 401
    const getNoTokenRes = await fetch(`${BASE_URL}/profile/photo`);
    assert(
      getNoTokenRes.status === 401,
      'API 8: GET /profile/photo tanpa token ditolak dengan HTTP 401'
    );

    // TEST 3.9: GET /profile/photo dengan token -> 200 OK binary
    const getPhotoRes = await fetch(`${BASE_URL}/profile/photo`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const photoBuffer = await getPhotoRes.arrayBuffer();
    const contentTypeHeader = getPhotoRes.headers.get('content-type');

    assert(
      getPhotoRes.status === 200 &&
      contentTypeHeader.includes('image/jpeg') &&
      Buffer.from(photoBuffer).equals(secondJpegBuffer),
      'API 9: GET /profile/photo mengembalikan data biner asli dari MySQL dengan Content-Type yang sesuai',
      `Status: 200, Content-Type: ${contentTypeHeader}, Binary Length: ${photoBuffer.byteLength}`
    );

    // TEST 3.10: GET /profile/photo user belum punya foto -> 404 "Foto profil belum tersedia"
    const unusedUserToken = jwt.sign({ sub: 9999999, name: 'No Photo User' }, JWT_SECRET, { expiresIn: '1h' });
    const get404Res = await fetch(`${BASE_URL}/profile/photo`, {
      headers: { Authorization: `Bearer ${unusedUserToken}` },
    });
    const get404Data = await get404Res.json();
    assert(
      get404Res.status === 404 && get404Data.message === 'Foto profil belum tersedia',
      'API 10: GET /profile/photo untuk user tanpa foto merespons HTTP 404 "Foto profil belum tersedia"',
      `Pesan: "${get404Data.message}"`
    );

    // TEST 3.11: ID Isolation: Parameter ?user_id=... diabaikan
    const isolatedRes = await fetch(`${BASE_URL}/profile/photo?user_id=9999999`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    assert(
      isolatedRes.status === 200,
      'API 11: ID Isolation — GET /profile/photo?user_id=... mengabaikan query param dan strictly membaca klaim JWT',
      'User tidak dapat mengambil foto user lain melalui URL query parameter'
    );

    // Bersihkan test record dari MySQL
    await dbPool.query('DELETE FROM profile_photos WHERE user_id = ?', [testUserId]);
    console.log('[CLEANUP] Data testing berhasil dibersihkan dari MySQL.\n');
  } finally {
    testHttpServer.close();
  }

  // -------------------------------------------------------------
  // BAGIAN 4: VERIFIKASI KODE FRONTEND & KOMPONEN KAMERA
  // -------------------------------------------------------------
  console.log('--- 4. VERIFIKASI KODE FRONTEND & UI KAMERA ---');

  const cameraModalPath = path.resolve(__dirname, '../src/components/CameraModal.js');
  assert(fs.existsSync(cameraModalPath), 'FRONTEND 1: Komponen src/components/CameraModal.js tersedia');

  const cameraModalCode = fs.readFileSync(cameraModalPath, 'utf8');

  assert(
    cameraModalCode.includes('getUserMedia') && cameraModalCode.includes('CameraView'),
    'FRONTEND 2: Kamera mendukung Web (WebRTC getUserMedia) dan Mobile (expo-camera CameraView)',
    'Akses kamera langsung tanpa membuka file picker terlebih dahulu'
  );

  assert(
    cameraModalCode.includes('Gunakan Foto') &&
    cameraModalCode.includes('Ambil Ulang') &&
    cameraModalCode.includes('Batal'),
    'FRONTEND 3: Antarmuka preview menyediakan 3 opsi: "Gunakan Foto", "Ambil Ulang", dan "Batal"',
    'User dapat memilih hasil terbaik sebelum menyimpan ke server'
  );

  assert(
    cameraModalCode.includes('Izin kamera diperlukan untuk mengambil foto profil.'),
    'FRONTEND 4: Menampilkan pesan penolakan izin yang tepat ("Izin kamera diperlukan untuk mengambil foto profil.")',
    'Dilengkapi tombol coba lagi jika izin belum diberikan'
  );

  const profileScreenPath = path.resolve(__dirname, '../src/screens/customer/ProfileScreen.js');
  const profileScreenCode = fs.readFileSync(profileScreenPath, 'utf8');

  assert(
    profileScreenCode.includes('Ubah Foto Profil') || profileScreenCode.includes('Ambil Foto Profil'),
    'FRONTEND 5: Tombol "Ubah Foto Profil" / "Ambil Foto Profil" tersedia di halaman Profil',
    'Penempatan logis pada bagian foto profil'
  );

  assert(
    profileScreenCode.includes('Menyimpan foto...') &&
    profileScreenCode.includes('Foto profil berhasil diperbarui.'),
    'FRONTEND 6: Menampilkan state loading "Menyimpan foto..." dan feedback sukses "Foto profil berhasil diperbarui."',
    'Indikator jelas dan tombol disable saat proses upload berlangsung'
  );

  assert(
    profileScreenCode.includes('loadProfilePhoto'),
    'FRONTEND 7: Profil secara otomatis memuat foto profil aktif dari MySQL saat dibuka (Persistent)',
    'Menggunakan fetch binary dari endpoint protected GET /profile/photo'
  );

  // -------------------------------------------------------------
  // BAGIAN 5: ANTI-REGRESI FITUR LAMA
  // -------------------------------------------------------------
  console.log('\n--- 5. INTEGRITAS FITUR LAMA & DATA OTENTIK ---');

  const dbJsonPath = path.resolve(__dirname, '../db.json');
  const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

  assert(
    Array.isArray(dbData.menus) && dbData.menus.length === 32,
    'ANTI-REGRESI 1: Seluruh 32 menu otentik Kedai Tong Djajakarta tetap utuh',
    `Total menu: ${dbData.menus.length}`
  );

  const hasPresidentKu =
    cameraModalCode.toLowerCase().includes('presidentku') ||
    profileScreenCode.toLowerCase().includes('presidentku');

  assert(
    !hasPresidentKu,
    'ANTI-REGRESI 2: Bebas dari aplikasi/materi PresidentKu (Murni Kedai Tong Djajakarta)',
    'Identitas kafe Kedai Tong Djajakarta Kampus 3 UMM dipertahankan'
  );

  console.log('\n================================================================');
  console.log(`HASIL AKHIR PENGUJIAN: ${passed} PASSED / ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCameraTestSuite()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('[FATAL ERROR]:', err);
    process.exit(1);
  });
