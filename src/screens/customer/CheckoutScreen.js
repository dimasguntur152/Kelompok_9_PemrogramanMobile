import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { formatRupiah, KEDAI_INFO } from '../../data/mockData';

export const CheckoutScreen = () => {
  const {
    cartItems,
    cartTotalCount,
    cartSubtotal,
    deliveryMethod,
    setDeliveryMethod,
    deliveryLocation,
    setDeliveryLocation,
    deliveryNotes,
    setDeliveryNotes,
    currentDeliveryFee,
    cartGrandTotal,
    navigateTo,
  } = useApp();

  const [validationError, setValidationError] = useState('');

  const handleSelectMethod = (method) => {
    setDeliveryMethod(method);
    setValidationError('');
  };

  const handleContinueToPayment = () => {
    // Validation 1: Cart empty
    if (cartItems.length === 0) {
      setValidationError('Tambahkan menu terlebih dahulu.');
      return;
    }

    // Validation 2: Method not selected
    if (!deliveryMethod) {
      setValidationError('Pilih cara menerima pesanan.');
      return;
    }

    // Validation 3: Delivery selected but location is empty
    if (deliveryMethod === 'diantar' && !deliveryLocation.trim()) {
      setValidationError('Masukkan lokasi pengantaran terlebih dahulu.');
      return;
    }

    setValidationError('');
    navigateTo('payment');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Receiving Method Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.questionTitle}>
            Bagaimana kamu ingin menerima pesanan?
          </Text>

          {/* Option 1: DIANTAR */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              deliveryMethod === 'diantar' && styles.optionCardSelected,
            ]}
            onPress={() => handleSelectMethod('diantar')}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ selected: deliveryMethod === 'diantar' }}
            accessibilityLabel="Pilihan Diantar ke lokasi"
          >
            <View style={styles.radioRow}>
              <View style={styles.radioOuter}>
                {deliveryMethod === 'diantar' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <View style={styles.optionContent}>
                <View style={styles.methodHeaderRow}>
                  <Text style={styles.methodTitle}>DIANTAR</Text>
                  <View style={styles.feeTag}>
                    <Text style={styles.feeTagText}>
                      +{formatRupiah(KEDAI_INFO.defaultDeliveryFee)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.methodDesc}>
                  Pesanan akan diantarkan ke lokasi kamu.
                </Text>
                <View style={styles.campusBadge}>
                  <Ionicons
                    name="shield-checkmark"
                    size={12}
                    color={colors.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.campusBadgeText}>
                    Hanya tersedia di area Kampus 3 UMM.
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Option 2: AMBIL DI KEDAI */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              deliveryMethod === 'pickup' && styles.optionCardSelected,
            ]}
            onPress={() => handleSelectMethod('pickup')}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ selected: deliveryMethod === 'pickup' }}
            accessibilityLabel="Pilihan Ambil Langsung di Kedai"
          >
            <View style={styles.radioRow}>
              <View style={styles.radioOuter}>
                {deliveryMethod === 'pickup' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <View style={styles.optionContent}>
                <View style={styles.methodHeaderRow}>
                  <Text style={styles.methodTitle}>AMBIL DI KEDAI</Text>
                  <View style={[styles.feeTag, styles.feeTagFree]}>
                    <Text style={[styles.feeTagText, styles.feeTagFreeText]}>
                      Gratis
                    </Text>
                  </View>
                </View>
                <Text style={styles.methodDesc}>
                  Ambil langsung di Kedai Tong Djajakarta.
                </Text>
                <Text style={styles.pickupLocationText}>
                  Lokasi: GKB 2 Basement, Kampus 3 UMM
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Step 2: Form DIANTAR (Only shown if DIANTAR selected) */}
        {deliveryMethod === 'diantar' && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>Lokasi Pengantaran</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                Lokasi Pengantaran <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: GKB 2 lantai 5, depan ruang 502"
                placeholderTextColor={colors.textMuted}
                value={deliveryLocation}
                onChangeText={(text) => {
                  setDeliveryLocation(text);
                  if (validationError) setValidationError('');
                }}
                accessibilityLabel="Input Lokasi Pengantaran"
              />
              <Text style={styles.inputHelperText}>
                Pengantaran hanya tersedia di area Kampus 3 UMM.
              </Text>
              <View style={styles.exampleBox}>
                <Text style={styles.exampleTitle}>Contoh format:</Text>
                <Text style={styles.exampleCode}>
                  GKB 2 lantai 5, depan ruang 502
                </Text>
              </View>
            </View>

            <View style={[styles.formGroup, { marginTop: 14 }]}>
              <Text style={styles.inputLabel}>
                Catatan untuk pengantaran{' '}
                <Text style={styles.optionalText}>(Opsional)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Tunggu di depan kelas."
                placeholderTextColor={colors.textMuted}
                value={deliveryNotes}
                onChangeText={setDeliveryNotes}
                accessibilityLabel="Input Catatan Pengantaran"
              />
            </View>
          </View>
        )}

        {/* Step 2: Display PICKUP Info (Only shown if AMBIL DI KEDAI selected) */}
        {deliveryMethod === 'pickup' && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>Lokasi Kedai</Text>
            </View>

            <View style={styles.pickupInfoCard}>
              <View style={styles.pickupIconBox}>
                <Ionicons name="storefront" size={24} color={colors.primary} />
              </View>
              <View style={styles.pickupDetails}>
                <Text style={styles.pickupKedaiName}>
                  Kedai Tong Djajakarta
                </Text>
                <Text style={styles.pickupBuilding}>GKB 2 Basement</Text>
                <Text style={styles.pickupCampus}>Kampus 3 UMM</Text>
              </View>
            </View>
            <Text style={styles.pickupNotice}>
              Pesanan akan disiapkan oleh tim dapur. Kamu cukup datang ke kasir
              basement saat status pesanan siap diambil.
            </Text>
          </View>
        )}

        {/* Order Brief Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>
              Subtotal ({cartTotalCount} item)
            </Text>
            <Text style={styles.summaryVal}>{formatRupiah(cartSubtotal)}</Text>
          </View>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Biaya Pengantaran</Text>
            <Text style={styles.summaryVal}>
              {deliveryMethod
                ? formatRupiah(currentDeliveryFee)
                : 'Pilih metode'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalVal}>
              {formatRupiah(deliveryMethod ? cartGrandTotal : cartSubtotal)}
            </Text>
          </View>
        </View>

        {/* Inline Validation Alert Message */}
        {validationError !== '' && (
          <View style={styles.validationBox}>
            <Ionicons
              name="alert-circle"
              size={18}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.validationText}>{validationError}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomPrice}>
            {formatRupiah(deliveryMethod ? cartGrandTotal : cartSubtotal)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinueToPayment}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Lanjut ke Pembayaran QRIS"
        >
          <Text style={styles.continueBtnText}>Lanjut ke Pembayaran</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    marginBottom: 14,
    elevation: 1,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  optionCard: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: colors.surface,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FEF9F9',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  methodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  feeTag: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  feeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  feeTagFree: {
    backgroundColor: '#DCFCE7',
  },
  feeTagFreeText: {
    color: '#15803D',
  },
  methodDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  campusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  campusBadgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  pickupLocationText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  formGroup: {
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  requiredStar: {
    color: colors.primary,
  },
  optionalText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textMuted,
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inputHelperText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  exampleBox: {
    backgroundColor: '#FAF5EE',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  exampleTitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  exampleCode: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
    marginTop: 2,
  },
  pickupInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  pickupIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pickupDetails: {
    flex: 1,
  },
  pickupKedaiName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pickupBuilding: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 1,
  },
  pickupCampus: {
    fontSize: 12,
    color: colors.textMuted,
  },
  pickupNotice: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 8,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  validationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  validationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomPriceCol: {
    flex: 1,
  },
  bottomLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  bottomPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
    marginRight: 6,
  },
});
