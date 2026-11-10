import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { KEDAI_INFO } from '../../data/mockData';
import { CameraModal } from '../../components/CameraModal';
import { uploadProfilePhoto } from '../../services/profilePhotoService';

export const ProfileScreen = () => {
  const { currentUser, logout, profilePhoto, loadProfilePhoto } = useApp();
  const [activeModal, setActiveModal] = useState(null); // 'account' | 'help' | 'about' | 'logout' | null
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Ambil foto profil aktif dari database MySQL saat halaman Profil dibuka
  useEffect(() => {
    if (loadProfilePhoto) {
      loadProfilePhoto();
    }
  }, []);

  const handleConfirmLogout = async () => {
    setActiveModal(null);
    await logout();
  };

  // Buka kamera saat tombol "Buka Kamera..." atau avatar ditekan
  const handleOpenCam = () => {
    setCameraError(null);
    setUploadStatusMessage(null);
    setCameraModalVisible(true);
  };

  // Alur setelah user mengambil foto di kamera dan memilih "Gunakan Foto"
  const handlePhotoCaptured = async (capturedPhotoSource) => {
    setIsUploading(true);
    setUploadStatusMessage(null);
    setCameraError(null);

    try {
      // Kirim foto ke endpoint POST /profile/photo (multipart/form-data, Bearer Token)
      const result = await uploadProfilePhoto(capturedPhotoSource);

      if (result.success) {
        // 1. Tampilkan feedback berhasil
        setUploadStatusMessage({
          title: 'Foto Profil Berhasil Disimpan',
          message: 'Foto profil berhasil diperbarui. Foto profil kamu berhasil diperbarui.',
        });
        // 2. Tutup kamera
        setCameraModalVisible(false);
        // 3. Refresh / panggil fetchProfilePhoto() dari server MySQL
        if (loadProfilePhoto) {
          await loadProfilePhoto();
        }
        // Bersihkan status pesan setelah 4 detik
        setTimeout(() => {
          setUploadStatusMessage(null);
        }, 4000);
      } else {
        setCameraModalVisible(false);
        setUploadStatusMessage(null);
        setCameraError({
          title: result.title || 'Gagal Menyimpan Foto',
          message: result.message || 'Gagal menyimpan foto profil',
        });
      }
    } catch (err) {
      setCameraModalVisible(false);
      setUploadStatusMessage(null);
      setCameraError({
        title: 'Foto Berhasil Diambil',
        message: 'Foto belum dapat disimpan ke server. Pastikan backend API sedang berjalan lalu coba lagi.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* User Avatar & Info Card */}
      <View style={styles.profileHeaderCard}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleOpenCam}
          activeOpacity={0.85}
          disabled={isUploading}
          accessibilityRole="button"
          accessibilityLabel={
            profilePhoto ? 'Ubah foto profil' : 'Ambil foto profil'
          }
        >
          <View style={styles.avatarWrapper}>
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={styles.avatarImage}
                resizeMode="cover"
                accessibilityLabel="Foto Profil Pengguna"
              />
            ) : (
              <Ionicons name="person" size={36} color={colors.primary} />
            )}
          </View>
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={13} color={colors.textInverse} />
          </View>
        </TouchableOpacity>

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

        {/* Upload Success Feedback Box */}
        {uploadStatusMessage ? (
          <View style={styles.uploadSuccessBox}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#16A34A"
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.uploadSuccessTitle}>
                {uploadStatusMessage.title || 'Foto Profil Berhasil Disimpan'}
              </Text>
              <Text style={styles.uploadSuccessText}>
                {uploadStatusMessage.message || 'Foto profil kamu berhasil diperbarui.'}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Camera Error Message Box */}
        {cameraError ? (
          <View style={styles.cameraErrorBox}>
            <View style={styles.cameraErrorHeader}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.cameraErrorTitle}>
                {cameraError.title || 'Kendala Foto Profil'}
              </Text>
            </View>
            <Text style={styles.cameraErrorText}>
              {cameraError.message || cameraError}
            </Text>
            <TouchableOpacity
              style={styles.cameraRetryBtn}
              onPress={handleOpenCam}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Coba lagi mengambil foto profil"
            >
              <Ionicons
                name="refresh"
                size={14}
                color={colors.textInverse}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.cameraRetryBtnText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Camera Action Button: Buka Kamera (Ubah Foto Profil / Ambil Foto Profil) */}
        {isUploading ? (
          <View style={[styles.cameraButton, styles.uploadingButton]}>
            <ActivityIndicator
              size="small"
              color={colors.textInverse}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cameraButtonText}>Menyimpan foto...</Text>
          </View>
        ) : (
          <View style={styles.photoActionsColumn}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleOpenCam}
              disabled={isUploading}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={profilePhoto ? 'Buka Kamera (Ubah Foto Profil)' : 'Buka Kamera (Ambil Foto Profil)'}
            >
              <Ionicons
                name="camera"
                size={18}
                color={colors.textInverse}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cameraButtonText}>
                {profilePhoto ? 'Buka Kamera • Ubah Foto Profil' : 'Buka Kamera • Ambil Foto Profil'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal Akses Kamera (Direct Web/Mobile Camera Viewfinder via expo-camera CameraView) */}
      <CameraModal
        visible={cameraModalVisible}
        onClose={() => setCameraModalVisible(false)}
        onPhotoCaptured={handlePhotoCaptured}
        isUploading={isUploading}
      />

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
        <Text style={styles.logoutButtonText}>Keluar</Text>
      </TouchableOpacity>

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
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FED7D7',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
    elevation: 2,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    width: '100%',
    marginTop: 14,
    minWidth: 130,
  },
  photoActionsColumn: {
    width: '100%',
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textInverse,
  },
  cameraErrorBox: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    alignItems: 'center',
  },
  cameraErrorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cameraErrorTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 6,
  },
  cameraErrorText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 8,
  },
  uploadSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  uploadSuccessTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
    marginBottom: 2,
  },
  uploadSuccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  uploadingButton: {
    opacity: 0.85,
  },
  cameraRetryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cameraRetryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textInverse,
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
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
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
