import React, { useState } from 'react';
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
import { KEDAI_INFO } from '../../data/mockData';

export const HomeScreen = () => {
  const { navigateTo } = useApp();
  const [showStoryModal, setShowStoryModal] = useState(false);

  const shortStory = `Kisah kami bukan sekadar tentang bubur dan kopi. Kedai Tong Djajakarta adalah bukti nyata bahwa mimpi bisa diwujudkan dari bangku kuliah. Dirintis oleh Naufal Atha, seorang mahasiswa sepertimu, usaha ini lahir dari ide kreatif dan semangat yang tak pernah padam...`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 2. Informasi / Cerita Owner */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionAccentBar} />
          <Text style={styles.sectionTitle}>{KEDAI_INFO.storyTitle}</Text>
        </View>

        <Text style={styles.storyText}>{shortStory}</Text>

        <TouchableOpacity
          style={styles.readMoreBtn}
          onPress={() => setShowStoryModal(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Baca selengkapnya cerita owner"
        >
          <Text style={styles.readMoreText}>Baca Selengkapnya</Text>
          <Ionicons name="arrow-forward-circle" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 3. Lokasi Kedai: Temukan Kami */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionAccentBar} />
          <Text style={styles.sectionTitle}>{KEDAI_INFO.locationTitle}</Text>
        </View>

        <View style={styles.locationContentRow}>
          <View style={styles.locationIconBox}>
            <Ionicons name="location-sharp" size={24} color={colors.primary} />
          </View>

          <View style={styles.locationDetails}>
            <Text style={styles.locationKedaiName}>{KEDAI_INFO.name}</Text>
            <Text style={styles.locationBuilding}>
              {KEDAI_INFO.locationBuilding}
            </Text>
            <Text style={styles.locationCampus}>
              {KEDAI_INFO.locationCampus}
            </Text>
          </View>
        </View>

        <View style={styles.locationNoteBox}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.locationNoteText}>
            {KEDAI_INFO.locationDescription}
          </Text>
        </View>
      </View>

      {/* 4. Tombol Utama: PESAN SEKARANG */}
      <View style={styles.ctaWrapper}>
        <TouchableOpacity
          style={styles.pesanButton}
          onPress={() => navigateTo('menu')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Pesan Sekarang"
        >
          <Text style={styles.pesanButtonText}>PESAN SEKARANG</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.surface} />
        </TouchableOpacity>
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
                  accessibilityLabel="Banner UMM PMW Entrepreneur Corner Kedai Tong Djajakarta"
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
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
    fontSize: 16,
    fontWeight: '700',
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
    fontSize: 14,
    lineHeight: 22,
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
    marginBottom: 16,
  },
  p2mwBadgeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
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
  cardSection: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 1,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  storyText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 4,
  },
  locationContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  locationIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  locationDetails: {
    flex: 1,
  },
  locationKedaiName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationBuilding: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 1,
  },
  locationCampus: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  locationNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  locationNoteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  ctaWrapper: {
    marginTop: 4,
  },
  pesanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  pesanButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
    letterSpacing: 0.5,
    marginRight: 8,
  },
});
