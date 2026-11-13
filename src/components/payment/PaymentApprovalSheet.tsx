import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ShieldCheck, Check, Fingerprint } from 'lucide-react-native';
import { PaymentRequest } from '../../types';
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

interface PaymentApprovalSheetProps {
  visible: boolean;
  paymentRequest: PaymentRequest | null;
  onApprove: (request: PaymentRequest) => void;
  onReject: () => void;
}

export const PaymentApprovalSheet: React.FC<PaymentApprovalSheetProps> = ({
  visible,
  paymentRequest,
  onApprove,
  onReject,
}) => {
  const [isApproving, setIsApproving] = useState(false);

  if (!paymentRequest) return null;

  const handleConfirm = () => {
    sounds.playKeyClick();
    setIsApproving(true);
    setTimeout(() => {
      sounds.playSuccessChime();
      setIsApproving(false);
      onApprove(paymentRequest);
    }, 1200);
  };

  const { destination, amount, currency, fiatEquivalent, networkFeeUsd, agentAnalysis } =
    paymentRequest;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragPill} />

          <View style={styles.badge}>
            <ShieldCheck size={14} color={colors.positive} />
            <Text style={styles.badgeText}>Review and authorize</Text>
          </View>

          <View style={styles.amountDisplayContainer}>
            <Text style={styles.cryptoAmountText}>
              {amount} {currency}
            </Text>
            <Text style={styles.fiatAmountText}>
              ≈ ${fiatEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recipient</Text>
              <View style={styles.recipientBadge}>
                <Text style={styles.recipientName}>
                  {destination.resolvedName || destination.accountNumber || 'Wallet address'}
                </Text>
                {destination.isVerifiedMerchant && (
                  <View style={styles.verifiedCheck}>
                    <Check size={10} color={colors.onLight} strokeWidth={3} />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {destination.resolvedAddress || destination.accountNumber || destination.rawInput}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Network</Text>
              <Text style={styles.detailValue}>{destination.network || 'Optimal route'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Network fee</Text>
              <Text style={styles.detailValue}>${networkFeeUsd.toFixed(2)} USD</Text>
            </View>
          </View>

          <View style={styles.safetyReportBox}>
            <ShieldCheck size={18} color={colors.positive} />
            <View style={styles.safetyTextWrap}>
              <Text style={styles.safetyTitle}>Recipient checked</Text>
              <Text style={styles.safetyDesc}>
                {agentAnalysis.safetySummary || 'No known fraud or sanctions matches detected.'}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtonsCol}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={handleConfirm}
              disabled={isApproving}
              activeOpacity={0.85}
            >
              {isApproving ? (
                <View style={styles.approvingRow}>
                  <ActivityIndicator color={colors.onLight} />
                  <Text style={styles.approvingText}>Sending payment…</Text>
                </View>
              ) : (
                <View style={styles.buttonContentRow}>
                  <Fingerprint size={20} color={colors.onLight} />
                  <Text style={styles.approveButtonText}>Authorize payment</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                sounds.playKeyClick();
                onReject();
              }}
              disabled={isApproving}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.sheet,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: space.md,
    paddingHorizontal: space.xl,
    paddingBottom: space.xxxl,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  dragPill: {
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginBottom: space.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    backgroundColor: colors.surface,
    alignSelf: 'center',
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.lg,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  amountDisplayContainer: {
    alignItems: 'center',
    marginBottom: space.xl,
  },
  cryptoAmountText: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  fiatAmountText: {
    ...type.body,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space.md,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  recipientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  recipientName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  verifiedCheck: {
    width: 14,
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.positive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: 'monospace',
    maxWidth: 180,
  },
  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  safetyReportBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.positiveSoft,
    borderRadius: radius.md,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.positiveBorder,
    marginBottom: space.xxl,
  },
  safetyTextWrap: {
    flex: 1,
  },
  safetyTitle: {
    color: colors.positive,
    fontSize: 13,
    fontWeight: '700',
  },
  safetyDesc: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  actionButtonsCol: {
    gap: space.sm,
  },
  approveButton: {
    ...primaryButton,
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  approveButtonText: {
    ...primaryButtonText,
  },
  approvingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  approvingText: {
    ...primaryButtonText,
    fontSize: 15,
  },
  cancelButton: {
    ...secondaryButton,
    height: 48,
  },
  cancelButtonText: {
    ...secondaryButtonText,
  },
});
