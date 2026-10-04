import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import {
  KEDAI_INFO,
  INITIAL_MENU,
  formatRupiah,
} from '../../data/mockData';

export const HomeScreen = () => {
  const { navigateTo, addToCart, removeFromCart, cart } = useApp();
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(360);
  const carouselScrollRef = useRef(null);

  // 1. Hero Carousel Data (Exact text as requested)
  const banners = [
    {
      id: 'banner_1',
      tag: 'MENU TERBAIK',
      title: 'Kopi dan Makanan Favoritmu',
      subtitle: 'Pesan lebih mudah dari Kampus 3 UMM',
      ctaText: 'Pesan Sekarang',
      bgGradient: '#751417',
      accentColor: '#FED7AA',
      icon: 'cafe',
    },
    {
      id: 'banner_2',
      tag: 'PENGANTARAN CEPAT',
      title: 'Pesan dari Mana Saja',
      subtitle: 'Antar langsung ke lokasi kamu di Kampus 3 UMM',
      ctaText: 'Pesan Sekarang',
      bgGradient: '#831843',
      accentColor: '#FDE68A',
      icon: 'bicycle',
    },
    {
      id: 'banner_3',
      tag: 'TONG FAMILY',
      title: 'Menu Favorit Tong Family',
      subtitle: 'Temukan minuman dan makanan favoritmu',
      ctaText: 'Pesan Sekarang',
      bgGradient: '#431407',
      accentColor: '#FECACA',
      icon: 'sparkles',
    },
  ];

  // 2. Categories Data with clean simple icons
  const categoriesList = [
    { id: 'Semua', name: 'Semua', icon: 'grid-outline' },
    { id: 'Kopi', name: 'Kopi', icon: 'cafe-outline' },
    { id: 'Non-Kopi', name: 'Non-Kopi', icon: 'color-filter-outline' },
    { id: 'Makanan', name: 'Makanan', icon: 'restaurant-outline' },
    { id: 'Lainnya', name: 'Lainnya', icon: 'ellipsis-horizontal-circle-outline' },
  ];

  // 3. Curated Popular Drinks / Best Seller from exact Kedai Tong Djajakarta menu
  const popularItemIds = ['kopi-9', 'nonkopi-8', 'kopi-1', 'kopi-11', 'nonkopi-2'];
  const popularDrinks = popularItemIds
    .map((id) => INITIAL_MENU.find((item) => item.id === id))
    .filter(Boolean);

  const handleCategoryPress = (categoryName) => {
    navigateTo('menu', { category: categoryName });
  };

  const cardWidth = Math.max(carouselWidth - 32, 280);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setCarouselWidth(w);
      }}
    >
      {/* ================================================== */}
      {/* 1. HERO / BANNER CAROUSEL                          */}
      {/* ================================================== */}
      <View style={styles.carouselSection}>
        <ScrollView
          ref={carouselScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + 12}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselScrollContent}
          onScroll={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / (cardWidth + 12));
            if (index !== carouselIndex && index >= 0 && index < banners.length) {
              setCarouselIndex(index);
            }
          }}
          scrollEventThrottle={16}
        >
          {banners.map((banner, idx) => (
            <View
              key={banner.id}
              style={[
                styles.bannerCard,
                { width: cardWidth, backgroundColor: banner.bgGradient },
              ]}
            >
              {/* Background watermark icon */}
              <View style={styles.bannerWatermark}>
                <Ionicons
                  name={banner.icon}
                  size={120}
                  color="rgba(255, 255, 255, 0.08)"
                />
              </View>

              <View style={styles.bannerBody}>
                <View style={styles.bannerBadgeRow}>
                  <View style={styles.bannerTagBadge}>
                    <Text style={styles.bannerTagText}>{banner.tag}</Text>
                  </View>
                </View>

                <Text style={styles.bannerTitleText}>{banner.title}</Text>
                <Text style={styles.bannerSubtitleText}>{banner.subtitle}</Text>

                <TouchableOpacity
                  style={styles.bannerCtaBtn}
                  onPress={() => navigateTo('menu')}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={banner.ctaText}
                >
                  <Text style={styles.bannerCtaText}>{banner.ctaText}</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Carousel Pagination Dots */}
        <View style={styles.dotsRow}>
          {banners.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                carouselIndex === idx && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* ================================================== */}
      {/* 2. CATEGORIES                                      */}
      {/* ================================================== */}
      <View style={styles.sectionWrapper}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleLeft}>
            <View style={styles.sectionAccentBar} />
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleCategoryPress('Semua')}
            activeOpacity={0.7}
            style={styles.seeAllBtn}
            accessibilityRole="button"
            accessibilityLabel="Lihat Semua Kategori"
          >
            <Text style={styles.seeAllText}>Lihat Semua</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categoriesList.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(cat.name)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Kategori ${cat.name}`}
            >
              <View style={styles.categoryIconCircle}>
                <Ionicons name={cat.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.categoryNameText} numberOfLines={1}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ================================================== */}
      {/* 3. POPULAR DRINKS / BEST SELLER                    */}
      {/* ================================================== */}
      <View style={styles.sectionWrapper}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleLeft}>
            <View style={styles.sectionAccentBar} />
            <Text style={styles.sectionTitle}>Popular Drinks</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigateTo('menu')}
            activeOpacity={0.7}
            style={styles.seeAllBtn}
            accessibilityRole="button"
            accessibilityLabel="Lihat Semua Menu Minuman"
          >
            <Text style={styles.seeAllText}>Lihat Semua</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularScrollContent}
        >
          {popularDrinks.map((item) => {
            const itemQty = cart[item.id] || 0;
            const isBestSeller =
              item.label === 'BEST SELLER!' ||
              item.label === 'FAVORIT!' ||
              item.id === 'kopi-9' ||
              item.id === 'nonkopi-8';

            return (
              <View key={item.id} style={styles.popularCard}>
                {/* Card Top: Badge & Beverage Icon */}
                <View style={styles.popularCardHeader}>
                  {isBestSeller ? (
                    <View style={styles.bestSellerBadge}>
                      <Ionicons
                        name="flame"
                        size={11}
                        color="#B45309"
                        style={{ marginRight: 3 }}
                      />
                      <Text style={styles.bestSellerBadgeText}>BEST SELLER</Text>
                    </View>
                  ) : (
                    <View style={styles.regularBadge}>
                      <Text style={styles.regularBadgeText}>REKOMENDASI</Text>
                    </View>
                  )}

                  <View style={styles.drinkIconBox}>
                    <Ionicons
                      name={item.category === 'Kopi' ? 'cafe' : 'wine'}
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                </View>

                {/* Card Body: Name & Price */}
                <View style={styles.popularCardBody}>
                  <Text style={styles.popularItemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.popularItemPrice}>
                    {formatRupiah(item.price)}
                  </Text>
                </View>

                {/* Card Footer: Add to Cart Stepper */}
                <View style={styles.popularCardFooter}>
                  {itemQty === 0 ? (
                    <TouchableOpacity
                      style={styles.addPopularBtn}
                      onPress={() => addToCart(item.id)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={`Tambah ${item.name} ke keranjang`}
                    >
                      <Ionicons
                        name="add"
                        size={15}
                        color={colors.surface}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.addPopularText}>Tambah</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.popularQtyControl}>
                      <TouchableOpacity
                        style={styles.popularQtyBtn}
                        onPress={() => removeFromCart(item.id)}
                        activeOpacity={0.7}
                        accessibilityLabel={`Kurangi ${item.name}`}
                      >
                        <Ionicons
                          name="remove"
                          size={14}
                          color={colors.textPrimary}
                        />
                      </TouchableOpacity>

                      <Text style={styles.popularQtyNumber}>{itemQty}</Text>

                      <TouchableOpacity
                        style={[styles.popularQtyBtn, styles.popularQtyBtnPlus]}
                        onPress={() => addToCart(item.id)}
                        activeOpacity={0.7}
                        accessibilityLabel={`Tambah ${item.name}`}
                      >
                        <Ionicons
                          name="add"
                          size={14}
                          color={colors.surface}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* ================================================== */}
      {/* 4. CERITA PEMILIK / TENTANG KEDAI                  */}
      {/* ================================================== */}
      <View style={styles.storyCardSection}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleLeft}>
            <View style={styles.sectionAccentBar} />
            <Text style={styles.storySectionTitle}>{KEDAI_INFO.storyTitle}</Text>
          </View>
        </View>

        {/* Business Banner Image */}
        <View style={styles.storyBannerWrapper}>
          <Image
            source={require('../../../assets/banner.png')}
            style={styles.storyBannerImage}
            resizeMode="cover"
            accessibilityLabel="Banner Kedai Tong Djajakarta UMM"
          />
          <View style={styles.storyBannerOverlay}>
            <View style={styles.founderTag}>
              <Ionicons
                name="school-outline"
                size={12}
                color={colors.surface}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.founderTagText}>
                Dirintis oleh Naufal Atha • Mahasiswa UMM
              </Text>
            </View>
          </View>
        </View>

        {/* Story Text */}
        <Text style={styles.storyParagraph}>
          {KEDAI_INFO.storyContent.split('\n\n')[0]}
        </Text>

        {/* P2MW Badge Box */}
        <View style={styles.p2mwPill}>
          <Ionicons
            name="ribbon-outline"
            size={18}
            color={colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.p2mwPillText}>
            Lolos Pendanaan P2MW Bidang F&B UMM
          </Text>
        </View>

        {/* Story Actions & Location Details */}
        <View style={styles.storyFooterRow}>
          <TouchableOpacity
            style={styles.readMoreBtn}
            onPress={() => setShowStoryModal(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Baca selengkapnya kisah kedai"
          >
            <Text style={styles.readMoreText}>Baca Selengkapnya</Text>
            <Ionicons
              name="arrow-forward-circle"
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.storyLocationMini}>
            <Ionicons
              name="location-sharp"
              size={14}
              color={colors.primary}
              style={{ marginRight: 3 }}
            />
            <Text style={styles.storyLocationText}>GKB 2 Basement</Text>
          </View>
        </View>
      </View>

      {/* Modal Detail Informasi Cerita Owner */}
      <Modal
        visible={showStoryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{KEDAI_INFO.storyTitle}</Text>
              <TouchableOpacity
                onPress={() => setShowStoryModal(false)}
                style={styles.closeBtn}
                accessibilityLabel="Tutup cerita"
              >
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBannerWrapper}>
                <Image
                  source={require('../../../assets/banner.png')}
                  style={styles.modalBannerImage}
                  resizeMode="cover"
                  accessibilityLabel="Banner UMM PMW Kedai Tong Djajakarta"
                />
              </View>

              <Text style={styles.fullStoryText}>
                {KEDAI_INFO.storyContent}
              </Text>

              <View style={styles.p2mwBadgeBox}>
                <Ionicons
                  name="ribbon-outline"
                  size={20}
                  color={colors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.p2mwBadgeText}>
                  Usaha Mahasiswa Lolos Pendanaan P2MW UMM
                </Text>
              </View>

              <View style={styles.locationModalBox}>
                <Ionicons
                  name="location-sharp"
                  size={18}
                  color={colors.primary}
                  style={{ marginRight: 8, marginTop: 1 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationModalKedai}>
                    Kedai Tong Djajakarta
                  </Text>
                  <Text style={styles.locationModalDetail}>
                    GKB 2 Basement, Kampus 3 UMM
                  </Text>
                  <Text style={styles.locationModalNote}>
                    Layanan antar khusus area Kampus 3 UMM
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalCloseActionBtn}
                onPress={() => setShowStoryModal(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalCloseActionText}>Tutup</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 24,
  },

  // Carousel Styles
  carouselSection: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  carouselScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bannerCard: {
    height: 168,
    borderRadius: 18,
    padding: 18,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bannerWatermark: {
    position: 'absolute',
    right: -10,
    bottom: -15,
    zIndex: 0,
  },
  bannerBody: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  bannerBadgeRow: {
    flexDirection: 'row',
  },
  bannerTagBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bannerTitleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 6,
    lineHeight: 22,
  },
  bannerSubtitleText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 16,
  },
  bannerCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
    elevation: 2,
  },
  bannerCtaText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D6D3D1',
  },
  dotActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  // Section Headers
  sectionWrapper: {
    marginTop: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionAccentBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 8,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 2,
  },

  // Categories Styles
  categoriesScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minWidth: 78,
    elevation: 1,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Popular Drinks Styles
  popularScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  popularCard: {
    width: 164,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  popularCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bestSellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  bestSellerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.2,
  },
  regularBadge: {
    backgroundColor: '#F5F5F4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  regularBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#78716C',
  },
  drinkIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularCardBody: {
    marginBottom: 12,
  },
  popularItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    minHeight: 34,
    lineHeight: 17,
  },
  popularItemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  popularCardFooter: {
    marginTop: 'auto',
  },
  addPopularBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addPopularText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  popularQtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  popularQtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularQtyBtnPlus: {
    backgroundColor: colors.primary,
  },
  popularQtyNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Owner Story Styles
  storyCardSection: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  storySectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
    flex: 1,
  },
  storyBannerWrapper: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
    backgroundColor: colors.primaryDark,
  },
  storyBannerImage: {
    width: '100%',
    height: '100%',
  },
  storyBannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(28, 25, 23, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  founderTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  founderTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  storyParagraph: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  p2mwPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginBottom: 12,
  },
  p2mwPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  storyFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 4,
  },
  storyLocationMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  storyLocationText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    paddingRight: 10,
  },
  closeBtn: {
    padding: 4,
  },
  modalBannerWrapper: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: colors.primaryDark,
  },
  modalBannerImage: {
    width: '100%',
    height: '100%',
  },
  fullStoryText: {
    fontSize: 13,
    lineHeight: 21,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  p2mwBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginBottom: 14,
  },
  p2mwBadgeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  locationModalBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    marginBottom: 16,
  },
  locationModalKedai: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationModalDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  locationModalNote: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontStyle: 'italic',
  },
  modalCloseActionBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },
});
