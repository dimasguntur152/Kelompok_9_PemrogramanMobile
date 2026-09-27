import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { formatRupiah } from '../data/mockData';

export const ProductListItem = ({
  item,
  quantity = 0,
  onAdd,
  onRemove,
}) => {
  const isAvailable = item.available !== false;

  // Badge styling according to label type
  const getBadgeStyle = (label) => {
    if (label === 'FAVORIT!' || label === 'BEST SELLER!') {
      return {
        bg: '#FEF3C7',
        text: '#B45309',
        border: '#FDE68A',
      };
    }
    if (label === 'DARK SERIES') {
      return {
        bg: '#F5F5F4',
        text: '#292524',
        border: '#E7E5E4',
      };
    }
    if (label === 'LIGHT SERIES') {
      return {
        bg: '#FFF7ED',
        text: '#C2410C',
        border: '#FFEDD5',
      };
    }
    return {
      bg: colors.primarySoft,
      text: colors.primary,
      border: '#FED7D7',
    };
  };

  const badgeConfig = item.label ? getBadgeStyle(item.label) : null;

  return (
    <View
      style={[
        styles.container,
        !isAvailable && styles.containerDisabled,
      ]}
      accessibilityRole="text"
    >
      <View style={styles.infoCol}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.nameText, !isAvailable && styles.textDisabled]}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          {item.label && isAvailable && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: badgeConfig.bg,
                  borderColor: badgeConfig.border,
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: badgeConfig.text }]}>
                {item.label}
              </Text>
            </View>
          )}

          {!isAvailable && (
            <View style={styles.badgeHabis}>
              <Text style={styles.badgeHabisText}>Habis</Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.priceText, !isAvailable && styles.textDisabled]}
        >
          {formatRupiah(item.price)}
        </Text>
      </View>

      {/* Quantity Control: [-] count [+] */}
      <View style={styles.qtyContainer}>
        {isAvailable ? (
          <>
            <TouchableOpacity
              style={[
                styles.qtyBtn,
                quantity === 0 && styles.qtyBtnDisabled,
              ]}
              onPress={() => onRemove(item.id)}
              disabled={quantity === 0}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Kurangi ${item.name}`}
            >
              <Ionicons
                name="remove"
                size={16}
                color={quantity > 0 ? colors.textPrimary : colors.border}
              />
            </TouchableOpacity>

            <View style={styles.qtyCountWrapper}>
              <Text
                style={[
                  styles.qtyCountText,
                  quantity > 0 && styles.qtyCountTextActive,
                ]}
              >
                {quantity}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.qtyBtn, styles.qtyBtnPlus]}
              onPress={() => onAdd(item.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Tambah ${item.name}`}
            >
              <Ionicons name="add" size={16} color={colors.surface} />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.habisPlaceholder}>
            <Text style={styles.habisPlaceholderText}>Tidak Tersedia</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  containerDisabled: {
    backgroundColor: '#FAFAF9',
    opacity: 0.75,
  },
  infoCol: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  textDisabled: {
    color: colors.textMuted,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badgeHabis: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#E7E5E4',
  },
  badgeHabisText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#78716C',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  qtyBtnDisabled: {
    backgroundColor: 'transparent',
  },
  qtyBtnPlus: {
    backgroundColor: colors.primary,
  },
  qtyCountWrapper: {
    minWidth: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  qtyCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  qtyCountTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  habisPlaceholder: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F5F5F4',
  },
  habisPlaceholderText: {
    fontSize: 11,
    color: '#A8A29E',
    fontWeight: '500',
  },
});
