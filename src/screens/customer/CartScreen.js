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

export const CartScreen = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    cartSubtotal,
    deliveryMethod,
    currentDeliveryFee,
    cartGrandTotal,
    navigateTo,
  } = useApp();

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <Ionicons name="cart-outline" size={48} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>Keranjangmu masih kosong.</Text>
        <Text style={styles.emptySubtitle}>
          Tentukan pilihan menu favoritmu untuk mulai memesan.
        </Text>
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={() => navigateTo('menu')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Lihat Menu"
        >
          <Text style={styles.emptyBtnText}>Lihat Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>Daftar Menu yang Dipesan</Text>

        {/* Item Rows */}
        <View style={styles.itemsCard}>
          {cartItems.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index === cartItems.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnitPrice}>
                  {formatRupiah(item.price)}
                </Text>
              </View>

              <View style={styles.itemRight}>
                {/* Quantity Control */}
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => removeFromCart(item.id)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Kurangi ${item.name}`}
                  >
                    <Ionicons name="remove" size={14} color={colors.textPrimary} />
                  </TouchableOpacity>

                  <Text style={styles.qtyText}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={[styles.qtyBtn, styles.qtyBtnPlus]}
                    onPress={() => addToCart(item.id)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Tambah ${item.name}`}
                  >
                    <Ionicons name="add" size={14} color={colors.surface} />
                  </TouchableOpacity>
                </View>

                {/* Subtotal */}
                <Text style={styles.itemSubtotal}>
                  {formatRupiah(item.subtotal)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Cost Summary Breakdown */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Biaya</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {formatRupiah(cartSubtotal)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Biaya Pengantaran</Text>
              <Text style={styles.summarySubLabel}>
                {deliveryMethod === 'diantar'
                  ? 'Area Kampus 3 UMM'
                  : deliveryMethod === 'pickup'
                  ? 'Ambil di Kedai'
                  : 'Disesuaikan saat checkout'}
              </Text>
            </View>
            <Text style={styles.summaryValue}>
              {deliveryMethod ? formatRupiah(currentDeliveryFee) : '-'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatRupiah(deliveryMethod ? cartGrandTotal : cartSubtotal)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomTotalWrapper}>
          <Text style={styles.bottomTotalLabel}>Total Pesanan</Text>
          <Text style={styles.bottomTotalValue}>
            {formatRupiah(deliveryMethod ? cartGrandTotal : cartSubtotal)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigateTo('checkout')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Lanjutkan Checkout"
        >
          <Text style={styles.checkoutBtnText}>Lanjutkan Checkout</Text>
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
    padding: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemUnitPrice: {
    fontSize: 13,
    color: colors.textMuted,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  qtyBtnPlus: {
    backgroundColor: colors.primary,
  },
  qtyText: {
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemSubtotal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    elevation: 1,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summarySubLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
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
  bottomTotalWrapper: {
    flex: 1,
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  bottomTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  checkoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
    marginRight: 6,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },
});
