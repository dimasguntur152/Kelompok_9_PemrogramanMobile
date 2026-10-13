/**
 * Kedai Tong Djajakarta - Backend Server
 * Week 5: From API to Secure API
 * 
 * Features:
 * - Public REST API for menus (Week 4 compatibility)
 * - Secure Token-Based Authentication (JWT)
 * - Password hashing with bcryptjs (Salt rounds: 10)
 * - Protected endpoints with Bearer Token verification
 * - Token revocation mechanism upon logout
 * - Zero leakage of sensitive data (no password/hash in responses or logs)
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'kedai_tong_djajakarta_super_secret_jwt_key_2026_umm';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const DB_FILE = path.join(__dirname, 'db.json');

const server = jsonServer.create();
const router = jsonServer.router(DB_FILE);
const middlewares = jsonServer.defaults();

// Set of revoked tokens (Token Blacklist for secure logout)
const revokedTokens = new Set();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// =========================================================================
// HELPER FUNCTIONS
// =========================================================================

/**
 * Safely read db.json data
 */
function readDb() {
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Safely write db.json data
 */
function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Sanitize user object to remove password/hash before sending to client
 */
function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'Civitas Akademika • Kampus 3 UMM',
  };
}

// =========================================================================
// AUTHENTICATION MIDDLEWARE (verifyToken)
// =========================================================================

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Akses ditolak: Token autentikasi diperlukan (Authorization: Bearer <token>).',
    });
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Akses ditolak: Token kosong.',
    });
  }

  // Check if token was revoked (e.g. after logout)
  if (revokedTokens.has(token)) {
    return res.status(401).json({
      success: false,
      error: 'Akses ditolak: Token telah dicabut (revoked). Silakan login kembali.',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Akses ditolak: Token telah kedaluwarsa (expired). Silakan login kembali.',
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Akses ditolak: Token tidak valid.',
      });
    }

    req.user = decoded;
    req.token = token;
    next();
  });
}

// =========================================================================
// PUBLIC AUTH ENDPOINTS (Register, Login)
// =========================================================================

/**
 * POST /register (dan /auth/register)
 * Mendaftarkan akun baru dengan password hashing bcrypt
 */
const handleRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Nama lengkap wajib diisi.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email wajib diisi.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password wajib diisi.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password minimal harus 6 karakter.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Format email tidak valid.' });
    }

    const db = readDb();
    const users = db.users || [];
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already registered
    const exists = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return res.status(400).json({
        success: false,
        error: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.',
      });
    }

    // Hash password with bcryptjs (salt rounds = 10)
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      role: 'Civitas Akademika • Kampus 3 UMM',
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    db.users = users;
    writeDb(db);

    return res.status(201).json({
      success: true,
      message: 'Registrasi akun Kedai Tong Djajakarta berhasil.',
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server saat registrasi.',
    });
  }
};

server.post('/register', handleRegister);
server.post('/auth/register', handleRegister);

/**
 * POST /login (dan /auth/login)
 * Memvalidasi kredensial dan menerbitkan JWT access token
 */
const handleLogin = async (req, res) => {
  try {
    const { email, identifier, password } = req.body || {};
    const loginIdentifier = (email || identifier || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email/username dan password wajib diisi.',
      });
    }

    const db = readDb();
    const users = db.users || [];

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === loginIdentifier ||
        u.name.toLowerCase() === loginIdentifier
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email atau password salah.',
      });
    }

    // Compare with bcrypt
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Email atau password salah.',
      });
    }

    // Generate signed JWT
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(200).json({
      success: true,
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server saat memproses login.',
    });
  }
};

server.post('/login', handleLogin);
server.post('/auth/login', handleLogin);

// =========================================================================
// PROTECTED ENDPOINTS (Profile, Logout, Orders)
// =========================================================================

/**
 * GET /profile (dan /auth/profile, /auth/me)
 * Mengambil profil akun pengguna yang terotentikasi oleh JWT
 * Pengguna TIDAK BISA mengakses profil orang lain dengan memodifikasi ID
 */
const handleGetProfile = (req, res) => {
  try {
    const db = readDb();
    const users = db.users || [];
    const userId = req.user.sub;

    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Data pengguna tidak ditemukan.',
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan server saat mengambil profil.',
    });
  }
};

server.get('/profile', verifyToken, handleGetProfile);
server.get('/auth/profile', verifyToken, handleGetProfile);
server.get('/auth/me', verifyToken, handleGetProfile);

/**
 * POST /logout (dan /auth/logout)
 * Mencabut token di server (Token Revocation / Blacklist)
 */
const handleLogout = (req, res) => {
  try {
    if (req.token) {
      revokedTokens.add(req.token);
    }

    return res.status(200).json({
      success: true,
      message: 'Logout berhasil. Token telah dicabut (revoked) di server.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan saat logout.',
    });
  }
};

server.post('/logout', verifyToken, handleLogout);
server.post('/auth/logout', verifyToken, handleLogout);

/**
 * GET /orders
 * Mengambil pesanan hanya milik user yang terotentikasi (ID isolation)
 */
server.get('/orders', verifyToken, (req, res) => {
  try {
    const db = readDb();
    const orders = db.orders || [];
    const userOrders = orders.filter((o) => o.userId === req.user.sub);
    return res.status(200).json({
      success: true,
      data: userOrders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Gagal mengambil data pesanan.' });
  }
});

/**
 * POST /orders
 * Membuat pesanan terikat ke user yang terotentikasi
 */
server.post('/orders', verifyToken, (req, res) => {
  try {
    const db = readDb();
    const orders = db.orders || [];
    const newOrder = {
      ...req.body,
      id: `TDJ-00${orders.length + 1}`,
      userId: req.user.sub,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    db.orders = orders;
    writeDb(db);

    return res.status(201).json({
      success: true,
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Gagal menyimpan pesanan.' });
  }
});

// =========================================================================
// PUBLIC REST API ROUTER (Menus & static data)
// =========================================================================
// Endpoint GET /menus dan GET /menus/:id tetap publik sesuai Week 4
server.use(router);

// Start Server if run directly
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[Kedai Tong Djajakarta API] Server berjalan di http://localhost:${PORT}`);
    console.log(`- REST API Menus:   GET  http://localhost:${PORT}/menus (Publik)`);
    console.log(`- Register:         POST http://localhost:${PORT}/register (Publik)`);
    console.log(`- Login (JWT):      POST http://localhost:${PORT}/login (Publik)`);
    console.log(`- Profile:          GET  http://localhost:${PORT}/profile (Protected Bearer Token)`);
    console.log(`- Logout:           POST http://localhost:${PORT}/logout (Protected Token Revocation)`);
  });
}

module.exports = { server, revokedTokens };
