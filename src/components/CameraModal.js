import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors } from '../theme/colors';

/**
 * CameraModal Component for Kedai Tong Djajakarta
 * 
 * Modul Kamera Profil menggunakan expo-camera (CameraView & useCameraPermissions):
 * 1. Mendukung live camera preview resmi (WebRTC getUserMedia di browser Web dan native CameraView di Mobile)
 * 2. Tanpa file picker, murni akses sensor kamera langsung
 * 3. Penanganan permission lengkap:
 *    - Memeriksa status izin saat modal dibuka
 *    - Meminta izin secara reaktif
 *    - Pesan penolakan jelas: "Akses Kamera Ditolak" & "Izin kamera diperlukan untuk mengambil foto profil."
 *    - Tombol "Coba Lagi" untuk mengajukan izin kembali
 * 4. Shutter button besar dengan kontrol state cameraReady ("Mempersiapkan kamera...")
 * 5. Preview hasil foto dengan opsi:
 *    - "Gunakan Foto" (menyimpan ke backend MySQL profile_photos.image_data)
 *    - "Ambil Ulang" (kembali ke live viewfinder tanpa upload)
 *    - "Batal" (kembali ke Profil tanpa error)
 * 6. Indikator upload jelas: "Menyimpan Foto...", "Foto sedang disimpan ke server."
 * 7. Lifecycle bersih: Kamera di-unmount saat modal ditutup atau saat preview aktif
 */

