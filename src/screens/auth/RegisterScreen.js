import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { validateRegister } from '../../utils/validation';

export const RegisterScreen = () => {
  const { register, navigateTo } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setRegisterError('');
    setSuccessMessage('');

    // 1. Validation
    const validation = validateRegister({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});

    // 2. Register via auth service
    setIsLoading(true);
    const result = await register({ name, email, password });
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(
        'Akun berhasil didaftarkan! Data Anda telah diamankan di Secure Storage. Mengalihkan ke halaman Masuk...'
      );
      setTimeout(() => {
        navigateTo('login');
      }, 1500);
    } else {
      setRegisterError(result.error || 'Gagal mendaftar akun. Silakan coba lagi.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation Row */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigateTo('login')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Kembali ke halaman Masuk"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.topNavTitle}>Daftar Akun Baru</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
            accessibilityLabel="Logo Kedai Tong Djajakarta"
          />
          <Text style={styles.brandTitle}>Kedai Tong Djajakarta</Text>
          <Text style={styles.brandCampus}>
            Kampus 3 UMM • GKB 2 Basement
          </Text>
        </View>

        {/* Success Banner */}
        {successMessage ? (
          <View
            style={styles.successBanner}
            accessibilityRole="alert"
            accessibilityLabel={successMessage}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.statusSuccess}
            />
            <Text style={styles.successBannerText}>{successMessage}</Text>
          </View>
        ) : null}

        {/* Registration Error Banner */}
        {registerError ? (
          <View
            style={styles.errorBanner}
            accessibilityRole="alert"
            accessibilityLabel={registerError}
          >
            <Ionicons
              name="alert-circle"
              size={20}
              color={colors.primaryLight}
            />
            <Text style={styles.errorBannerText}>{registerError}</Text>
          </View>
        ) : null}

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Registrasi Tong Family</Text>
          <Text style={styles.formSubtitle}>
            Daftarkan akun untuk pemesanan cepat dan kemudahan transaksi
          </Text>

          {/* Nama Lengkap */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Nama Lengkap <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                errors.name && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={errors.name ? colors.primaryLight : colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  if (registerError) setRegisterError('');
                }}
                autoCapitalize="words"
                returnKeyType="next"
                accessibilityLabel="Input Nama Lengkap"
              />
            </View>
            {errors.name ? (
              <Text style={styles.fieldErrorText}>{errors.name}</Text>
            ) : null}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Email Civitas UMM <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                errors.email && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={errors.email ? colors.primaryLight : colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="contoh: nama@umm.ac.id"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  if (registerError) setRegisterError('');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                returnKeyType="next"
                accessibilityLabel="Input Email"
              />
            </View>
            {errors.email ? (
              <Text style={styles.fieldErrorText}>{errors.email}</Text>
            ) : null}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Password <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                errors.password && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={errors.password ? colors.primaryLight : colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Minimal 6 karakter"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: null }));
                  }
                  if (registerError) setRegisterError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                accessibilityLabel="Input Password Baru"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? 'Sembunyikan password' : 'Lihat password'
                }
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.fieldErrorText}>{errors.password}</Text>
            ) : null}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Konfirmasi Password <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                errors.confirmPassword && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={
                  errors.confirmPassword
                    ? colors.primaryLight
                    : colors.textMuted
                }
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Ulangi password di atas"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: null,
                    }));
                  }
                  if (registerError) setRegisterError('');
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                accessibilityLabel="Konfirmasi Password Baru"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={
                  showConfirmPassword
                    ? 'Sembunyikan konfirmasi password'
                    : 'Lihat konfirmasi password'
                }
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.fieldErrorText}>
                {errors.confirmPassword}
              </Text>
            ) : null}
          </View>

          {/* Security Note */}
          <View style={styles.securityNoteBox}>
            <Ionicons
              name="lock-closed"
              size={14}
              color={colors.statusSuccess}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.securityNoteText}>
              Kredensial Anda dienkripsi secara lokal menggunakan hashing SHA-256 dan disimpan di Secure Storage.
            </Text>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Tombol Daftar Akun"
          >
            {isLoading ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Daftar Akun</Text>
                <Ionicons
                  name="person-add-outline"
                  size={18}
                  color={colors.textInverse}
                  style={{ marginLeft: 8 }}
                />
              </>
            )}
          </TouchableOpacity>

          {/* Switch to Login */}
          <View style={styles.switchAuthRow}>
            <Text style={styles.switchAuthPrompt}>Sudah punya akun?</Text>
            <TouchableOpacity
              onPress={() => navigateTo('login')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Masuk ke akun yang sudah ada"
            >
              <Text style={styles.switchAuthLink}> Masuk di Sini</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerNote}>
          Kedai Tong Djajakarta • P2MW F&B Kampus 3 UMM
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandLogo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  brandCampus: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  successBannerText: {
    fontSize: 13,
    color: colors.statusSuccess,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 18,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 20,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  requiredStar: {
    color: colors.primaryLight,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputWrapperError: {
    borderColor: colors.primaryLight,
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 8,
  },
  eyeButton: {
    padding: 6,
  },
  fieldErrorText: {
    fontSize: 12,
    color: colors.primaryLight,
    marginTop: 4,
    fontWeight: '500',
  },
  securityNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    marginBottom: 14,
  },
  securityNoteText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  switchAuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  switchAuthPrompt: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  switchAuthLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
  },
});
