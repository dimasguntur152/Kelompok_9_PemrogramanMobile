import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const ResponsiveWrapper = ({ children }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [devicePreset, setDevicePreset] = useState('normal');

  const isWebOrWide = Platform.OS === 'web' && windowWidth > 550;

  // Determine frame width
  let frameWidth = '100%';
  if (isWebOrWide) {
    if (devicePreset === 'small') frameWidth = 360;
    else if (devicePreset === 'normal') frameWidth = 400;
    else if (devicePreset === 'tablet') frameWidth = 720;
    else frameWidth = '100%';
  }

  return (
    <View style={styles.outerContainer}>
      {/* Top Device Toolbar (Shown on Web / Desktop for Responsive Testing) */}
      {isWebOrWide && (
        <View style={styles.topControlBar}>
          <View style={styles.barBrandRow}>
            <View style={styles.barBrandBadge}>
              <Ionicons
                name="storefront"
                size={14}
                color="#FFF"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.barBrandText}>Kedai Tong Djajakarta</Text>
            </View>
            <Text style={styles.barCampusText}>
              GKB 2 Basement • Kampus 3 UMM
            </Text>
          </View>

          {/* Viewport Presets */}
          <View style={styles.presetGroup}>
            <Text style={styles.groupLabel}>Uji Layar:</Text>

            <TouchableOpacity
              style={[
                styles.presetBtn,
                devicePreset === 'small' && styles.presetBtnActive,
              ]}
              onPress={() => setDevicePreset('small')}
              accessibilityRole="button"
              accessibilityLabel="Uji tampilan layar kecil 360px"
            >
              <Ionicons
                name="phone-portrait-outline"
                size={13}
                color={devicePreset === 'small' ? '#FFF' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.presetBtnText,
                  devicePreset === 'small' && styles.presetBtnTextActive,
                ]}
              >
                Kecil (360px)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.presetBtn,
                devicePreset === 'normal' && styles.presetBtnActive,
              ]}
              onPress={() => setDevicePreset('normal')}
              accessibilityRole="button"
              accessibilityLabel="Uji tampilan layar normal 400px"
            >
              <Ionicons
                name="phone-portrait"
                size={13}
                color={devicePreset === 'normal' ? '#FFF' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.presetBtnText,
                  devicePreset === 'normal' && styles.presetBtnTextActive,
                ]}
              >
                Normal (400px)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.presetBtn,
                devicePreset === 'tablet' && styles.presetBtnActive,
              ]}
              onPress={() => setDevicePreset('tablet')}
              accessibilityRole="button"
              accessibilityLabel="Uji tampilan tablet 720px"
            >
              <Ionicons
                name="tablet-portrait"
                size={13}
                color={devicePreset === 'tablet' ? '#FFF' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.presetBtnText,
                  devicePreset === 'tablet' && styles.presetBtnTextActive,
                ]}
              >
                Tablet (720px)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.presetBtn,
                devicePreset === 'full' && styles.presetBtnActive,
              ]}
              onPress={() => setDevicePreset('full')}
              accessibilityRole="button"
              accessibilityLabel="Uji tampilan layar penuh"
            >
              <Ionicons
                name="desktop-outline"
                size={13}
                color={devicePreset === 'full' ? '#FFF' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.presetBtnText,
                  devicePreset === 'full' && styles.presetBtnTextActive,
                ]}
              >
                Penuh (100%)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.customerOnlyBadge}>
            <Text style={styles.customerOnlyText}>Mobile Customer Prototype</Text>
          </View>
        </View>
      )}

      {/* Frame Container simulating clean mobile phone */}
      <View
        style={[
          styles.innerContainer,
          isWebOrWide &&
            devicePreset !== 'full' && {
              width: frameWidth,
              height: Math.min(windowHeight - 64, 880),
              borderRadius: 28,
              overflow: 'hidden',
              borderWidth: 8,
              borderColor: '#292524',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.35,
              shadowRadius: 24,
              elevation: 12,
              marginVertical: 'auto',
            },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#1C1917',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topControlBar: {
    width: '100%',
    backgroundColor: '#0C0A09',
    borderBottomWidth: 1,
    borderBottomColor: '#292524',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    zIndex: 99,
  },
  barBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barBrandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  barBrandText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  barCampusText: {
    color: '#A8A29E',
    fontSize: 11,
    fontWeight: '600',
  },
  presetGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupLabel: {
    color: '#78716C',
    fontSize: 11,
    fontWeight: '700',
  },
  presetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#44403C',
    backgroundColor: '#1C1917',
  },
  presetBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetBtnText: {
    color: '#A8A29E',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  presetBtnTextActive: {
    color: '#FFF',
  },
  customerOnlyBadge: {
    backgroundColor: 'rgba(234, 88, 12, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.4)',
  },
  customerOnlyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FB923C',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },
});
