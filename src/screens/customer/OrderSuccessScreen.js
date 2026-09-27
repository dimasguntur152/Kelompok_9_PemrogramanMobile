import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { formatRupiah } from '../../data/mockData';

export const OrderSuccessScreen = () => {
  const { activeOrder, navigateTo } = useApp();

  if (!activeOrder) {
    return null;
  }

  const isDelivery = activeOrder.method === 'Diantar';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon Badge */}
        <View style={styles.successIconWrapper}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="checkmark" size={38} color={colors.surface} />
            </View>
          </View>
        </View>

        <Text style={styles.titleText}>Pesanan Berhasil Dibuat!</Text>
        <Text style={styles.thankYouText}>
          Terima kasih! Pesananmu sudah berhasil dibuat dan sedang menunggu
          diproses oleh Tong Djajakarta.
        </Text>

        {/* Order Brief Info Card */}
        <View style={styles.orderCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nomor Pesanan:</Text>
            <Text style={styles.orderNumber}>{activeOrder.orderNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Status:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{activeOrder.status}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Metode:</Text>
            <Text style={styles.valueHighlight}>{activeOrder.method}</Text>
          </View>

          {isDelivery && (
            <View style={styles.locationBlock}>
              <Text style={styles.label}>Lokasi Pengantaran:</Text>
              <Text style={styles.locationValue}>{activeOrder.location}</Text>
              {activeOrder.deliveryNotes ? (
                <Text style={styles.notesText}>
                  Catatan: {activeOrder.deliveryNotes}
                </Text>
              ) : null}
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.totalLabel}>Total Pembayaran:</Text>
            <Text style={styles.totalValue}>
              {formatRupiah(activeOrder.total)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA to View Order Details */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => navigateTo('order_detail')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Lihat Detail Pesanan"
        >
          <Text style={styles.detailBtnText}>Lihat Detail Pesanan</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.surface} />
        </TouchableOpacity>
      </View>
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
    padding: 20,
    alignItems: 'center',
    paddingBottom: 32,
  },
  successIconWrapper: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  thankYouText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  orderCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 1,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  valueHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  locationBlock: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 4,
  },
  notesText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  detailBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
    marginRight: 6,
  },
});
