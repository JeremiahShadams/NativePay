import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';
import {
  colors,
  radius,
  space,
  type,
  primaryButton,
  primaryButtonText,
} from '../../theme';

interface OtpErrorModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export const OtpErrorModal: React.FC<OtpErrorModalProps> = ({ visible, onDismiss }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetCard}>
          <View style={styles.dragPill} />

          <View style={styles.errorIconCircle}>
            <X size={22} color={colors.negative} strokeWidth={2.5} />
          </View>

          <Text style={styles.errorTitle}>Incorrect code</Text>
          <Text style={styles.errorSubtitle}>Check the code and try again.</Text>

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
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: colors.sheet,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: space.md,
    paddingHorizontal: space.xl,
    paddingBottom: space.xxxl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  dragPill: {
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
    marginBottom: space.xxl,
  },
  errorIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.negativeSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: space.lg,
  },
  errorTitle: {
    ...type.sheetTitle,
    fontSize: 22,
    marginBottom: space.sm,
    textAlign: 'center',
  },
  errorSubtitle: {
    ...type.body,
    textAlign: 'center',
    marginBottom: space.xxl,
  },
  gotItBtn: {
    ...primaryButton,
    width: '100%',
    height: 54,
  },
  gotItBtnText: {
    ...primaryButtonText,
    fontSize: 17,
  },
});
