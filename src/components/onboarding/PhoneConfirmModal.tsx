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
          <Text style={styles.promptSubtitle}>
            Is this number correct? We’ll send you a confirmation code there
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
    maxWidth: 340,
    backgroundColor: '#2c2c2e',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  phoneBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  flagIcon: {
    fontSize: 24,
  },
  phoneNumberText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  promptSubtitle: {
    color: '#8e8e93',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  btnColumn: {
    width: '100%',
    gap: 12,
  },
  confirmBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#ffffff',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '700',
  },
  goBackBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#3a3a3c',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
});

