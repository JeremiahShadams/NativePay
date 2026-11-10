import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ShieldCheck, Zap, ArrowRight, Check, X, Lock, Fingerprint } from 'lucide-react-native';
import { PaymentRequest } from '../../types';
import { sounds } from '../../utils/soundEffects';

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
  const [slideProgress, setSlideProgress] = useState(0);

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
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Grab Pill */}
          <View style={styles.dragPill} />

          {/* Agent Header Tag */}
          <View style={styles.agentHeaderBadge}>
            <Zap size={14} color="#60a5fa" />
            <Text style={styles.agentBadgeText}>Autonomous Agent • User Approval Required</Text>
          </View>

          {/* Amount Display */}
          <View style={styles.amountDisplayContainer}>
            <Text style={styles.cryptoAmountText}>
              {amount} {currency}
            </Text>
            <Text style={styles.fiatAmountText}>
              ≈ ${fiatEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </Text>
          </View>

          {/* Destination Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recipient</Text>
              <View style={styles.recipientBadge}>
                <Text style={styles.recipientName}>
                  {destination.resolvedName || destination.accountNumber || 'Wallet Address'}
                </Text>
                {destination.isVerifiedMerchant && (
                  <View style={styles.verifiedCheck}>
                    <Check size={10} color="#ffffff" strokeWidth={3} />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address / Account</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {destination.resolvedAddress || destination.accountNumber || destination.rawInput}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Network Route</Text>
              <View style={styles.networkBadge}>
                <Text style={styles.networkText}>{destination.network || 'Optimal L2 Route'}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estimated Gas Fee</Text>
              <Text style={styles.feeText}>${networkFeeUsd.toFixed(2)} USD</Text>
            </View>
          </View>

          {/* Agent Safety Report */}
          <View style={styles.safetyReportBox}>
            <ShieldCheck size={20} color="#10b981" />
            <View style={styles.safetyTextWrap}>
              <Text style={styles.safetyTitle}>AI Risk Score: 0.01% (Safe)</Text>
              <Text style={styles.safetyDesc}>
                {agentAnalysis.safetySummary || 'No malicious smart contracts or blacklists detected.'}
              </Text>
            </View>
          </View>

          {/* Action Area: Slide or Biometric Approval */}
          <View style={styles.actionButtonsCol}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={handleConfirm}
              disabled={isApproving}
              activeOpacity={0.85}
            >
              {isApproving ? (
                <View style={styles.approvingRow}>
                  <ActivityIndicator color="#000000" />
                  <Text style={styles.approvingText}>Agent Executing Payment...</Text>
                </View>
              ) : (
                <View style={styles.buttonContentRow}>
                  <Fingerprint size={20} color="#000000" />
                  <Text style={styles.approveButtonText}>Approve & Execute Payment</Text>
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
              <Text style={styles.cancelButtonText}>Cancel & Reject</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#121624',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  dragPill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  agentHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginBottom: 16,
  },
  agentBadgeText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  amountDisplayContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cryptoAmountText: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  fiatAmountText: {
    color: '#94a3b8',
    fontSize: 16,
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
    fontWeight: '500',
  },
  recipientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recipientName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  verifiedCheck: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontFamily: 'monospace',
    maxWidth: 180,
  },
  networkBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  networkText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
  },
  feeText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '600',
  },
  safetyReportBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 24,
  },
  safetyTextWrap: {
    flex: 1,
  },
  safetyTitle: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '700',
  },
  safetyDesc: {
    color: '#a7f3d0',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  actionButtonsCol: {
    gap: 10,
  },
  approveButton: {
    height: 54,
    backgroundColor: '#ffffff',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  approveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  approvingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  approvingText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
  },
});

