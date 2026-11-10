import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react';
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
    backgroundColor: '#161c2c',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dragPill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 20,
  },
  errorIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  errorSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  gotItBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gotItBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});

