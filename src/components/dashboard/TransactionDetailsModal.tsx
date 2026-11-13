import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X, CheckCircle2, Copy, Check, ArrowRight } from 'lucide-react-native';
import { TransactionRecord } from '../../types';
import { sounds } from '../../utils/soundEffects';
import {
  colors,
  radius,
  space,
  type,
  primaryButton,
  primaryButtonText,
} from '../../theme';

interface TransactionDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  transaction: TransactionRecord | null;
  onRepeatPayment?: (tx: TransactionRecord) => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  visible,
  onClose,
  transaction,
  onRepeatPayment,
}) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const mockTxHash = transaction.txHash || '0x8f2a9c148e214d9b9c0428e19c0147289f81a721';
  const isReceived = transaction.type === 'received';

  const handleCopyHash = () => {
    sounds.playKeyClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <View style={styles.dragPill} />

          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Receipt</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.statusBanner}>
            <CheckCircle2 size={32} color={colors.positive} />
            <Text style={styles.statusTitle}>
              {isReceived ? 'Payment received' : 'Payment sent'}
            </Text>
            <Text style={styles.timestampText}>{transaction.timestamp}</Text>
          </View>

          <View style={styles.amountBox}>
            <Text style={[styles.cryptoAmount, isReceived && { color: colors.positive }]}>
              {isReceived ? '+' : '-'}
              {transaction.amount} {transaction.currency}
            </Text>
            <Text style={styles.fiatAmount}>≈ ${transaction.fiatAmount.toFixed(2)} USD</Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{isReceived ? 'From' : 'To'}</Text>
              <Text style={styles.detailVal}>{transaction.title}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Details</Text>
              <Text style={styles.detailVal}>{transaction.subtitle}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction hash</Text>
              <TouchableOpacity style={styles.hashBtn} onPress={handleCopyHash}>
                <Text style={styles.hashText} numberOfLines={1}>
                  {mockTxHash.slice(0, 10)}…{mockTxHash.slice(-6)}
                </Text>
                {copied ? (
                  <Check size={12} color={colors.positive} />
                ) : (
                  <Copy size={12} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Network fee</Text>
              <Text style={styles.detailVal}>$0.08 USD</Text>
            </View>
          </View>

          {onRepeatPayment && (
            <TouchableOpacity
              style={styles.repeatBtn}
              onPress={() => {
                sounds.playKeyClick();
                onRepeatPayment(transaction);
                onClose();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.repeatBtnText}>Repeat payment</Text>
              <ArrowRight size={16} color={colors.onLight} />
            </TouchableOpacity>
          )}
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
  container: {
    backgroundColor: colors.sheet,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: space.md,
    paddingHorizontal: space.xl,
    paddingBottom: space.xxl,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.lg,
  },
  headerTitle: {
    ...type.sheetTitle,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBanner: {
    alignItems: 'center',
    marginBottom: space.lg,
    gap: space.xs,
  },
  statusTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  timestampText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  amountBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: space.lg,
    marginBottom: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cryptoAmount: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  fiatAmount: {
    ...type.body,
    fontSize: 14,
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
    marginBottom: space.xl,
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
  },
  detailVal: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 180,
    textAlign: 'right',
  },
  hashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.xs,
  },
  hashText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  repeatBtn: {
    ...primaryButton,
    flexDirection: 'row',
    gap: space.sm,
  },
  repeatBtnText: {
    ...primaryButtonText,
    fontSize: 15,
  },
});
