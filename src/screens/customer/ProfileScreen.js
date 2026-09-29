import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { KEDAI_INFO } from '../../data/mockData';

export const ProfileScreen = () => {
  const { currentUser, logout } = useApp();
  const [activeModal, setActiveModal] = useState(null); // 'account' | 'help' | 'about' | 'logout' | null

  const handleConfirmLogout = async () => {
    setActiveModal(null);
    await logout();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* User Avatar & Info Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarWrapper}>
          <Ionicons name="person" size={36} color={colors.primary} />
        </View>

        <Text style={styles.userName}>
          {currentUser?.name || 'Civitas UMM'}
        </Text>
        <Text style={styles.userEmail}>
          {currentUser?.email || 'civitas@umm.ac.id'}
        </Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>
            {currentUser?.role || 'Civitas Akademika • Kampus 3 UMM'}
          </Text>
        </View>
      </View>

      {/* Keamanan & Sesi Card (Pertemuan 3 Requirement) */}
      <View style={styles.securityCard}>
        <View style={styles.securityHeader}>
          <Ionicons
            name="shield-checkmark"
            size={18}
            color={colors.statusSuccess}
          />
          <Text style={styles.securityTitle}>Status Keamanan & Sesi</Text>
        </View>
        <View style={styles.securityRow}>
          <Text style={styles.securityLabel}>Status Sesi:</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusPillText}>Aktif (Secure Storage)</Text>
          </View>
        </View>
        <View style={styles.securityRow}>
          <Text style={styles.securityLabel}>Penyimpanan:</Text>
          <Text style={styles.securityVal}>Expo SecureStore</Text>
        </View>
        <View style={[styles.securityRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.securityLabel}>Enkripsi Kredensial:</Text>
          <Text style={styles.securityVal}>Salted SHA-256 Hashing</Text>
        </View>
      </View>

      {/* Menu Options (3 required items) */}
      <View style={styles.menuSection}>
        {/* 1. Informasi Akun */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setActiveModal('account')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Informasi Akun"
        >
          <View style={styles.menuLeft}>
            <View style={styles.menuIconBox}>
              <Ionicons
                name="person-circle-outline"
                size={22}
                color={colors.primary}
              />
            </View>
            <Text style={styles.menuTitle}>Informasi Akun</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* 2. Bantuan */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setActiveModal('help')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Bantuan"
        >
          <View style={styles.menuLeft}>
            <View style={styles.menuIconBox}>
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={colors.primary}
              />
            </View>
            <Text style={styles.menuTitle}>Bantuan</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* 3. Tentang Kedai Tong Djajakarta */}
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
          onPress={() => setActiveModal('about')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Tentang Kedai Tong Djajakarta"
        >
          <View style={styles.menuLeft}>
            <View style={styles.menuIconBox}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={colors.primary}
              />
            </View>
            <Text style={styles.menuTitle}>Tentang Kedai Tong Djajakarta</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Tombol Logout (Pertemuan 3 Requirement) */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setActiveModal('logout')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Keluar dari akun dan hapus sesi"
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color={colors.primaryLight}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.logoutButtonText}>Keluar Akun (Logout)</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>
        Kedai Tong Djajakarta v1.0 • P2MW UMM
      </Text>

      {/* Modal 1: Informasi Akun */}
      <Modal
        visible={activeModal === 'account'}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Informasi Akun</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Nama:</Text>
              <Text style={styles.modalVal}>
                {currentUser?.name || 'Civitas UMM'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Email:</Text>
              <Text style={styles.modalVal}>
                {currentUser?.email || 'civitas@umm.ac.id'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Status:</Text>
              <Text style={styles.modalVal}>
                {currentUser?.role || 'Civitas Akademika • Kampus 3 UMM'}
              </Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Kampus:</Text>
              <Text style={styles.modalVal}>Kampus 3 UMM Malang</Text>
            </View>
            <View style={[styles.modalRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.modalLabel}>Keamanan:</Text>
              <Text style={[styles.modalVal, { color: colors.statusSuccess }]}>
                Sesi Terenkripsi
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Bantuan */}
      <Modal
        visible={activeModal === 'help'}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pusat Bantuan</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.faqQ}>Bagaimana cara memesan?</Text>
            <Text style={styles.faqA}>
              Buka menu dari Beranda, pilih item minuman atau makanan, masukkan ke
              keranjang, pilih Diantar atau Ambil di Kedai, lalu selesaikan pembayaran QRIS.
            </Text>

            <Text style={styles.faqQ}>Apakah pengantaran bisa ke luar kampus?</Text>
            <Text style={styles.faqA}>
              Tidak. Layanan pengantaran Kedai Tong Djajakarta secara ketat HANYA
              melayani area gedung di lingkungan Kampus 3 UMM.
            </Text>

            <Text style={styles.faqQ}>Di mana lokasi kedai?</Text>
            <Text style={styles.faqA}>
              Gedung Kuliah Bersama 2 (GKB 2) Lantai Basement, Kampus 3 UMM.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Modal 3: Tentang Kedai */}
      <Modal
        visible={activeModal === 'about'}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tentang Kedai</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.aboutStory}>{KEDAI_INFO.storyContent}</Text>
            <View style={styles.aboutBadgeBox}>
              <Text style={styles.aboutBadgeText}>
                Program Pembinaan Mahasiswa Wirausaha (P2MW)
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 4: Konfirmasi Logout (Pertemuan 3 Requirement) */}
      <Modal
        visible={activeModal === 'logout'}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.logoutModalIconBox}>
              <Ionicons
                name="log-out-outline"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.logoutModalTitle}>Konfirmasi Logout</Text>
            <Text style={styles.logoutModalDesc}>
              Sesi login Anda akan dihapus secara permanen dari Secure Storage.
              Anda harus memasukkan kredensial kembali untuk mengakses aplikasi.
            </Text>

            <View style={styles.logoutActionRow}>
              <TouchableOpacity
                style={styles.cancelLogoutBtn}
                onPress={() => setActiveModal(null)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Batal logout"
              >
                <Text style={styles.cancelLogoutBtnText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmLogoutBtn}
                onPress={handleConfirmLogout}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Konfirmasi hapus sesi dan keluar"
              >
                <Text style={styles.confirmLogoutBtnText}>Ya, Logout</Text>
              </TouchableOpacity>
            </View>
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
    padding: 16,
    paddingBottom: 28,
  },
  profileHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
    elevation: 1,
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FED7D7',
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: '#FAF5EE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E8DC',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accentDark,
  },
  securityCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: 16,
    marginBottom: 16,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.statusSuccess,
    marginLeft: 6,
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  securityLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  securityVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.statusSuccess,
    marginRight: 5,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.statusSuccess,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  modalVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  faqQ: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 10,
    marginBottom: 2,
  },
  faqA: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  aboutStory: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  aboutBadgeBox: {
    backgroundColor: colors.primarySoft,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  aboutBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  logoutModalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  logoutModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  logoutModalDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  logoutActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelLogoutBtn: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLogoutBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  confirmLogoutBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLogoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
