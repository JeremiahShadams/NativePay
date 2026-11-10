import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X, CheckCircle2, Copy, Check, ExternalLink, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { TransactionRecord } from '../../types';
import { sounds } from '../../utils/soundEffects';

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

  const handleCopyHash = () => {
    sounds.playKeyClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Grab Pill */}
          <View style={styles.dragPill} />

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Transaction Receipt</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Success Check Banner */}
          <View style={styles.statusBanner}>
            <View style={styles.checkCircle}>
              <CheckCircle2 size={32} color="#10b981" />
            </View>
            <Text style={styles.statusTitle}>Payment Completed</Text>
            <Text style={styles.timestampText}>{transaction.timestamp}</Text>
          </View>

          {/* Amount Large Display */}
          <View style={styles.amountBox}>
            <Text
              style={[
                styles.cryptoAmount,
                { color: transaction.type === 'received' ? '#10b981' : '#ffffff' },
              ]}
            >
              {transaction.type === 'received' ? '+' : '-'}
              {transaction.amount} {transaction.currency}
            </Text>
            <Text style={styles.fiatAmount}>
              ≈ ${transaction.fiatAmount.toFixed(2)} USD
            </Text>
          </View>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recipient / Subject</Text>
              <Text style={styles.detailVal}>{transaction.title}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Agent Routing</Text>
              <Text style={styles.detailVal}>{transaction.subtitle}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction Hash</Text>
              <TouchableOpacity style={styles.hashBtn} onPress={handleCopyHash}>
                <Text style={styles.hashText} numberOfLines={1}>
                  {mockTxHash.slice(0, 10)}...{mockTxHash.slice(-6)}
                </Text>
                {copied ? (
                  <Check size={12} color="#10b981" />
                ) : (
                  <Copy size={12} color="#60a5fa" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Network Fee</Text>
              <Text style={[styles.detailVal, { color: '#10b981' }]}>$0.08 USD</Text>
            </View>
          </View>

          {/* Security Verification Box */}
          <View style={styles.securityBox}>
            <ShieldCheck size={18} color="#10b981" />
            <Text style={styles.securityText}>
              Autonomous Agent verified counterparty address. 0 malicious signatures.
            </Text>
          </View>

          {/* Repeat Payment Button */}
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
              <Zap size={16} color="#000000" />
              <Text style={styles.repeatBtnText}>Repeat Payment with AI Agent</Text>
              <ArrowRight size={16} color="#000000" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0c0f18',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dragPill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBanner: {
    alignItems: 'center',
    marginBottom: 16,
  },
  checkCircle: {
    marginBottom: 8,
  },
  statusTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  timestampText: {
    color: '#64748b',
    fontSize: 12,
  },
  amountBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    paddingVertical: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cryptoAmount: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  fiatAmount: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  detailVal: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 180,
  },
  hashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hashText: {
    color: '#60a5fa',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 20,
  },
  securityText: {
    color: '#a7f3d0',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  repeatBtn: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  repeatBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
});
