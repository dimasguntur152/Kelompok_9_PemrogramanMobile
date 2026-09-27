import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomTab } from './components/BottomTab';
import { ResponsiveWrapper } from './components/ResponsiveWrapper';

// Customer Screens
import { HomeScreen } from './screens/customer/HomeScreen';
import { MenuScreen } from './screens/customer/MenuScreen';
import { CartScreen } from './screens/customer/CartScreen';
import { CheckoutScreen } from './screens/customer/CheckoutScreen';
import { PaymentScreen } from './screens/customer/PaymentScreen';
import { OrderSuccessScreen } from './screens/customer/OrderSuccessScreen';
import { OrderDetailScreen } from './screens/customer/OrderDetailScreen';
import { OrderTrackScreen } from './screens/customer/OrderTrackScreen';
import { OrderChatScreen } from './screens/customer/OrderChatScreen';
import { OrderFinishedScreen } from './screens/customer/OrderFinishedScreen';
import { ActivityScreen } from './screens/customer/ActivityScreen';
import { ProfileScreen } from './screens/customer/ProfileScreen';

import { colors } from './theme/colors';

export const AppRoot = () => {
  const { currentScreen, activeOrder } = useApp();

  const getScreenConfig = () => {
    switch (currentScreen) {
      case 'beranda':
        return {
          title: 'Tong Djajakarta',
          isHomeHeader: true,
          showHeader: true,
          showBottomTab: true,
          Component: HomeScreen,
        };
      case 'aktivitas':
        return {
          title: 'Aktivitas',
          subtitle: 'Riwayat Pesanan Kedai Tong Djajakarta',
          showBack: false,
          showHeader: true,
          showBottomTab: true,
          Component: ActivityScreen,
        };
      case 'profil':
        return {
          title: 'Profil',
          subtitle: 'Informasi Akun Civitas Kampus 3 UMM',
          showBack: false,
          showHeader: true,
          showBottomTab: true,
          Component: ProfileScreen,
        };
      case 'menu':
        return {
          title: 'Menu',
          subtitle: 'Pilihan menu Tong Djajakarta untuk aktivitasmu',
          showBack: true,
          showHeader: true,
          showBottomTab: false,
          Component: MenuScreen,
        };
      case 'cart':
        return {
          title: 'Keranjang',
          subtitle: 'Periksa & atur jumlah menu pesanan',
          showBack: true,
          showHeader: true,
          showBottomTab: false,
          Component: CartScreen,
        };
      case 'checkout':
        return {
          title: 'Checkout',
          subtitle: 'Pilih metode penerimaan & lokasi pengantaran',
          showBack: true,
          showHeader: true,
          showBottomTab: false,
          Component: CheckoutScreen,
        };
      case 'payment':
        return {
          title: 'Pembayaran',
          subtitle: 'Selesaikan transaksi dengan scan QRIS resmi',
          showBack: true,
          showHeader: true,
          showBottomTab: false,
          Component: PaymentScreen,
        };
      case 'order_success':
        return {
          title: 'Pesanan Berhasil',
          showBack: false,
          showHeader: true,
          showBottomTab: false,
          Component: OrderSuccessScreen,
        };
      case 'order_detail':
        return {
          title: 'Detail Pesanan',
          subtitle: activeOrder?.orderNumber || '#TDJ-001',
          showBack: true,
          showHeader: true,
          showBottomTab: false,
          Component: OrderDetailScreen,
        };
      case 'order_track':
        return {
          title: 'Lacak Pesanan',
          subtitle: activeOrder?.orderNumber || '#TDJ-001',
          showBack: true,
          showHeader: true,
          showBottomTab: false,
          Component: OrderTrackScreen,
        };
      case 'order_chat':
        return {
          title: `Chat Pesanan ${activeOrder?.orderNumber || '#TDJ-001'}`,
          subtitle: 'Komunikasi langsung dengan dapur kedai',
          showBack: true,
          showHeader: true,
          showBottomTab: false,
          Component: OrderChatScreen,
        };
      case 'order_finished':
        return {
          title: 'Pesanan Selesai',
          showBack: false,
          showHeader: true,
          showBottomTab: false,
          Component: OrderFinishedScreen,
        };
      default:
        return {
          title: 'Tong Djajakarta',
          isHomeHeader: true,
          showHeader: true,
          showBottomTab: true,
          Component: HomeScreen,
        };
    }
  };

  const {
    title,
    subtitle,
    showBack,
    isHomeHeader,
    showHeader,
    showBottomTab,
    Component,
  } = getScreenConfig();

  return (
    <ResponsiveWrapper>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
          backgroundColor={colors.surface}
        />

        <View style={styles.screenContainer}>
          {showHeader && (
            <Header
              title={title}
              subtitle={subtitle}
              showBack={showBack}
              isHomeHeader={isHomeHeader}
            />
          )}

          <View style={styles.contentArea}>
            <Component />
          </View>

          {showBottomTab && <BottomTab />}
        </View>
      </SafeAreaView>
    </ResponsiveWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentArea: {
    flex: 1,
  },
});
