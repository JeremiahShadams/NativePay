import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X, QrCode } from 'lucide-react-native';
import { PaymentDestination } from '../../types';
import { sounds } from '../../utils/soundEffects';
import { colors, radius, space, type } from '../../theme';

interface QrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onQrDetected: (destination: PaymentDestination, amount?: number, currency?: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  visible,
  onClose,
  onQrDetected,
}) => {
  const sampleQrs = [
    {
      id: 'qr-1',
      title: 'Blue Bottle Coffee',
      tag: 'USDC payment request',
      destination: {
        type: 'qr_code' as const,
        rawInput:
          'solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU?amount=4.50&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        resolvedName: 'Blue Bottle Coffee Roasters',
        resolvedAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        network: 'Solana',
        riskScore: 'low' as const,
        isVerifiedMerchant: true,
      },
      amount: 4.5,
      currency: 'USDC',
    },
    {
      id: 'qr-2',
      title: 'Alice (@alice.eth)',
      tag: 'ETH invoice · lunch share',
      destination: {
        type: 'qr_code' as const,
        rawInput: 'ethereum:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045?value=0.15e18',
        resolvedName: 'Alice (@alice.eth)',
        resolvedAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        network: 'Arbitrum One',
        riskScore: 'low' as const,
        isVerifiedMerchant: false,
      },
      amount: 0.15,
      currency: 'ETH',
    },
    {
      id: 'qr-3',
      title: 'Swiss QR-Bill',
      tag: 'Bank transfer · CHF 1,200',
      destination: {
        type: 'qr_code' as const,
        rawInput: 'SPC:CH4209000000123456789:NativeFintechAG',
        resolvedName: 'Native Technologies AG',
        accountNumber: 'CH42 0900 0000 1234 5678 9',
        network: 'SEPA Instant / Swiss QR',
        riskScore: 'low' as const,
        isVerifiedMerchant: true,
      },
      amount: 1200,
      currency: 'USD',
    },
  ];

  const handleSelectPreset = (sample: typeof sampleQrs[0]) => {
    sounds.playScanBeep();
    onQrDetected(sample.destination, sample.amount, sample.currency);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <X size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan QR code</Text>
            <View style={styles.iconBtn}>
              <QrCode size={18} color={colors.textSecondary} />
            </View>
          </View>

          <View style={styles.viewfinderContainer}>
            <View style={styles.viewfinderFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              <View style={styles.centerGuidance}>
                <QrCode size={40} color={colors.textMuted} />
                <Text style={styles.guidanceText}>Align the code within the frame</Text>
              </View>
            </View>

            <Text style={styles.subGuidanceText}>
              We'll verify the recipient before anything is sent.
            </Text>
          </View>

          <View style={styles.presetsSection}>
            <Text style={styles.presetsTitle}>Sample invoices</Text>

            <View style={styles.presetsList}>
              {sampleQrs.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.presetItem}
                  onPress={() => handleSelectPreset(s)}
                  activeOpacity={0.7}
                >
                  <View style={styles.presetIcon}>
                    <QrCode size={18} color={colors.textSecondary} />
                  </View>
                  <View style={styles.presetInfo}>
                    <Text style={styles.presetName}>{s.title}</Text>
                    <Text style={styles.presetTag}>{s.tag}</Text>
                  </View>
                  <Text style={styles.presetAmount}>
                    {s.amount} {s.currency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: space.xxl,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...type.sectionTitle,
    fontSize: 17,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: space.md,
  },
  viewfinderFrame: {
    width: 240,
    height: 240,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceSunken,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: colors.textSecondary,
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: radius.sm,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: radius.sm,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: radius.sm,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: radius.sm,
  },
  centerGuidance: {
    alignItems: 'center',
    gap: space.sm,
  },
  guidanceText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  subGuidanceText: {
    ...type.caption,
    marginTop: space.lg,
    textAlign: 'center',
  },
  presetsSection: {
    backgroundColor: colors.sheet,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetsTitle: {
    ...type.overline,
    marginBottom: space.md,
  },
  presetsList: {
    gap: space.sm,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: space.md,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  presetTag: {
    ...type.caption,
    fontSize: 11,
  },
  presetAmount: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
});
