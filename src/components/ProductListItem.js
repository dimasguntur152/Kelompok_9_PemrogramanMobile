import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { formatRupiah } from '../data/mockData';

// Warna placeholder per kategori (digunakan saat gambar gagal dimuat)
const CATEGORY_PLACEHOLDER_COLORS = {
  Kopi: '#451a03',
  'Non-Kopi': '#1a3a2a',
  Makanan: '#1c1917',
  'Lain-lain': '#1e1b4b',
};

const CATEGORY_PLACEHOLDER_ICONS = {
  Kopi: 'cafe',
  'Non-Kopi': 'wine',
  Makanan: 'restaurant',
  'Lain-lain': 'ellipsis-horizontal',
};

export const ProductListItem = ({
  item,
  quantity = 0,
  onAdd,
  onRemove,
}) => {
  const isAvailable = item.available !== false;
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const placeholderBg =
    CATEGORY_PLACEHOLDER_COLORS[item.category] ?? '#292524';
  const placeholderIcon =
    CATEGORY_PLACEHOLDER_ICONS[item.category] ?? 'fast-food';

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
  const hasValidImage = item.image && !imageError;

  return (
    <View
      style={[
        styles.container,
        !isAvailable && styles.containerDisabled,
      ]}
      accessibilityRole="text"
    >
      {/* Gambar Menu */}
      <View style={styles.imageWrapper}>
        {hasValidImage ? (
          <>
            {!imageLoaded && (
              <View style={[styles.imagePlaceholder, { backgroundColor: placeholderBg }]}>
                <Ionicons
                  name={placeholderIcon}
                  size={20}
                  color="rgba(255,255,255,0.4)"
                />
              </View>
            )}
            <Image
              source={{ uri: item.image }}
              style={[styles.itemImage, !imageLoaded && styles.imageHidden]}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              accessibilityLabel={`Gambar ${item.name}`}
            />
          </>
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: placeholderBg }]}>
            <Ionicons
              name={placeholderIcon}
              size={20}
              color="rgba(255,255,255,0.5)"
            />
          </View>
        )}

        {/* Overlay "Habis" di atas gambar */}
        {!isAvailable && (
          <View style={styles.imageOverlayHabis}>
            <Text style={styles.imageOverlayText}>Habis</Text>
          </View>
        )}
      </View>

      {/* Info: nama, badge, harga */}
      <View style={styles.infoCol}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.nameText, !isAvailable && styles.textDisabled]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </View>

        {/* Badge baris sendiri agar tidak overflow */}
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  containerDisabled: {
    backgroundColor: '#FAFAF9',
    opacity: 0.75,
  },
  // ---- Gambar ----
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
    flexShrink: 0,
    backgroundColor: '#292524',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  imageHidden: {
    width: 0,
    height: 0,
    position: 'absolute',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlayHabis: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  imageOverlayText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  // ---- Info ----
  infoCol: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    marginBottom: 2,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 19,
  },
  textDisabled: {
    color: colors.textMuted,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  // ---- Quantity ----
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
    flexShrink: 0,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
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
    paddingHorizontal: 8,
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
