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

export const OrderDetailScreen = () => {
  const { activeOrder, navigateTo } = useApp();

  if (!activeOrder) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Pesanan tidak ditemukan.</Text>
      </View>
    );
  }

  const isDelivery = activeOrder.method === 'Diantar';

  // Badge styles depending on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Menunggu':
        return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
      case 'Diproses':
        return { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' };
      case 'Sedang Diantar':
      case 'Siap Diambil':
        return { bg: '#FFEDD5', text: '#C2410C', border: '#FED7AA' };
      case 'Selesai':
        return { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' };
      default:
        return { bg: '#F5F5F4', text: '#57534E', border: '#E7E5E4' };
    }
  };

  const badge = getStatusBadge(activeOrder.status);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Header Card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.orderLabel}>Nomor Pesanan</Text>
              <Text style={styles.orderNumber}>{activeOrder.orderNumber}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: badge.bg, borderColor: badge.border },
              ]}
            >
              <Text style={[styles.statusText, { color: badge.text }]}>
                {activeOrder.status}
              </Text>
            </View>
          </View>
          {activeOrder.date && (
            <Text style={styles.dateText}>{activeOrder.date}</Text>
          )}
        </View>

        {/* Metode Penerimaan */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Metode Penerimaan</Text>
          <View style={styles.methodInfoRow}>
            <View style={styles.methodIconBox}>
              <Ionicons
                name={isDelivery ? 'bicycle' : 'storefront'}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.methodTextCol}>
              <Text style={styles.methodTitle}>{activeOrder.method}</Text>
              {isDelivery ? (
                <>
                  <Text style={styles.locationDetail}>
                    {activeOrder.location}
                  </Text>
                  {activeOrder.deliveryNotes ? (
                    <Text style={styles.notesDetail}>
                      Catatan: {activeOrder.deliveryNotes}
                    </Text>
                  ) : null}
                </>
              ) : (
                <Text style={styles.locationDetail}>
                  GKB 2 Basement, Kampus 3 UMM
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Daftar Pesanan */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Daftar Pesanan</Text>
          {activeOrder.items?.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.productRow,
                idx === activeOrder.items.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.productInfoCol}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQty}>
                  {item.quantity} × {formatRupiah(item.price)}
                </Text>
              </View>
              <Text style={styles.productSubtotal}>
                {formatRupiah(item.subtotal || item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Pricing breakdown */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceVal}>
              {formatRupiah(activeOrder.subtotal || 0)}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Biaya Pengantaran</Text>
            <Text style={styles.priceVal}>
              {formatRupiah(activeOrder.deliveryFee || 0)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>{formatRupiah(activeOrder.total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Strictly ONLY Button: Lacak Pesanan (NO CHAT BUTTON HERE!) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => navigateTo('order_track')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Lacak Pesanan"
        >
          <Ionicons
            name="navigate-circle-outline"
            size={20}
            color={colors.surface}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.trackBtnText}>Lacak Pesanan</Text>
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
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
    elevation: 1,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  orderNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  methodInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  methodIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodTextCol: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationDetail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  notesDetail: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  productInfoCol: {
    flex: 1,
    paddingRight: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  productQty: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  productSubtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  priceVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalRow: {
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
    fontWeight: '800',
    color: colors.primary,
  },
  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
  },
  trackBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
  },
});
