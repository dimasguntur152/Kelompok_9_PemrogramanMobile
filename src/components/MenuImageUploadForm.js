import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../services/menuService';
import { getItem } from '../services/secureStoreService';
import { pickImageFromGallery } from '../utils/imagePicker';

export const uploadMenuImage = async ({ uri, menuName }) => {
  const formData = new FormData();
  formData.append('menuName', menuName.trim());

  const extension = uri.split('?')[0].split('.').pop()?.toLowerCase();
  const mimeType = extension === 'png'
    ? 'image/png'
    : extension === 'webp'
      ? 'image/webp'
      : 'image/jpeg';
  const fileName = `menu-image.${mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg'}`;

  if (Platform.OS === 'web') {
    const imageResponse = await fetch(uri);
    if (!imageResponse.ok) throw new Error('Gambar tidak dapat dibaca.');
    formData.append('foto', await imageResponse.blob(), fileName);
  } else {
    formData.append('foto', { uri, name: fileName, type: mimeType });
  }

  const token = await getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/api/upload-foto`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Gagal mengunggah gambar menu.');
  }

  return result;
};

export const MenuImageUploadForm = ({ initialMenuName = '', onUploadComplete }) => {
  const [menuName, setMenuName] = useState(initialMenuName);
  const [imageUri, setImageUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePickImage = async () => {
    setError('');
    setMessage('');
    const uri = await pickImageFromGallery();
    if (uri) setImageUri(uri);
  };

  const handleUpload = async () => {
    if (!menuName.trim() || !imageUri) {
      setError('Isi nama menu dan pilih gambar terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    setError('');
    setMessage('');
    try {
      const result = await uploadMenuImage({ uri: imageUri, menuName });
      setMessage('Gambar menu berhasil diunggah.');
      onUploadComplete?.(result);
    } catch (uploadError) {
      setError(uploadError.message || 'Gagal mengunggah gambar menu.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nama Menu</Text>
      <TextInput
        style={styles.input}
        value={menuName}
        onChangeText={setMenuName}
        placeholder="Nama menu yang sudah terdaftar"
        placeholderTextColor="#78716C"
        editable={!isUploading}
      />

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handlePickImage}
        disabled={isUploading}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <Ionicons name="images-outline" size={18} color="#901A1E" />
        <Text style={styles.secondaryButtonText}>Pilih Gambar dari Galeri</Text>
      </TouchableOpacity>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
      ) : null}

      <TouchableOpacity
        style={[styles.uploadButton, isUploading && styles.disabledButton]}
        onPress={handleUpload}
        disabled={isUploading}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        {isUploading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.uploadButtonText}>Unggah Gambar</Text>
        )}
      </TouchableOpacity>

      {message ? <Text style={styles.successText}>{message}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    color: '#1C1917',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#1C1917',
    paddingHorizontal: 12,
    minHeight: 46,
  },
  secondaryButton: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#901A1E',
    fontSize: 14,
    fontWeight: '700',
  },
  preview: {
    width: '100%',
    height: 190,
    borderRadius: 14,
    backgroundColor: '#F5EFE6',
  },
  uploadButton: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: '#901A1E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  disabledButton: {
    opacity: 0.65,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successText: {
    color: '#166534',
    fontSize: 13,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
  },
});