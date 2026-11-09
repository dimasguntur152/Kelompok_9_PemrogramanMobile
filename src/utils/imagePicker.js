import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const pickImageFromGallery = async () => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Izin Galeri Diperlukan',
        'Izinkan akses galeri untuk memilih gambar.'
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    return result.canceled ? null : result.assets?.[0]?.uri ?? null;
  } catch {
    Alert.alert('Galeri Tidak Dapat Dibuka', 'Silakan coba lagi.');
    return null;
  }
};