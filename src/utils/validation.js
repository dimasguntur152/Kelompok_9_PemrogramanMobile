/**
 * Input validation helpers for Kedai Tong Djajakarta
 * Ensures data integrity, security constraints, and clear feedback.
 */

// Standard RFC-compliant email regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Check if a string is a valid email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate Register form input
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} [params.confirmPassword]
 * @returns {{ isValid: boolean, errors: { [key: string]: string } }}
 */
export const validateRegister = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  // 1. Name validation
  if (!name || !name.trim()) {
    errors.name = 'Nama lengkap wajib diisi.';
  } else if (name.trim().length < 2) {
    errors.name = 'Nama lengkap minimal 2 karakter.';
  }

  // 2. Email validation
  if (!email || !email.trim()) {
    errors.email = 'Email wajib diisi.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Format email tidak valid (contoh: civitas@umm.ac.id).';
  }

  // 3. Password validation
  if (!password) {
    errors.password = 'Password wajib diisi.';
  } else if (password.length < 6) {
    errors.password = 'Password minimal harus 6 karakter.';
  }

  // 4. Confirm Password validation (if provided)
  if (confirmPassword !== undefined) {
    if (!confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password wajib diisi.';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Konfirmasi password tidak sesuai.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate Login form input
 * @param {object} params
 * @param {string} params.identifier - Email or Username
 * @param {string} params.password
 * @returns {{ isValid: boolean, errors: { [key: string]: string } }}
 */
export const validateLogin = ({ identifier, password }) => {
  const errors = {};

  if (!identifier || !identifier.trim()) {
    errors.identifier = 'Email atau username wajib diisi.';
  }

  if (!password) {
    errors.password = 'Password wajib diisi.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
