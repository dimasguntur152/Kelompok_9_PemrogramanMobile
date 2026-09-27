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
        return { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' };
      case 'Menunggu':
        return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
      case 'Diproses':
        return { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' };
      case 'Sedang Diantar':
      case 'Siap Diambil':
        return { bg: '#FFEDD5', text: '#C2410C', border: '#FED7AA' };
      default:
        return { bg: '#F5F5F4', text: '#57534E', border: '#E7E5E4' };
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <Ionicons name="receipt-outline" size={44} color={colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Belum ada aktivitas pesanan.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Aktivitas</Text>
      <Text style={styles.pageSubtitle}>
        Riwayat pesanan Kedai Tong Djajakarta
      </Text>

      {orders.map((ord) => {
        const badge = getStatusBadge(ord.status);
        return (
          <TouchableOpacity
            key={ord.id}
            style={styles.orderCard}
            onPress={() => handleOrderPress(ord.id)}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={`Pesanan ${ord.orderNumber}`}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderNumber}>{ord.orderNumber}</Text>
                <Text style={styles.orderDate}>{ord.date || 'Hari ini'}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: badge.bg, borderColor: badge.border },
                ]}
              >
                <Text style={[styles.statusText, { color: badge.text }]}>
                  {ord.status}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              {ord.items?.map((item, idx) => (
                <Text key={idx} style={styles.itemSummaryText}>
                  {item.name} × {item.quantity}
                </Text>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.methodTag}>
                <Ionicons
                  name={ord.method === 'Diantar' ? 'bicycle' : 'storefront'}
                  size={12}
                  color={colors.primary}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.methodTagText}>{ord.method}</Text>
              </View>

              <View style={styles.priceCol}>
                <Text style={styles.priceTotal}>
                  {formatRupiah(ord.total)}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textMuted}
                  style={{ marginLeft: 4 }}
                />
              </View>
            </View>
          </TouchableOpacity>
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
    paddingBottom: 24,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 12,
    elevation: 1,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginVertical: 6,
  },
  itemSummaryText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginVertical: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  methodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  methodTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  priceCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
