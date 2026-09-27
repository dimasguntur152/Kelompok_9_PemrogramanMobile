import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { formatRupiah } from '../../data/mockData';

export const PaymentScreen = () => {
  const {
    cartItems,
    cartGrandTotal,
    deliveryMethod,
    currentDeliveryFee,
    cartSubtotal,
    createOrder,
    navigateTo,
  } = useApp();

  // State for Payment Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmPayment = () => {
    setShowConfirmModal(false);
    // Create the order into the active state & list
    const newOrder = createOrder();
    // Navigate strictly to order_success
    navigateTo('order_success', { orderId: newOrder.id });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Payment Highlight Banner */}
        <View style={styles.totalBanner}>
          <Text style={styles.totalBannerLabel}>Total Pembayaran</Text>
          <Text style={styles.totalBannerAmount}>
            {formatRupiah(cartGrandTotal)}
          </Text>
          <View style={styles.qrisOnlyBadge}>
            <Text style={styles.qrisOnlyText}>Metode: QRIS</Text>
          </View>
        </View>

        {/* QRIS Code Box */}
        <View style={styles.qrisCard}>
          <View style={styles.qrisHeader}>
            <View style={styles.qrisBrandRow}>
              <Text style={styles.qrisTitle}>QRIS</Text>
              <Text style={styles.qrisNational}>STANDAR PEMBAYARAN NASIONAL</Text>
            </View>
            <Text style={styles.merchantName}>KEDAI TONG DJAJARTA</Text>
            <Text style={styles.merchantLocation}>
              GKB 2 Basement • Kampus 3 UMM
            </Text>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrFrameWrapper}>
            <View style={styles.qrGridBox}>
              {/* Pattern simulation for sharp realistic QR Code */}
              <View style={styles.qrCornerTL}>
                <View style={styles.qrInnerBlock} />
              </View>
              <View style={styles.qrCornerTR}>
                <View style={styles.qrInnerBlock} />
              </View>
              <View style={styles.qrCornerBL}>
                <View style={styles.qrInnerBlock} />
              </View>

              {/* Decorative data pixels */}
              <View style={styles.qrCenterLogoWrapper}>
                <Image
                  source={require('../../../assets/logo.png')}
                  style={styles.qrCenterLogo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.qrBarcodeGrid}>
                {/* Visual barcode matrix */}
                <View style={styles.qrMatrixRow}>
                  <View style={[styles.mDot, styles.mDotDark]} />
                  <View style={styles.mDot} />
                  <View style={[styles.mDot, styles.mDotDark]} />
                  <View style={[styles.mDot, styles.mDotDark]} />
                  <View style={styles.mDot} />
                  <View style={[styles.mDot, styles.mDotDark]} />
                </View>
                <View style={styles.qrMatrixRow}>
                  <View style={styles.mDot} />
                  <View style={[styles.mDot, styles.mDotDark]} />
                  <View style={styles.mDot} />
                  <View style={styles.mDot} />
                  <View style={[styles.mDot, styles.mDotDark]} />
                  <View style={styles.mDot} />
                </View>
                <View style={styles.qrMatrixRow}>
                  <View style={[styles.mDot, styles.mDotDark]} />
                  <View style={styles.mDot} />
                  <View style={[styles.mDot, styles.mDotDark]} />
                  <View style={styles.mDot} />
                  <View style={[styles.mDot, styles.mDotDark]} />
                  <View style={[styles.mDot, styles.mDotDark]} />
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.qrFooterText}>
            Dapat dipindai menggunakan BCA Mobile, Mandiri Livin, GoPay, OVO, Dana, ShopeePay, LinkAja & mobile banking lainnya.
          </Text>
        </View>

        {/* Ringkasan Pesanan */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Pesanan</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.summaryItemRow}>
              <Text style={styles.summaryItemName} numberOfLines={1}>
                {item.name} × {item.quantity}
              </Text>
              <Text style={styles.summaryItemPrice}>
                {formatRupiah(item.subtotal)}
              </Text>
            </View>
          ))}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItemRow}>
            <Text style={styles.summarySubLabel}>Subtotal</Text>
            <Text style={styles.summarySubVal}>
              {formatRupiah(cartSubtotal)}
            </Text>
          </View>

          <View style={styles.summaryItemRow}>
            <Text style={styles.summarySubLabel}>
              Biaya Pengantaran ({deliveryMethod === 'diantar' ? 'Diantar' : 'Ambil di Kedai'})
            </Text>
            <Text style={styles.summarySubVal}>
              {formatRupiah(currentDeliveryFee)}
            </Text>
          </View>

          <View style={styles.summaryItemRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalVal}>
              {formatRupiah(cartGrandTotal)}
            </Text>
          </View>
        </View>

        {/* Instruksi Pembayaran */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instruksi Pembayaran</Text>
          <View style={styles.stepItem}>
            <View style={styles.stepNumBox}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Buka aplikasi e-wallet atau mobile banking di ponsel Anda.
            </Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumBox}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Pindai / scan kode QRIS di atas.
            </Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumBox}>
              <Text style={styles.stepNum}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Pastikan nama merchant "KEDAI TONG DJAJARTA" dan nominal sesuai ({formatRupiah(cartGrandTotal)}).
            </Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumBox}>
              <Text style={styles.stepNum}>4</Text>
            </View>
            <Text style={styles.stepText}>
              Selesaikan transaksi dan tekan tombol "Saya Sudah Membayar".
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Button: Saya Sudah Membayar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.paidBtn}
          onPress={() => setShowConfirmModal(true)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Saya Sudah Membayar"
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={colors.surface}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.paidBtnText}>Saya Sudah Membayar</Text>
        </TouchableOpacity>
      </View>

      {/* 26. Modal Konfirmasi Pembayaran */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconBox}>
                <Ionicons name="qr-code" size={24} color={colors.primary} />
              </View>
              <Text style={styles.modalTitle}>Konfirmasi Pembayaran</Text>
            </View>

            <Text style={styles.modalBodyText}>
              Pastikan kamu sudah menyelesaikan pembayaran melalui QRIS.
            </Text>

            {/* QRIS, Ringkasan Pesanan & Total */}
            <View style={styles.modalDetailsBox}>
              <View style={styles.modalQrisRow}>
                <View style={styles.modalQrisBadge}>
                  <Text style={styles.modalQrisBadgeText}>QRIS</Text>
                </View>
                <Text style={styles.modalRowVal}>KEDAI TONG DJAJAKARTA</Text>
              </View>

              <View style={styles.modalDivider} />

              <Text style={styles.modalSummaryTitle}>Ringkasan Pesanan:</Text>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.modalItemRow}>
                  <Text style={styles.modalItemName} numberOfLines={1}>
                    {item.name} × {item.quantity}
                  </Text>
                  <Text style={styles.modalItemPrice}>
                    {formatRupiah(item.subtotal)}
                  </Text>
                </View>
              ))}

              <View style={styles.modalDivider} />

              <View style={styles.modalRow}>
                <Text style={styles.modalRowLabel}>Metode Penerimaan:</Text>
                <Text style={styles.modalRowVal}>
                  {deliveryMethod === 'diantar' ? 'Diantar' : 'Ambil di Kedai'}
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Text style={styles.modalTotalLabel}>Total Pembayaran:</Text>
                <Text style={styles.modalTotalVal}>
                  {formatRupiah(cartGrandTotal)}
                </Text>
              </View>
            </View>

            {/* Modal Action Buttons */}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowConfirmModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmPayment}
                activeOpacity={0.85}
              >
                <Text style={styles.modalConfirmText}>
                  Konfirmasi Pembayaran
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  totalBanner: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  totalBannerLabel: {
    fontSize: 13,
    color: '#FED7D7',
    fontWeight: '500',
    marginBottom: 4,
  },
  totalBannerAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: -0.5,
  },
  qrisOnlyBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  qrisOnlyText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.surface,
  },
  qrisCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 1,
  },
  qrisHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qrisBrandRow: {
    alignItems: 'center',
    marginBottom: 4,
  },
  qrisTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#D92D20',
    letterSpacing: 2,
  },
  qrisNational: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 6,
  },
  merchantLocation: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  qrFrameWrapper: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1C1917',
    marginBottom: 14,
  },
  qrGridBox: {
    width: 180,
    height: 180,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  qrCornerTL: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 44,
    height: 44,
    borderWidth: 4,
    borderColor: '#1C1917',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCornerTR: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 44,
    height: 44,
    borderWidth: 4,
    borderColor: '#1C1917',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCornerBL: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 44,
    height: 44,
    borderWidth: 4,
    borderColor: '#1C1917',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrInnerBlock: {
    width: 22,
    height: 22,
    backgroundColor: '#1C1917',
  },
  qrCenterLogoWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    zIndex: 10,
  },
  qrCenterLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  qrBarcodeGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    padding: 24,
    opacity: 0.35,
  },
  qrMatrixRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  mDotDark: {
    backgroundColor: '#1C1917',
  },
  qrFooterText: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryItemName: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
    paddingRight: 10,
  },
  summaryItemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 8,
  },
  summarySubLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summarySubVal: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryTotalVal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  instructionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  paidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
  },
  paidBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalBodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  modalDetailsBox: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  modalQrisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalQrisBadge: {
    backgroundColor: '#D92D20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  modalQrisBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 8,
  },
  modalSummaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalItemName: {
    fontSize: 12,
    color: colors.textPrimary,
    flex: 1,
    paddingRight: 6,
  },
  modalItemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalRowLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  modalRowVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalTotalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalTotalVal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalConfirmBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },
});
