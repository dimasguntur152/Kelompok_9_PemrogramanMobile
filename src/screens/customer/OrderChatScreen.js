import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const OrderChatScreen = () => {
  const { activeOrder, sendChatMessage } = useApp();
  const [inputText, setInputText] = useState('');

  if (!activeOrder) {
    return null;
  }

  const messages = activeOrder.chatMessages || [
    {
      id: 'default_1',
      sender: 'customer',
      text: 'Halo kak, pesanan saya sedang diantar ke GKB 2 lantai 5.',
      time: '10:20',
    },
    {
      id: 'default_2',
      sender: 'seller',
      text: 'Baik kak, pesanan sedang kami antar.',
      time: '10:22',
    },
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendChatMessage(activeOrder.id, inputText);
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Banner with Merchant Info */}
      <View style={styles.topInfoBar}>
        <View style={styles.avatarBox}>
          <Ionicons name="storefront" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.merchantName}>Kedai Tong Djajakarta</Text>
          <Text style={styles.statusOnline}>
            Dapur GKB 2 Basement • Online
          </Text>
        </View>
        <View style={styles.orderBadge}>
          <Text style={styles.orderBadgeText}>{activeOrder.orderNumber}</Text>
        </View>
      </View>

      {/* Messages List */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateStampWrapper}>
          <Text style={styles.dateStampText}>Hari ini</Text>
        </View>

        {messages.map((msg) => {
          const isCustomer = msg.sender === 'customer';
          return (
            <View
              key={msg.id}
              style={[
                styles.bubbleRow,
                isCustomer ? styles.bubbleRowCustomer : styles.bubbleRowSeller,
              ]}
            >
              <View
                style={[
                  styles.bubbleBox,
                  isCustomer
                    ? styles.bubbleCustomer
                    : styles.bubbleSeller,
                ]}
              >
                <Text
                  style={[
                    styles.senderRole,
                    isCustomer
                      ? styles.senderRoleCustomer
                      : styles.senderRoleSeller,
                  ]}
                >
                  {isCustomer ? 'Kamu' : 'Penjual (Kedai Tong Djajakarta)'}
                </Text>
                <Text
                  style={[
                    styles.messageText,
                    isCustomer
                      ? styles.messageTextCustomer
                      : styles.messageTextSeller,
                  ]}
                >
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    isCustomer
                      ? styles.messageTimeCustomer
                      : styles.messageTimeSeller,
                  ]}
                >
                  {msg.time || '10:20'}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Tulis pesan..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline={false}
          accessibilityLabel="Tulis pesan chat"
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            !inputText.trim() && styles.sendBtnDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Kirim pesan"
        >
          <Ionicons
            name="send"
            size={18}
            color={inputText.trim() ? colors.surface : colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusOnline: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '500',
  },
  orderBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  dateStampWrapper: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateStampText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bubbleRowCustomer: {
    justifyContent: 'flex-end',
  },
  bubbleRowSeller: {
    justifyContent: 'flex-start',
  },
  bubbleBox: {
    maxWidth: '82%',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleCustomer: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  bubbleSeller: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderBottomLeftRadius: 2,
    elevation: 1,
  },
  senderRole: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 3,
  },
  senderRoleCustomer: {
    color: '#FED7D7',
  },
  senderRoleSeller: {
    color: colors.primary,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextCustomer: {
    color: colors.surface,
  },
  messageTextSeller: {
    color: colors.textPrimary,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeCustomer: {
    color: '#FCA5A5',
  },
  messageTimeSeller: {
    color: colors.textMuted,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    maxHeight: 90,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#F5F5F4',
  },
});
