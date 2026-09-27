import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const OrderTrackScreen = () => {
  const {
    activeOrder,
    advanceOrderStatus,
    setOrderStatusDirect,
    navigateTo,
  } = useApp();

  if (!activeOrder) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Pesanan tidak ditemukan.</Text>
      </View>
    );
  }

  const isDelivery = activeOrder.method === 'Diantar';

  // Timeline definitions based on method
  const deliverySteps = [
    {
      key: 'Menunggu',
      title: 'Menunggu',
      desc: 'Pesanan telah diterima kedai & menunggu antrean dapur',
      icon: 'time-outline',
      activeIcon: 'time',
    },
    {
      key: 'Diproses',
      title: 'Diproses',
      desc: 'Makanan/minuman sedang disiapkan oleh barista & dapur',
      icon: 'flame-outline',
      activeIcon: 'flame',
    },
    {
      key: 'Sedang Diantar',
      title: 'Sedang Diantar',
      desc: 'Kurir kampus sedang menuju ke lokasi ruangan Anda',
      icon: 'bicycle-outline',
      activeIcon: 'bicycle',
    },
    {
      key: 'Selesai',
      title: 'Selesai',
      desc: 'Pesanan telah diterima dengan baik oleh pemesan',
      icon: 'checkmark-done-circle-outline',
      activeIcon: 'checkmark-done-circle',
    },
  ];

  const pickupSteps = [
    {
      key: 'Menunggu',
      title: 'Menunggu',
      desc: 'Pesanan telah diterima kedai & menunggu antrean dapur',
      icon: 'time-outline',
      activeIcon: 'time',
    },
    {
      key: 'Diproses',
      title: 'Diproses',
      desc: 'Makanan/minuman sedang disiapkan di dapur basement',
      icon: 'flame-outline',
      activeIcon: 'flame',
    },
    {
      key: 'Siap Diambil',
      title: 'Siap Diambil',
      desc: 'Pesanan siap diambil di meja kasir Kedai Tong Djajakarta',
      icon: 'storefront-outline',
      activeIcon: 'storefront',
    },
    {
      key: 'Selesai',
      title: 'Selesai',
      desc: 'Pesanan telah diambil oleh pemesan',
      icon: 'checkmark-done-circle-outline',
      activeIcon: 'checkmark-done-circle',
    },
  ];

  const steps = isDelivery ? deliverySteps : pickupSteps;

  const getStepIndex = (statusKey) => {
    return steps.findIndex((s) => s.key === statusKey);
  };

  const currentIndex = getStepIndex(activeOrder.status);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerOrderNum}>
              {activeOrder.orderNumber}
            </Text>
            <Text style={styles.headerMethod}>
              Metode: {activeOrder.method}
            </Text>
          </View>
          <View style={styles.currentStatusBadge}>
            <Text style={styles.currentStatusText}>{activeOrder.status}</Text>
          </View>
        </View>

        {/* Destination Info Box */}
        <View style={styles.destBox}>
          <Ionicons
            name="location-sharp"
            size={18}
            color={colors.primary}
            style={{ marginRight: 8, marginTop: 1 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.destLabel}>
              {isDelivery ? 'Tujuan Pengantaran:' : 'Titik Pengambilan:'}
            </Text>
            <Text style={styles.destAddress}>{activeOrder.location}</Text>
          </View>
        </View>

        {/* Modern Timeline Card */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Status Perjalanan Pesanan</Text>

          <View style={styles.timelineList}>
            {steps.map((step, idx) => {
              const isPassed = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isFuture = idx > currentIndex;

              return (
                <View key={step.key} style={styles.timelineRow}>
                  {/* Left Column: Icon node & connector line */}
                  <View style={styles.nodeColumn}>
                    <View
                      style={[
                        styles.nodeCircle,
                        isCurrent && styles.nodeCircleCurrent,
                        isPassed && styles.nodeCirclePassed,
                        isFuture && styles.nodeCircleFuture,
                      ]}
                    >
                      <Ionicons
                        name={isCurrent ? step.activeIcon : step.icon}
                        size={18}
                        color={
                          isCurrent
                            ? colors.surface
                            : isPassed
                            ? colors.surface
                            : colors.textMuted
                        }
                      />
                    </View>

                    {idx < steps.length - 1 && (
                      <View
                        style={[
                          styles.connectorLine,
                          idx < currentIndex && styles.connectorLinePassed,
                        ]}
                      />
                    )}
                  </View>

                  {/* Right Column: Step Label & Description */}
                  <View
                    style={[
                      styles.stepContentBox,
                      isCurrent && styles.stepContentBoxActive,
                    ]}
                  >
                    <View style={styles.stepTitleRow}>
                      <Text
                        style={[
                          styles.stepTitle,
                          isCurrent && styles.stepTitleCurrent,
                          isPassed && styles.stepTitlePassed,
                        ]}
                      >
                        {step.title}
                      </Text>
                      {isCurrent && (
                        <View style={styles.activePill}>
                          <Text style={styles.activePillText}>Status Aktif</Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stepDesc,
                        isCurrent && styles.stepDescCurrent,
                      ]}
                    >
                      {step.desc}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Prototype Demo Control for Quick Testing Status Progression */}
        <View style={styles.demoCard}>
          <View style={styles.demoHeader}>
            <Ionicons name="play-forward-circle" size={18} color={colors.accent} />
            <Text style={styles.demoTitle}>Simulasi Status Pesanan (Demo)</Text>
          </View>
          <Text style={styles.demoDesc}>
            Gunakan tombol di bawah untuk menguji pergantian status ke tahap berikutnya:
          </Text>

          <View style={styles.demoBtnRow}>
            {steps.map((st) => (
              <TouchableOpacity
                key={st.key}
                style={[
                  styles.demoStepBtn,
                  activeOrder.status === st.key && styles.demoStepBtnActive,
                ]}
                onPress={() => setOrderStatusDirect(activeOrder.id, st.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.demoStepBtnText,
                    activeOrder.status === st.key && styles.demoStepBtnTextActive,
                  ]}
                >
                  {st.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeOrder.status !== 'Selesai' ? (
            <TouchableOpacity
              style={styles.advanceBtn}
              onPress={() => advanceOrderStatus(activeOrder.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.advanceBtnText}>
                Lanjut ke Tahap Berikutnya →
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.advanceBtn, { backgroundColor: '#15803D' }]}
              onPress={() => navigateTo('order_finished')}
              activeOpacity={0.8}
            >
              <Text style={styles.advanceBtnText}>
                Buka Halaman Pesanan Selesai 🎉
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action: "Chat dengan Penjual" */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => navigateTo('order_chat')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Chat dengan Penjual"
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color={colors.surface}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.chatBtnText}>Chat dengan Penjual</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerOrderNum: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerMethod: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  currentStatusBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  currentStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  destBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  destLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  destAddress: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 18,
  },
  timelineList: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 64,
  },
  nodeColumn: {
    alignItems: 'center',
    width: 36,
    marginRight: 12,
  },
  nodeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCircleCurrent: {
    backgroundColor: colors.primary,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  nodeCirclePassed: {
    backgroundColor: '#15803D',
  },
  nodeCircleFuture: {
    backgroundColor: '#F5F5F4',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  connectorLine: {
    flex: 1,
    width: 2.5,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  connectorLinePassed: {
    backgroundColor: '#15803D',
  },
  stepContentBox: {
    flex: 1,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  stepContentBoxActive: {
    backgroundColor: '#FFFBFB',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  stepTitleCurrent: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  stepTitlePassed: {
    fontWeight: '700',
    color: '#15803D',
  },
  activePill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  stepDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  stepDescCurrent: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  demoCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDBA74',
    marginBottom: 16,
    borderStyle: 'dashed',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accentDark,
    marginLeft: 6,
  },
  demoDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  demoBtnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  demoStepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoStepBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  demoStepBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  demoStepBtnTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
  advanceBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  advanceBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.surface,
  },
  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
  },
  chatBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
