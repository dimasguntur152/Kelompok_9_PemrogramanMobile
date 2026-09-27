import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const BottomTab = () => {
  const { activeTab, switchTab } = useApp();

  const tabs = [
    {
      id: 'beranda',
      label: 'Beranda',
      activeIcon: 'home',
      inactiveIcon: 'home-outline',
    },
    {
      id: 'aktivitas',
      label: 'Aktivitas',
      activeIcon: 'receipt',
      inactiveIcon: 'receipt-outline',
    },
    {
      id: 'profil',
      label: 'Profil',
      activeIcon: 'person',
      inactiveIcon: 'person-outline',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconName = isActive ? tab.activeIcon : tab.inactiveIcon;
        const iconColor = isActive ? colors.primary : colors.textMuted;
        const textColor = isActive ? colors.primary : colors.textMuted;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => switchTab(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Menu ${tab.label}`}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={22} color={iconColor} />
              {isActive && <View style={styles.activePill} />}
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: textColor, fontWeight: isActive ? '700' : '500' },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 76 : 64,
    paddingBottom: Platform.OS === 'ios' ? 16 : 6,
    paddingTop: 8,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    position: 'absolute',
    bottom: -4,
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 5,
    letterSpacing: 0.2,
  },
});
