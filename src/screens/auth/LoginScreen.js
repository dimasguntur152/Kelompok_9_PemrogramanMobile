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
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick fill helper for demo presentation
  const handleQuickFill = () => {
    setIdentifier('civitas@umm.ac.id');
    setPassword('KedaiTong123');
    setErrors({});
    setAuthError('');
    if (sessionClearedMessage) dismissSessionClearedMessage();
  };

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

    // 2. Authenticate
    setIsLoading(true);
    const result = await login(identifier, password);
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
          <Text style={styles.brandCampus}>
            Kampus 3 UMM • GKB 2 Basement
          </Text>
          <View style={styles.badgeWrapper}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Portal Autentikasi Pengguna</Text>
          </View>
        </View>

        {/* SESSION CLEARED Banner (Demo Requirement) */}
        {sessionClearedMessage ? (
          <View
            style={styles.sessionClearedCard}
            accessibilityRole="alert"
            accessibilityLabel="Sesi telah dibersihkan"
          >
            <View style={styles.sessionClearedHeader}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={colors.statusSuccess}
              />
              <Text style={styles.sessionClearedTitle}>SESSION CLEARED</Text>
            </View>
            <Text style={styles.sessionClearedText}>
              {sessionClearedMessage}
            </Text>
          </View>
        ) : null}

        {/* Authentication Error Banner */}
        {authError ? (
          <View
            style={styles.errorBanner}
            accessibilityRole="alert"
            accessibilityLabel={authError}
          >
            <Ionicons
              name="alert-circle"
              size={20}
              color={colors.primaryLight}
            />
            <Text style={styles.errorBannerText}>{authError}</Text>
          </View>
        ) : null}

        {/* Login Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Masuk Akun</Text>
          <Text style={styles.formSubtitle}>
            Silakan masuk untuk melanjutkan pemesanan & aktivitas
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
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={errors.identifier ? colors.primaryLight : colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="contoh: civitas@umm.ac.id"
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
              />
            </View>
            {errors.identifier ? (
              <Text style={styles.fieldErrorText}>{errors.identifier}</Text>
            ) : null}
          </View>

          {/* Password Input */}
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
                placeholder="Masukkan password akun"
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
                accessibilityLabel="Input Password"
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

        {/* Demo Fast Testing Card */}
        <View style={styles.demoCard}>
          <View style={styles.demoHeader}>
            <Ionicons name="key-outline" size={16} color={colors.accentDark} />
            <Text style={styles.demoTitle}>Akun Uji Coba Demo</Text>
          </View>
          <Text style={styles.demoDesc}>
            Email: <Text style={styles.demoVal}>civitas@umm.ac.id</Text>
            {'\n'}Password: <Text style={styles.demoVal}>KedaiTong123</Text>
          </Text>
          <TouchableOpacity
            style={styles.quickFillButton}
            onPress={handleQuickFill}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Gunakan akun demo cepat"
          >
            <Ionicons
              name="flash-outline"
              size={14}
              color={colors.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.quickFillButtonText}>Isi Akun Demo Cepat</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          Kedai Tong Djajakarta • Pertemuan 3 Security & Authentication
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
    paddingTop: 36,
    paddingBottom: 40,
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
    color: colors.primary,
    letterSpacing: -0.3,
  },
  brandCampus: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginTop: 10,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  sessionClearedCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  sessionClearedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionClearedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.statusSuccess,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  sessionClearedText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
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
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 7,
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
    marginTop: 5,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    marginTop: 8,
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
  demoCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentDark,
    marginLeft: 6,
  },
  demoDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  demoVal: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  quickFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 7,
    borderRadius: 8,
  },
  quickFillButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
  },
});
