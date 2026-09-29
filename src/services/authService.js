import { setItem, getItem, deleteItem } from './secureStoreService';

/**
 * Authentication & Session Service for Kedai Tong Djajakarta
 * 
 * Implements:
 * - Secure credential hashing (never plain-text password storage)
 * - Session creation, validation, and clearance in Secure Storage
 * - Protection against console logging of sensitive data
 */

const SECURE_SESSION_KEY = 'tdj_auth_session';
const SECURE_USERS_KEY = 'tdj_registered_users';

// Minimal pure-JS SHA-256 implementation for local cryptographic hashing
function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';

  let words = [];
  let asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [];
  let k = [];

  let isComposite = {};
  for (let candidate = 2, primeCounter = 0; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    let w = words.slice(j, (j += 16));
    let oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      let i2 = i + j;
      let w15 = w[i - 15],
        w2 = w[i - 2];

      let a = hash[0],
        e = hash[4];
      let temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);

      let temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      let byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

/**
 * Hash password with a salt using SHA-256
 */
const hashPassword = (password, salt) => {
  return sha256(`__TDJ_SALT_${salt}_${password}__`);
};

/**
 * Generate a random cryptographic salt
 */
const generateSalt = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36)
  );
};

/**
 * Default Seed User for demonstration
 */
const DEFAULT_SEED_USERS = [
  {
    id: 'usr_001',
    name: 'Naufal Atha',
    email: 'civitas@umm.ac.id',
    role: 'Civitas Akademika • Kampus 3 UMM',
    salt: 'seed_salt_123',
    passwordHash: hashPassword('KedaiTong123', 'seed_salt_123'),
    createdAt: new Date().toISOString(),
  },
];

/**
 * Get all registered users from Secure Storage
 */
export const getRegisteredUsers = async () => {
  const users = await getItem(SECURE_USERS_KEY);
  if (!users || !Array.isArray(users) || users.length === 0) {
    // Seed default user into secure storage
    await setItem(SECURE_USERS_KEY, DEFAULT_SEED_USERS);
    return DEFAULT_SEED_USERS;
  }
  return users;
};

/**
 * Register a new user and securely store their hashed credentials
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.password
 */
export const registerUser = async ({ name, email, password }) => {
  try {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const users = await getRegisteredUsers();

    // Check if email already registered
    const existing = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );
    if (existing) {
      return {
        success: false,
        error: 'Email sudah terdaftar. Silakan masuk atau gunakan email lain.',
      };
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    const newUser = {
      id: `usr_${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      role: 'Civitas Akademika • Kampus 3 UMM',
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    await setItem(SECURE_USERS_KEY, updatedUsers);

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat menyimpan akun. Silakan coba lagi.',
    };
  }
};

/**
 * Authenticate user with email/username & password
 * @param {string} identifier - Email or Name
 * @param {string} password 
 */
export const authenticateUser = async (identifier, password) => {
  try {
    const trimmedIdentifier = identifier.trim().toLowerCase();
    const users = await getRegisteredUsers();

    // Match by email or by name (case-insensitive)
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === trimmedIdentifier ||
        u.name.toLowerCase() === trimmedIdentifier
    );

    if (!user) {
      return {
        success: false,
        error: 'Email atau password salah.',
      };
    }

    // Verify hashed password
    const computedHash = hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      return {
        success: false,
        error: 'Email atau password salah.',
      };
    }

    // Create secure session
    const session = {
      token: `tdj_sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      createdAt: Date.now(),
      // Session expires in 7 days
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    // Save session in SecureStore
    await setItem(SECURE_SESSION_KEY, session);

    return {
      success: true,
      session,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Gagal melakukan verifikasi autentikasi.',
    };
  }
};

/**
 * Read and validate active session from Secure Storage
 * @returns {Promise<object|null>}
 */
export const getActiveSession = async () => {
  try {
    const session = await getItem(SECURE_SESSION_KEY);
    if (!session || !session.token || !session.user) {
      return null;
    }

    // Check expiration
    if (session.expiresAt && Date.now() > session.expiresAt) {
      // Session expired, delete it
      await deleteItem(SECURE_SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

/**
 * Clear session from Secure Storage upon Logout
 * @returns {Promise<boolean>}
 */
export const clearActiveSession = async () => {
  try {
    await deleteItem(SECURE_SESSION_KEY);
    return true;
  } catch {
    return false;
  }
};
