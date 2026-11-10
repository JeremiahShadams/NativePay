import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';

interface OtpErrorModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export const OtpErrorModal: React.FC<OtpErrorModalProps> = ({ visible, onDismiss }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetCard}>
          {/* Grab Pill */}
          <View style={styles.dragPill} />

          {/* Red X Icon Circle */}
          <View style={styles.errorIconCircle}>
            <X size={26} color="#ef4444" strokeWidth={3} />
          </View>

          {/* Message */}
          <Text style={styles.errorTitle}>Incorrect code entered</Text>
          <Text style={styles.errorSubtitle}>
            Please check the code and try again
          </Text>

          {/* Got it Button */}
          <TouchableOpacity
            style={styles.gotItBtn}
            onPress={() => {
              sounds.playKeyClick();
              onDismiss();
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.gotItBtnText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: '#2c2c2e',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  dragPill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 24,
  },
  errorIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  errorSubtitle: {
    color: '#8e8e93',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 28,
  },
  gotItBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#ffffff',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gotItBtnText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '700',
  },
});

