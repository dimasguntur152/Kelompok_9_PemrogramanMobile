import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const OrderFinishedScreen = () => {
  const { activeOrder, navigateTo } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Simple elegant checkmark visual */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-done" size={44} color={colors.surface} />
        </View>

        <Text style={styles.titleText}>Pesanan Selesai!</Text>

        <Text style={styles.descText}>
          Pesananmu sudah selesai. Terima kasih sudah menjadi bagian dari Tong Family!
        </Text>

        {/* Order Identifier & Status & Ringkasan Singkat */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nomor Pesanan</Text>
            <Text style={styles.orderNum}>
              {activeOrder?.orderNumber || '#TDJ-001'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.finishedBadge}>
              <Text style={styles.finishedBadgeText}>Selesai</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Ringkasan Singkat Pesanan */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Ringkasan Pesanan:</Text>
            {activeOrder?.items?.map((item, idx) => (
              <Text key={idx} style={styles.summaryItemText}>
                • {item.name} ({item.quantity}x)
              </Text>
            ))}
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>Total:</Text>
              <Text style={styles.summaryTotalValue}>
                {formatRupiah(activeOrder?.total || 13000)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Button: Kembali ke Beranda (NO RATING, NO REVIEW) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigateTo('beranda')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Beranda"
        >
          <Ionicons
            name="home-outline"
            size={18}
            color={colors.surface}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.homeBtnText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },
  infoCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  orderNum: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  finishedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  finishedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  summarySection: {
    paddingTop: 6,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  summaryItemText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 4,
    paddingLeft: 4,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  summaryTotalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryTotalValue: {
    fontSize: 14,
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
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  homeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },
});
