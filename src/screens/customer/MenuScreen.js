import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import {
  INITIAL_MENU,
  MENU_CATEGORIES,
  formatRupiah,
} from '../../data/mockData';
import { ProductListItem } from '../../components/ProductListItem';

export const MenuScreen = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    cartTotalCount,
    cartSubtotal,
    navigateTo,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Filter logic: category & search query
  const filteredMenu = useMemo(() => {
    return INITIAL_MENU.filter((item) => {
      // Category match
      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchSearch = query === '' || item.name.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      {/* Subtitle */}
      <View style={styles.subtitleHeader}>
        <Text style={styles.subtitleText}>
          Pilihan menu Tong Djajakarta untuk menemani aktivitasmu.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari makanan atau minuman..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            accessibilityLabel="Pencarian menu"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}
              accessibilityLabel="Hapus kata kunci pencarian"
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Horizontal Category Filters */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {MENU_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Kategori ${cat}`}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Menu List */}
      {filteredMenu.length > 0 ? (
        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductListItem
              item={item}
              quantity={cart[item.id] || 0}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            cartTotalCount > 0 && { paddingBottom: 90 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="search" size={32} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Menu tidak ditemukan.</Text>
          <Text style={styles.emptySubtitle}>
            Coba cari dengan kata kunci lain.
          </Text>
        </View>
      )}

      {/* Compact Floating Cart Summary (Only when cart has items) */}
      {cartTotalCount > 0 && (
        <View style={styles.floatingCartContainer}>
          <View style={styles.cartInfoSection}>
            <Text style={styles.cartSummaryText}>
              {cartTotalCount} item • {formatRupiah(cartSubtotal)}
            </Text>
            <Text style={styles.cartSubNote}>Belum termasuk ongkir</Text>
          </View>

          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => navigateTo('cart')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Lihat Keranjang"
          >
            <Text style={styles.viewCartText}>Lihat Keranjang</Text>
            <Ionicons name="cart" size={16} color={colors.surface} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  subtitleHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.surface,
  },
  subtitleText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  categoriesWrapper: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 6,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  cartInfoSection: {
    flex: 1,
  },
  cartSummaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },
  cartSubNote: {
    fontSize: 11,
    color: '#FED7D7',
    marginTop: 2,
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  viewCartText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.surface,
    marginRight: 6,
  },
});
