import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { sounds } from '../../utils/soundEffects';

interface PhoneConfirmModalProps {
  visible: boolean;
  formattedPhoneNumber: string;
  flag: string;
  onConfirm: () => void;
  onGoBack: () => void;
}

export const PhoneConfirmModal: React.FC<PhoneConfirmModalProps> = ({
  visible,
  formattedPhoneNumber,
  flag,
  onConfirm,
  onGoBack,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetCard}>
          {/* Centered Phone Number Badge */}
          <View style={styles.phoneBadgeRow}>
            <Text style={styles.flagIcon}>{flag}</Text>
            <Text style={styles.phoneNumberText}>{formattedPhoneNumber}</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.promptTitle}>Is this number correct?</Text>
          <Text style={styles.promptSubtitle}>
            We'll send you a confirmation code there
          </Text>

          {/* Action Buttons */}
          <View style={styles.btnColumn}>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                sounds.playKeyClick();
                onConfirm();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.goBackBtn}
              onPress={() => {
                sounds.playKeyClick();
                onGoBack();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.goBackBtnText}>Go back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sheetCard: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#161c2c',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
  },
  phoneBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  flagIcon: {
    fontSize: 22,
  },
  phoneNumberText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  promptTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  promptSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  btnColumn: {
    width: '100%',
    gap: 10,
  },
  confirmBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  goBackBtn: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});

