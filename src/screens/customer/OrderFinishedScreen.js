import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { formatRupiah } from '../../data/mockData';

export const OrderFinishedScreen = () => {
  const { activeOrder, navigateTo } = useApp();

  // Safe fallback to prevent blank/white screen under any condition
  const order = activeOrder || {
    orderNumber: '#TDJ-001',
    status: 'Selesai',
    method: 'Diantar',
    location: 'Kampus 3 UMM',
    total: 13000,
    items: [{ name: 'Kopi Susu Mantap', quantity: 1, price: 13000 }],
  };

  const handleBackToHome = () => {
    navigateTo('beranda');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon Animation Circle */}
        <View style={styles.successOuterCircle}>
          <View style={styles.successMiddleCircle}>
            <View style={styles.successInnerCircle}>
              <Ionicons
                name="checkmark-done"
                size={42}
                color={colors.surface}
              />
            </View>
          </View>
        </View>

        <Text style={styles.titleText}>Pesanan Selesai!</Text>

        <Text style={styles.descText}>
          Pesananmu sudah berhasil diselesaikan. Terima kasih sudah menjadi
          bagian dari Tong Family! Sampai jumpa di pesanan berikutnya.
        </Text>

        {/* Order Identifier & Details Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nomor Pesanan</Text>
            <Text style={styles.orderNum}>
              {order.orderNumber || '#TDJ-001'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status Akhir</Text>
            <View style={styles.finishedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#15803D"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.finishedBadgeText}>Selesai</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Metode Penerimaan</Text>
            <View style={styles.methodTag}>
              <Ionicons
                name={order.method === 'Diantar' ? 'bicycle' : 'storefront'}
                size={13}
                color={colors.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.methodTagText}>
                {order.method || 'Diantar'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Ringkasan Singkat Pesanan */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Ringkasan Menu:</Text>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.summaryItemText} numberOfLines={1}>
                    • {item.name}
                  </Text>
                  <Text style={styles.summaryItemQty}>
                    {item.quantity}x
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.summaryItemText}>• 1x Menu Pilihan</Text>
            )}

            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>Total Transaksi</Text>
              <Text style={styles.summaryTotalValue}>
                {formatRupiah(order.total || 13000)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tong Family Friendly Note */}
        <View style={styles.tongNoteBox}>
          <Ionicons
            name="heart"
            size={16}
            color={colors.primary}
            style={{ marginRight: 8, marginTop: 1 }}
          />
          <Text style={styles.tongNoteText}>
            Dibuat segar dengan sepenuh hati oleh barista Kedai Tong Djajakarta, GKB 2 Basement Kampus 3 UMM.
          </Text>
        </View>
      </ScrollView>

      {/* Primary Action: Kembali ke Beranda */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={handleBackToHome}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Beranda"
        >
          <Ionicons
            name="home"
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
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
  },
  successOuterCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(21, 128, 61, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successMiddleCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(21, 128, 61, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  descText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  infoCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  orderNum: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  finishedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
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
  methodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  methodTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  summarySection: {
    paddingTop: 2,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryItemText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    paddingRight: 8,
  },
  summaryItemQty: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  tongNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    width: '100%',
  },
  tongNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  homeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
    letterSpacing: 0.3,
  },
});