export const CameraModal = ({
  visible,
  onClose,
  onPhotoCaptured,
  isUploading = false,
}) => {
  const [mode, setMode] = useState('viewfinder'); // 'viewfinder' | 'preview'
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [facing, setFacing] = useState('back'); // Default: back camera (switch front ↔ back)
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null); // { title: string, message: string }

  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  // Inisialisasi saat modal dibuka / ditutup
  useEffect(() => {
    if (visible) {
      setMode('viewfinder');
      setCapturedPhoto(null);
      setCameraError(null);
      setCameraReady(false);

      // Jika permission belum diberikan, minta permission ke user
      if (!permission?.granted) {
        requestPermission().catch(() => {});
      }
    } else {
      setCameraReady(false);
      setCapturedPhoto(null);
      setCameraError(null);
    }
  }, [visible]);

  // Reset cameraReady saat mengubah arah kamera (front ↔ back)
  useEffect(() => {
    setCameraReady(false);
  }, [facing]);

  // Handler tombol Batal / Tutup
  const handleCancel = () => {
    if (isUploading) return;
    setCapturedPhoto(null);
    setCameraError(null);
    setCameraReady(false);
    setMode('viewfinder');
    if (onClose) onClose();
  };

  // Switch kamera depan ↔ belakang
  const toggleFacing = () => {
    if (isUploading) return;
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  // Handler shutter / ambil foto
  const handleShutter = async () => {
    if (!cameraRef.current || !cameraReady || isUploading) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
      });

      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
        setMode('preview');
        setCameraError(null);
      } else {
        setCameraError({
          title: 'Gagal Mengambil Foto',
          message: 'Foto tidak berhasil diambil. Silakan coba lagi.',
        });
      }
    } catch (err) {
      setCameraError({
        title: 'Gagal Mengambil Foto',
        message: 'Foto tidak berhasil diambil. Silakan coba lagi.',
      });
    }
  };

  // Handler Ambil Ulang foto
  const handleRetake = () => {
    if (isUploading) return;
    setCapturedPhoto(null);
    setCameraError(null);
    setCameraReady(false);
    setMode('viewfinder');
  };

  // Handler konfirmasi Gunakan Foto
  const handleConfirmPhoto = () => {
    if (!capturedPhoto || isUploading) return;
    if (onPhotoCaptured) {
      onPhotoCaptured(capturedPhoto);
    }
  };

  // Handler coba lagi jika ada error
  const handleRetryError = async () => {
    setCameraError(null);
    setCameraReady(false);
    if (!permission?.granted) {
      await requestPermission();
    }
  };

  if (!visible) return null;

  const isPermissionDenied = permission && !permission.granted;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleCancel}
            activeOpacity={0.7}
            disabled={isUploading}
            accessibilityRole="button"
            accessibilityLabel="Tutup kamera"
          >
            <Ionicons name="close" size={24} color={colors.textInverse} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {mode === 'preview' ? 'Pratinjau Foto Profil' : 'Kamera Foto Profil'}
          </Text>

          {mode === 'viewfinder' ? (
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={toggleFacing}
              activeOpacity={0.7}
              disabled={isUploading || isPermissionDenied}
              accessibilityRole="button"
              accessibilityLabel="Putar kamera depan atau belakang"
            >
              <Ionicons name="camera-reverse-outline" size={24} color={colors.textInverse} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {mode === 'viewfinder' ? (
            <View style={styles.viewfinderWrapper}>
              {/* Permission Denied State */}
              {isPermissionDenied ? (
                <View style={styles.permissionDeniedBox}>
                  <View style={styles.errorIconCircle}>
                    <Ionicons name="camera-outline" size={38} color="#DC2626" />
                  </View>
                  <Text style={styles.errorTitle}>Akses Kamera Ditolak</Text>
                  <Text style={styles.errorDesc}>
                    Silakan izinkan akses kamera melalui pengaturan browser/perangkat untuk mengambil foto profil.
                  </Text>
                  <Text style={styles.errorDescSub}>
                    Izin kamera diperlukan untuk mengambil foto profil.
                  </Text>
                  <TouchableOpacity
                    style={styles.retryPermBtn}
                    onPress={handleRetryError}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Coba lagi meminta izin kamera"
                  >
                    <Ionicons name="refresh" size={16} color={colors.textInverse} style={{ marginRight: 6 }} />
                    <Text style={styles.retryPermBtnText}>Coba Lagi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelPermBtn}
                    onPress={handleCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelPermBtnText}>Batal</Text>
                  </TouchableOpacity>
                </View>
              ) : cameraError ? (
                /* Camera Error State */
                <View style={styles.permissionDeniedBox}>
                  <View style={styles.errorIconCircle}>
                    <Ionicons name="alert-circle-outline" size={38} color="#DC2626" />
                  </View>
                  <Text style={styles.errorTitle}>{cameraError.title}</Text>
                  <Text style={styles.errorDesc}>{cameraError.message}</Text>
                  <TouchableOpacity
                    style={styles.retryPermBtn}
                    onPress={handleRetryError}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="refresh" size={16} color={colors.textInverse} style={{ marginRight: 6 }} />
                    <Text style={styles.retryPermBtnText}>Coba Lagi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelPermBtn}
                    onPress={handleCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelPermBtnText}>Batal</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* LIVE CAMERA VIEW (expo-camera CameraView) */
                <View style={styles.cameraFrame}>
                  <CameraView
                    ref={cameraRef}
                    facing={facing}
                    style={styles.camera}
                    onCameraReady={() => setCameraReady(true)}
                    onMountError={(error) => {
                      setCameraError({
                        title: 'Kamera Tidak Dapat Dibuka',
                        message: 'Terjadi masalah saat membuka kamera. Pastikan kamera tersedia dan coba lagi.',
                      });
                    }}
                  />

                  {/* Preparing Camera Overlay */}
                  {!cameraReady && (
                    <View style={styles.preparingOverlay}>
                      <ActivityIndicator size="large" color={colors.primary} />
                      <Text style={styles.preparingText}>Mempersiapkan kamera...</Text>
                    </View>
                  )}

                  {/* Framing Focus Guide */}
                  {cameraReady && (
                    <View style={styles.focusOverlay} pointerEvents="none" />
                  )}
                </View>
              )}
            </View>
          ) : (
            /* PREVIEW MODE */
            <View style={styles.previewWrapper}>
              <View style={styles.previewImageContainer}>
                {capturedPhoto ? (
                  <Image
                    source={{ uri: capturedPhoto }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ) : null}

                {/* Uploading Overlay on Preview */}
                {isUploading && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.uploadingTitle}>Menyimpan Foto...</Text>
                    <Text style={styles.uploadingSubtitle}>Foto sedang disimpan ke server.</Text>
                  </View>
                )}
              </View>

              {!isUploading ? (
                <Text style={styles.previewHint}>
                  Pastikan foto Anda jelas dan fokus sebelum digunakan sebagai foto profil.
                </Text>
              ) : null}
            </View>
          )}
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {mode === 'viewfinder' ? (
            !isPermissionDenied && !cameraError ? (
              <View style={styles.shutterRow}>
                <TouchableOpacity
                  style={styles.cancelTextBtn}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                  disabled={isUploading}
                >
                  <Text style={styles.cancelTextBtnText}>Batal</Text>
                </TouchableOpacity>

                {/* Shutter Button */}
                <TouchableOpacity
                  style={[
                    styles.shutterButtonOuter,
                    !cameraReady && styles.shutterButtonOuterDisabled,
                  ]}
                  onPress={handleShutter}
                  disabled={!cameraReady || isUploading}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Ambil Foto"
                >
                  <View
                    style={[
                      styles.shutterButtonInner,
                      !cameraReady && styles.shutterButtonInnerDisabled,
                    ]}
                  />
                </TouchableOpacity>

                <View style={{ width: 60 }} />
              </View>
            ) : null
          ) : (
            /* Preview Action Buttons */
            <View style={styles.previewActionBox}>
              <TouchableOpacity
                style={[styles.usePhotoBtn, isUploading && styles.usePhotoBtnDisabled]}
                onPress={handleConfirmPhoto}
                disabled={isUploading}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Gunakan Foto ini sebagai foto profil"
              >
                {isUploading ? (
                  <>
                    <ActivityIndicator size="small" color={colors.textInverse} style={{ marginRight: 8 }} />
                    <Text style={styles.usePhotoBtnText}>Menyimpan Foto...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color={colors.textInverse} style={{ marginRight: 8 }} />
                    <Text style={styles.usePhotoBtnText}>Gunakan Foto</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.previewSecondaryRow}>
                <TouchableOpacity
                  style={[styles.retakeBtn, isUploading && styles.disabledSecondaryBtn]}
                  onPress={handleRetake}
                  disabled={isUploading}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Ambil Ulang Foto"
                >
                  <Ionicons name="camera-reverse" size={18} color={colors.textPrimary} style={{ marginRight: 6 }} />
                  <Text style={styles.retakeBtnText}>Ambil Ulang</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cancelPreviewBtn, isUploading && styles.disabledSecondaryBtn]}
                  onPress={handleCancel}
                  disabled={isUploading}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Batalkan foto"
                >
                  <Text style={styles.cancelPreviewBtnText}>Batal</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark professional camera backdrop
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 20,
    paddingBottom: 16,
    backgroundColor: '#0F172A',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textInverse,
    textAlign: 'center',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  viewfinderWrapper: {
    width: '100%',
    maxWidth: 380,
    aspectRatio: 1,
    minHeight: 280,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cameraFrame: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: '#000000',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  preparingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  preparingText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textInverse,
    fontWeight: '600',
  },
  focusOverlay: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 16,
    borderStyle: 'dashed',
    zIndex: 3,
  },
  permissionDeniedBox: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '90%',
  },
  errorIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textInverse,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 13,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 6,
  },
  errorDescSub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 18,
  },
  retryPermBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  retryPermBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textInverse,
  },
  cancelPermBtn: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelPermBtnText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  previewWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  previewImageContainer: {
    width: 260,
    height: 260,
    borderRadius: 130, // Lingkaran sempurna profil
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.primary,
    backgroundColor: '#000000',
    marginBottom: 18,
    elevation: 4,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  uploadingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  uploadingSubtitle: {
    fontSize: 12,
    color: '#E2E8F0',
    marginTop: 4,
    textAlign: 'center',
  },
  previewHint: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  bottomControls: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: 16,
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  shutterButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  shutterButtonOuterDisabled: {
    opacity: 0.35,
    borderColor: '#94A3B8',
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  shutterButtonInnerDisabled: {
    backgroundColor: '#94A3B8',
  },
  cancelTextBtn: {
    width: 60,
    alignItems: 'center',
  },
  cancelTextBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  previewActionBox: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
  },
  usePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  usePhotoBtnDisabled: {
    opacity: 0.6,
  },
  usePhotoBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textInverse,
  },
  previewSecondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 10,
  },
  retakeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cancelPreviewBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelPreviewBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  disabledSecondaryBtn: {
    opacity: 0.5,
  },
});
