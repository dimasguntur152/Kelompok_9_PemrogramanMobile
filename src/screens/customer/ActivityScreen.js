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

export const ActivityScreen = () => {
  const { orders, navigateTo, setActiveOrderId } = useApp();

  const handleOrderPress = (orderId) => {
    setActiveOrderId(orderId);
    navigateTo('order_detail', { orderId });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return {
          bg: '#DCFCE7',
          text: '#15803D',
          border: '#BBF7D0',
          icon: 'checkmark-circle',
        };
      case 'Menunggu':
        return {
          bg: '#FEF3C7',
          text: '#B45309',
          border: '#FDE68A',
          icon: 'time',
        };
      case 'Diproses':
        return {
          bg: '#DBEAFE',
          text: '#1D4ED8',
          border: '#BFDBFE',
          icon: 'flame',
        };
      case 'Sedang Diantar':
        return {
          bg: '#FFEDD5',
          text: '#C2410C',
          border: '#FED7AA',
          icon: 'bicycle',
        };
      case 'Siap Diambil':
        return {
          bg: '#FFEDD5',
          text: '#C2410C',
          border: '#FED7AA',
          icon: 'storefront',
        };
      default:
        return {
          bg: '#F5F5F4',
          text: '#57534E',
          border: '#E7E5E4',
          icon: 'information-circle',
        };
    }
  };

  // 1. Empty State
  if (!orders || orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <Ionicons name="receipt-outline" size={48} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>Belum ada pesanan</Text>
        <Text style={styles.emptySubtitle}>
          Yuk, nikmati sajian kopi dan makanan favoritmu dari Kedai Tong Djajakarta sekarang juga!
        </Text>
        <TouchableOpacity
          style={styles.startOrderBtn}
          onPress={() => navigateTo('menu')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Mulai Pesan Menu"
        >
          <Text style={styles.startOrderBtnText}>Mulai Pesan</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.surface}
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // 2. Orders History List
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerInfoBlock}>
        <Text style={styles.pageTitle}>Riwayat Pesanan</Text>
        <Text style={styles.pageSubtitle}>
          Pantau status pesanan aktif & riwayat pesanan sebelumnya
        </Text>
      </View>

      {orders.map((ord) => {
        const badge = getStatusBadge(ord.status);
        return (
          <View key={ord.id} style={styles.orderCard}>
            {/* Header: Order Number, Date, Status */}
            <View style={styles.cardHeader}>
              <View style={styles.orderIdentCol}>
                <Text style={styles.orderNumber}>{ord.orderNumber}</Text>
                <Text style={styles.orderDate}>{ord.date || 'Hari ini'}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: badge.bg, borderColor: badge.border },
                ]}
              >
                <Ionicons
                  name={badge.icon}
                  size={12}
                  color={badge.text}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.statusText, { color: badge.text }]}>
                  {ord.status}
                </Text>
              </View>
            </View>

            {/* Menu Items Summary */}
            <View style={styles.cardBody}>
              {ord.items && ord.items.length > 0 ? (
                ord.items.map((item, idx) => (
                  <View key={idx} style={styles.itemSummaryRow}>
                    <Text style={styles.itemSummaryText} numberOfLines={1}>
                      • {item.name}
                    </Text>
                    <Text style={styles.itemSummaryQty}>
                      {item.quantity}x
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.itemSummaryText}>• 1x Menu Pilihan</Text>
              )}
            </View>

            {/* Total and Method Tag */}
            <View style={styles.cardMidRow}>
              <View style={styles.methodTag}>
                <Ionicons
                  name={ord.method === 'Diantar' ? 'bicycle' : 'storefront'}
                  size={12}
                  color={colors.primary}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.methodTagText}>{ord.method}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total: </Text>
                <Text style={styles.priceTotal}>
                  {formatRupiah(ord.total || 0)}
                </Text>
              </View>
            </View>

            {/* Action: Tombol Lihat Detail */}
            <View style={styles.cardFooter}>
              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => handleOrderPress(ord.id)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Lihat detail pesanan ${ord.orderNumber}`}
              >
                <Text style={styles.detailBtnText}>Lihat Detail</Text>
                <Ionicons
                  name="chevron-forward"
                  size={15}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 28,
  },
  headerInfoBlock: {
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderIdentCol: {
    flex: 1,
    paddingRight: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginVertical: 4,
  },
  itemSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  itemSummaryText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
    paddingRight: 8,
  },
  itemSummaryQty: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  cardMidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  methodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  methodTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  priceTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  cardFooter: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    paddingVertical: 9,
    borderRadius: 10,
  },
  detailBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.background,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  startOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  startOrderBtnText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
