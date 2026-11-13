import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { sounds } from '../../utils/soundEffects';
import {
  colors,
  radius,
  space,
  type,
  primaryButton,
  primaryButtonText,
  secondaryButton,
  secondaryButtonText,
} from '../../theme';

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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetCard}>
          <View style={styles.phoneBadgeRow}>
            <Text style={styles.flagIcon}>{flag}</Text>
            <Text style={styles.phoneNumberText}>{formattedPhoneNumber}</Text>
          </View>

          <Text style={styles.promptSubtitle}>
            Is this number correct? We'll send your confirmation code there.
          </Text>

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
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space.xxl,
  },
  sheetCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.sheet,
    borderRadius: radius.sheet,
    padding: space.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  phoneBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.md,
    gap: space.sm,
  },
  flagIcon: {
    fontSize: 24,
  },
  phoneNumberText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  promptSubtitle: {
    ...type.body,
    textAlign: 'center',
    marginBottom: space.xxl,
    paddingHorizontal: space.sm,
  },
  btnColumn: {
    width: '100%',
    gap: space.md,
  },
  confirmBtn: {
    ...primaryButton,
    width: '100%',
  },
  confirmBtnText: {
    ...primaryButtonText,
    fontSize: 17,
  },
  goBackBtn: {
    ...secondaryButton,
    width: '100%',
    height: 54,
  },
  goBackBtnText: {
    ...secondaryButtonText,
    fontSize: 17,
  },
});
