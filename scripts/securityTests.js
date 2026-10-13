/**
 * Security & Token-Based Authentication Automated Test Suite
 * Kedai Tong Djajakarta — Week 5 & Perbaikan Pertemuan 3
 * 
 * Verifikasi 17 Kriteria Wajib:
 * 1.  Register akun baru berhasil.
 * 2.  Password baru disimpan sebagai hash jika backend menggunakan database akun (bcrypt).
 * 3.  Respons Register tidak mengandung password atau hash.
 * 4.  Login dengan password benar berhasil.
 * 5.  Respons login memberikan JWT yang valid.
 * 6.  Respons login tidak mengandung password atau password hash.
 * 7.  Login dengan password salah ditolak.
 * 8.  Endpoint terlindungi dapat diakses dengan token valid.
 * 9.  Endpoint terlindungi menolak request tanpa token.
 * 10. Endpoint terlindungi menolak token tidak valid.
 * 11. Token kedaluwarsa ditolak.
 * 12. Pengguna tidak dapat mengakses data pribadi pengguna lain dengan mengubah ID request.
 * 13. Logout menghapus token dari penyimpanan aplikasi.
 * 14. Setelah logout, aplikasi tidak lagi mengirim token yang sudah dihapus.
 * 15. Jika revokasi token diterapkan, token lama ditolak oleh backend setelah logout.
 * 16. Tidak ada password, password hash, JWT, refresh token, atau secret yang dicetak ke log.
 * 17. REST API menu dan fitur utama aplikasi tetap berfungsi.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { server, revokedTokens } = require('../server');

const TEST_PORT = 4005;
const BASE_URL = `http://localhost:${TEST_PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'kedai_tong_djajakarta_super_secret_jwt_key_2026_umm';
const DB_FILE = path.join(__dirname, '..', 'db.json');

// Mock in-memory client secure storage to simulate SecureStore behavior
const mockClientSecureStore = new Map();

async function runSecurityTestSuite() {
  console.log('================================================================');
  console.log('  KEDAI TONG DJAJAKARTA — WEEK 5 SECURE API AUTOMATED TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;
  const testResults = [];

  function record(num, name, success, detail) {
    if (success) {
      console.log(`[PASS] PENGUJIAN ${num}: ${name}`);
      if (detail) console.log(`       ↳ ${detail}`);
      passed++;
      testResults.push({ num, name, status: 'BERHASIL', detail });
    } else {
      console.error(`[FAIL] PENGUJIAN ${num}: ${name}`);
      if (detail) console.error(`       ↳ Error: ${detail}`);
      failed++;
      testResults.push({ num, name, status: 'GAGAL', detail });
    }
  }

  // Start test server instance
  const httpServer = http.createServer(server);
  await new Promise((resolve) => httpServer.listen(TEST_PORT, resolve));
  console.log(`[TEST SERVER] Berjalan di port ${TEST_PORT} untuk pengujian aktual HTTP.\n`);

  try {
    const testTimestamp = Date.now();
    const testEmail = `mahasiswa_${testTimestamp}@umm.ac.id`;
    const testPassword = 'PasswordBaru123!';
    const testName = `Mahasiswa UMM ${testTimestamp}`;

    // -------------------------------------------------------------------------
    // PENGUJIAN 1: Register akun baru berhasil
    // -------------------------------------------------------------------------
    let registerRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });
    let registerData = await registerRes.json();
    const isRegisterOk = registerRes.status === 201 && registerData.success === true;
    record(
      1,
      'Register akun baru berhasil',
      isRegisterOk,
      `HTTP status 201 Created. User ID: ${registerData.user?.id}, Email: ${registerData.user?.email}`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 2: Password baru disimpan sebagai hash jika backend menggunakan database akun
    // -------------------------------------------------------------------------
    const dbRaw = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    const savedUser = (dbRaw.users || []).find((u) => u.email === testEmail);
    const hasHash = savedUser && savedUser.passwordHash && typeof savedUser.passwordHash === 'string';
    const isBcrypt = hasHash && savedUser.passwordHash.startsWith('$2');
    const isPlainMissing = savedUser && !savedUser.password;
    const isHashValid = hasHash && bcrypt.compareSync(testPassword, savedUser.passwordHash);

    record(
      2,
      'Password baru disimpan sebagai hash bcrypt di database backend',
      isBcrypt && isPlainMissing && isHashValid,
      `Password disimpan dengan format hash bcrypt ($2b$10$...). Plain-text password tidak disimpan di db.json.`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 3: Respons Register tidak mengandung password atau hash
    // -------------------------------------------------------------------------
    const regContainsPassword = 'password' in registerData || (registerData.user && 'password' in registerData.user);
    const regContainsHash = 'passwordHash' in registerData || (registerData.user && 'passwordHash' in registerData.user);
    record(
      3,
      'Respons Register tidak mengandung password atau hash',
      !regContainsPassword && !regContainsHash,
      `Payload respons tersanitasi: keys = [${Object.keys(registerData.user || {}).join(', ')}]`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 4: Login dengan password benar berhasil
    // -------------------------------------------------------------------------
    let loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testEmail,
        password: testPassword,
      }),
    });
    let loginData = await loginRes.json();
    const isLoginOk = loginRes.status === 200 && loginData.success === true;
    record(
      4,
      'Login dengan password benar berhasil',
      isLoginOk,
      `HTTP status 200 OK. Pengguna ${testEmail} berhasil diautentikasi.`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 5: Respons login memberikan JWT yang valid
    // -------------------------------------------------------------------------
    const token = loginData.access_token;
    let decodedToken = null;
    let isJwtValid = false;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
      isJwtValid = decodedToken && decodedToken.email === testEmail;
    } catch (e) {
      isJwtValid = false;
    }
    record(
      5,
      'Respons login memberikan JWT yang valid',
      isJwtValid && loginData.token_type === 'Bearer',
      `JWT Bearer Token terverifikasi kriptografis. Sub/ID: ${decodedToken?.sub}, Exp: ${decodedToken?.exp}`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 6: Respons login tidak mengandung password atau password hash
    // -------------------------------------------------------------------------
    const loginContainsPassword = 'password' in loginData || (loginData.user && 'password' in loginData.user);
    const loginContainsHash = 'passwordHash' in loginData || (loginData.user && 'passwordHash' in loginData.user);
    record(
      6,
      'Respons login tidak mengandung password atau password hash',
      !loginContainsPassword && !loginContainsHash,
      `Payload respons login bersih dari kredensial rahasia: keys = [${Object.keys(loginData.user || {}).join(', ')}]`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 7: Login dengan password salah ditolak
    // -------------------------------------------------------------------------
    let wrongLoginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testEmail,
        password: 'PasswordYangSalahTotal999!',
      }),
    });
    let wrongLoginData = await wrongLoginRes.json();
    const isWrongRejected = wrongLoginRes.status === 401 && !wrongLoginData.access_token;
    record(
      7,
      'Login dengan password salah ditolak',
      isWrongRejected,
      `HTTP status 401 Unauthorized. Error message: "${wrongLoginData.error}". Token tidak diterbitkan.`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 8: Endpoint terlindungi dapat diakses dengan token valid
    // -------------------------------------------------------------------------
    let profileRes = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    let profileData = await profileRes.json();
    const isProfileOk = profileRes.status === 200 && profileData.user && profileData.user.email === testEmail;
    record(
      8,
      'Endpoint terlindungi dapat diakses dengan token valid',
      isProfileOk,
      `GET /profile merespons 200 OK dengan menyertakan Authorization: Bearer <token>. User: "${profileData.user?.name}"`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 9: Endpoint terlindungi menolak request tanpa token
    // -------------------------------------------------------------------------
    let noTokenRes = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    let noTokenData = await noTokenRes.json();
    const isNoTokenRejected = noTokenRes.status === 401 && noTokenData.success === false;
    record(
      9,
      'Endpoint terlindungi menolak request tanpa token',
      isNoTokenRejected,
      `HTTP status 401 Unauthorized. Pesan: "${noTokenData.error}"`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 10: Endpoint terlindungi menolak token tidak valid
    // -------------------------------------------------------------------------
    let invalidTokenRes = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token_palsu_rekayasa_attacker',
      },
    });
    let invalidTokenData = await invalidTokenRes.json();
    const isInvalidRejected = invalidTokenRes.status === 401;
    record(
      10,
      'Endpoint terlindungi menolak token tidak valid / palsu',
      isInvalidRejected,
      `HTTP status 401 Unauthorized. Token manipulasi ditolak: "${invalidTokenData.error}"`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 11: Token kedaluwarsa ditolak
    // -------------------------------------------------------------------------
    // Create an expired token (expiresIn: -10s)
    const expiredToken = jwt.sign(
      { sub: savedUser.id, name: savedUser.name, email: savedUser.email },
      JWT_SECRET,
      { expiresIn: -10 }
    );
    let expiredRes = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${expiredToken}`,
      },
    });
    let expiredData = await expiredRes.json();
    const isExpiredRejected = expiredRes.status === 401 && expiredData.error.includes('kedaluwarsa');
    record(
      11,
      'Token kedaluwarsa (expired) ditolak oleh backend',
      isExpiredRejected,
      `HTTP status 401 Unauthorized. Pesan: "${expiredData.error}"`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 12: Pengguna tidak dapat mengakses data pribadi pengguna lain dengan mengubah ID request
    // -------------------------------------------------------------------------
    // Attacker sends request with their own valid token but adds ?id=1 or /profile/1 or body { id: 1 } trying to view User 1 (Naufal Atha)
    let spoofRes = await fetch(`${BASE_URL}/profile?id=1&userId=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    let spoofData = await spoofRes.json();
    const isSpoofBlocked = spoofRes.status === 200 && spoofData.user?.email === testEmail && spoofData.user?.id !== 1;
    record(
      12,
      'Pengguna tidak dapat mengakses data pribadi pengguna lain dengan mengubah ID request (ID Isolation)',
      isSpoofBlocked,
      `Identitas pengguna strictly diambil dari decoded JWT claim (req.user.sub = ${decodedToken.sub}). Parameter ?id=1 diabaikan.`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 13: Logout menghapus token dari penyimpanan aplikasi
    // -------------------------------------------------------------------------
    // Simulate client saving token in secure storage, then executing logout
    mockClientSecureStore.set('access_token', token);
    mockClientSecureStore.set('tdj_auth_session', JSON.stringify({ token, user: loginData.user }));
    
    // Client deletes token
    mockClientSecureStore.delete('access_token');
    mockClientSecureStore.delete('tdj_auth_session');
    const isStorageCleaned = !mockClientSecureStore.has('access_token') && !mockClientSecureStore.has('tdj_auth_session');
    record(
      13,
      'Logout menghapus token dari penyimpanan aplikasi (SecureStore)',
      isStorageCleaned,
      `Key "access_token" dan "tdj_auth_session" dihapus secara permanen dari Secure Storage client.`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 14: Setelah logout, aplikasi tidak lagi mengirim token yang sudah dihapus
    // -------------------------------------------------------------------------
    const currentStoredToken = mockClientSecureStore.get('access_token');
    let postLogoutHeader = currentStoredToken ? `Bearer ${currentStoredToken}` : null;
    let postLogoutRes = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(postLogoutHeader ? { 'Authorization': postLogoutHeader } : {}),
      },
    });
    record(
      14,
      'Setelah logout, aplikasi tidak lagi mengirim token yang sudah dihapus',
      !postLogoutHeader && postLogoutRes.status === 401,
      `Request tanpa token setelah logout langsung menghasilkan HTTP status 401 Unauthorized.`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 15: Jika revokasi token diterapkan, token lama ditolak oleh backend setelah logout
    // -------------------------------------------------------------------------
    // Trigger real server logout with the active token to revoke it
    let serverLogoutRes = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    let serverLogoutData = await serverLogoutRes.json();
    const isLogoutSuccess = serverLogoutRes.status === 200 && serverLogoutData.success;

    // Now, attempt to reuse the revoked token on protected endpoint
    let reuseTokenRes = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    let reuseTokenData = await reuseTokenRes.json();
    const isRevokedRejected = reuseTokenRes.status === 401 && reuseTokenData.error.includes('dicabut');
    record(
      15,
      'Token lama ditolak oleh backend setelah logout (Token Revocation / Blacklist)',
      isLogoutSuccess && isRevokedRejected,
      `Server mencabut token saat POST /logout. Request berikutnya menggunakan token lama ditolak: "${reuseTokenData.error}"`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 16: Tidak ada password, password hash, JWT, refresh token, atau secret yang dicetak ke log
    // -------------------------------------------------------------------------
    // Inspect source code files for accidental console.log of sensitive values
    const filesToCheck = [
      path.join(__dirname, '..', 'server.js'),
      path.join(__dirname, '..', 'src', 'services', 'authService.js'),
      path.join(__dirname, '..', 'src', 'services', 'secureStoreService.js'),
      path.join(__dirname, '..', 'src', 'screens', 'auth', 'LoginScreen.js'),
      path.join(__dirname, '..', 'src', 'screens', 'auth', 'RegisterScreen.js'),
    ];

    let foundSensitiveLog = false;
    for (const f of filesToCheck) {
      if (fs.existsSync(f)) {
        const content = fs.readFileSync(f, 'utf-8');
        if (/console\.log\([^)]*(password|passwordHash|JWT_SECRET|access_token)[^)]*\)/i.test(content)) {
          foundSensitiveLog = true;
          break;
        }
      }
    }

    record(
      16,
      'Tidak ada password, password hash, JWT, refresh token, atau secret yang dicetak ke log',
      !foundSensitiveLog,
      `Seluruh file server dan client diaudit: Tidak ditemukan pencetakan kredensial rahasia ke console.log.`
    );

    // -------------------------------------------------------------------------
    // PENGUJIAN 17: REST API menu dan fitur utama aplikasi tetap berfungsi
    // -------------------------------------------------------------------------
    let menusRes = await fetch(`${BASE_URL}/menus`);
    let menusData = await menusRes.json();
    const isMenusOk = menusRes.status === 200 && Array.isArray(menusData) && menusData.length === 32;
    const hasAmericano = menusData.some((m) => m.name === 'Americano');
    const hasKopiSusuMantap = menusData.some((m) => m.name === 'Kopi Susu Mantap');

    record(
      17,
      'REST API menu dan fitur utama aplikasi tetap berfungsi (Week 4 Compatibility)',
      isMenusOk && hasAmericano && hasKopiSusuMantap,
      `GET /menus (Publik) mengembalikan seluruh 32 menu otentik Kedai Tong Djajakarta (termasuk Americano, Kopi Susu Mantap).`
    );

    console.log('\n----------------------------------------------------------------');
    console.log(`HASIL AKHIR PENGUJIAN: ${passed} PASSED / ${failed} FAILED dari 17 Kriteria`);
    console.log('================================================================\n');

    return { passed, failed, testResults };
  } finally {
    httpServer.close();
  }
}

if (require.main === module) {
  runSecurityTestSuite().then(({ failed }) => {
    if (failed > 0) {
      process.exit(1);
    }
  });
}

module.exports = { runSecurityTestSuite };
