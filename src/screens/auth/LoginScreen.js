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
import CryptoJS from 'crypto-js';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { validateLogin } from '../../utils/validation';

export const LoginScreen = () => {
  const {
    login,
    navigateTo,
    sessionClearedMessage,
    dismissSessionClearedMessage,
  } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick fill helper for demo presentation

  const handleLogin = async () => {
    setAuthError('');
    if (sessionClearedMessage) dismissSessionClearedMessage();

    // 1. Validation
    const validation = validateLogin({ identifier, password });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});

    // 2. Hash password sebelum dikirim ke API (mencegah plaintext terlihat di tab Network)
    const hashedPassword = CryptoJS.SHA256(password).toString();

    // 3. Authenticate
    setIsLoading(true);
    const result = await login(identifier, hashedPassword);
    setIsLoading(false);

    if (!result.success) {
      setAuthError(result.error || 'Email atau password salah.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.background}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
            accessibilityLabel="Logo Kedai Tong Djajakarta"
          />
          <Text style={styles.brandTitle}>Kedai Tong Djajakarta</Text>
          <Text style={styles.brandSubtitle}>
            Kopi & kuliner pilihan di Kampus 3 UMM
          </Text>
        </View>

        {/* Authentication Error Banner */}
        {authError ? (
          <View
            style={styles.errorBanner}
            accessibilityRole="alert"
            accessibilityLabel={authError}
          >
            <Ionicons
              name="alert-circle"
              size={18}
              color={colors.primaryLight}
            />
            <Text style={styles.errorBannerText}>{authError}</Text>
          </View>
        ) : null}

        {/* Login Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Masuk ke Akun</Text>
          <Text style={styles.formSubtitle}>
            Silakan masukkan akun Anda untuk mulai memesan
          </Text>

          {/* Identifier Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Email atau Nama Pengguna <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                errors.identifier && styles.inputWrapperError,
                focusedField === 'identifier' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={19}
                color={errors.identifier ? colors.primaryLight : colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="contoh: nama@email.com"
                placeholderTextColor={colors.textMuted}
                value={identifier}
                onChangeText={(text) => {
                  setIdentifier(text);
                  if (errors.identifier) {
                    setErrors((prev) => ({ ...prev, identifier: null }));
                  }
                  if (authError) setAuthError('');
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                accessibilityLabel="Input Email atau Nama Pengguna"
                onFocus={() => setFocusedField('identifier')}
                onBlur={() => setFocusedField(null)}
              />
              <Ionicons
                name="at-outline"
                size={18}
                color={colors.textMuted}
                style={styles.inputRightIcon}
              />
            </View>
            {errors.identifier ? (
              <Text style={styles.fieldErrorText}>{errors.identifier}</Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Kata Sandi <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View
              style={[
                styles.inputWrapper,
                errors.password && styles.inputWrapperError,
                focusedField === 'password' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color={errors.password ? colors.primaryLight : colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan kata sandi"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: null }));
                  }
                  if (authError) setAuthError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                accessibilityLabel="Input Kata Sandi"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'
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

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Tombol Masuk"
          >
            {isLoading ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Masuk</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={colors.textInverse}
                  style={{ marginLeft: 8 }}
                />
              </>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.switchAuthRow}>
            <Text style={styles.switchAuthPrompt}>Belum memiliki akun?</Text>
            <TouchableOpacity
              onPress={() => navigateTo('register')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Daftar akun baru"
            >
              <Text style={styles.switchAuthLink}> Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerNote}>Kedai Tong Djajakarta • Kampus 3 UMM</Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 36,
    flexGrow: 1,
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandLogo: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF0E4',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
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
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 7,
  },
  requiredStar: {
    color: colors.accent,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputWrapperError: {
    borderColor: colors.accent,
    backgroundColor: '#FAF0E4',
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
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
  inputRightIcon: {
    marginLeft: 8,
  },
  fieldErrorText: {
    fontSize: 12,
    color: colors.accent,
    marginTop: 5,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.65,
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
