import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, QrCode, Wallet, Check, ShieldCheck } from 'lucide-react-native';
import { PaymentDestination, PaymentRequest, CryptoAsset } from '../../types';
import { QrScannerModal } from './QrScannerModal';
import { PaymentApprovalSheet } from './PaymentApprovalSheet';
import { sounds } from '../../utils/soundEffects';
import {
  colors,
  radius,
  space,
  type,
  primaryButton,
  primaryButtonText,
  disabledButton,
  disabledButtonText,
} from '../../theme';

interface PaymentHubModalProps {
  visible: boolean;
  onClose: () => void;
  cryptoAssets: CryptoAsset[];
  onExecutePayment: (payment: PaymentRequest) => void;
}

export const PaymentHubModal: React.FC<PaymentHubModalProps> = ({
  visible,
  onClose,
  cryptoAssets,
  onExecutePayment,
}) => {
  const [activeTab, setActiveTab] = useState<'address' | 'qr'>('address');
  const [recipientInput, setRecipientInput] = useState('');
  const [amountInput, setAmountInput] = useState('0.25');
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [showScanner, setShowScanner] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [approvalRequest, setApprovalRequest] = useState<PaymentRequest | null>(null);

  const savedRecipients = [
    {
      label: 'vitalik.eth',
      val: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      currency: 'ETH',
      amount: '0.25',
    },
    {
      label: 'Solana treasury',
      val: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      currency: 'SOL',
      amount: '2.5',
    },
    {
      label: 'Bank account',
      val: 'US64SVBK0123456789',
      currency: 'USDC',
      amount: '500',
    },
    {
      label: '@coffee_roasters',
      val: '@coffee_roasters',
      currency: 'NAT',
      amount: '45',
    },
  ];

  const detectRecipientType = (input: string) => {
    const trimmed = input.trim();
    if (trimmed.startsWith('0x') && trimmed.length === 42) {
      return { type: 'EVM address', network: 'Arbitrum One', resolvedName: 'vitalik.eth' };
    }
    if (trimmed.startsWith('@')) {
      return { type: 'Nativetag', network: 'Native internal', resolvedName: trimmed };
    }
    if (trimmed.length > 30 && !trimmed.startsWith('0x')) {
      return { type: 'Solana address', network: 'Solana', resolvedName: 'Solana payee' };
    }
    if (trimmed.startsWith('US') || trimmed.startsWith('GB') || trimmed.length === 10) {
      return { type: 'Bank account', network: 'FedNow / ACH', resolvedName: 'Silicon Valley Bank' };
    }
    return { type: 'Wallet or account', network: 'Multi-chain', resolvedName: trimmed || 'Recipient' };
  };

  const detectedInfo = detectRecipientType(recipientInput);

  const handleStartReview = () => {
    if (!recipientInput.trim() || !amountInput.trim()) return;

    sounds.playKeyClick();
    setIsPreparing(true);

    setTimeout(() => {
      setIsPreparing(false);
      const parsedAmount = parseFloat(amountInput) || 0.1;
      const asset = cryptoAssets.find((a) => a.symbol === selectedCurrency);
      const fiatEquiv = parsedAmount * (asset ? asset.priceUsd : 1.0);

      const request: PaymentRequest = {
        id: `pay-${Date.now()}`,
        destination: {
          type: 'crypto_wallet',
          rawInput: recipientInput,
          resolvedName: detectedInfo.resolvedName,
          resolvedAddress: recipientInput,
          network: detectedInfo.network,
          riskScore: 'low',
          isVerifiedMerchant:
            recipientInput.includes('coffee') || recipientInput.includes('vitalik'),
        },
        amount: parsedAmount,
        currency: selectedCurrency,
        fiatEquivalent: fiatEquiv,
        networkFeeUsd: 0.14,
        estimatedSeconds: 2,
        agentAnalysis: {
          safetySummary: 'Recipient verified. No known fraud or sanctions matches.',
          routeDetails: 'Direct transfer with front-running protection.',
          slippageEst: '0.01%',
          counterpartyTrust: '99.9%',
        },
      };

      setApprovalRequest(request);
    }, 1000);
  };

  const handleQrDetected = (
    destination: PaymentDestination,
    scannedAmount?: number,
    scannedCurrency?: string
  ) => {
    setShowScanner(false);
    setRecipientInput(destination.resolvedAddress || destination.rawInput);
    if (scannedAmount) setAmountInput(scannedAmount.toString());
    if (scannedCurrency) setSelectedCurrency(scannedCurrency);

    sounds.playScanBeep();
    setIsPreparing(true);
    setTimeout(() => {
      setIsPreparing(false);
      const parsedAmount = scannedAmount || 0.15;
      const cur = scannedCurrency || 'ETH';
      const asset = cryptoAssets.find((a) => a.symbol === cur);
      const fiatEquiv = parsedAmount * (asset ? asset.priceUsd : 1.0);

      const request: PaymentRequest = {
        id: `pay-${Date.now()}`,
        destination,
        amount: parsedAmount,
        currency: cur,
        fiatEquivalent: fiatEquiv,
        networkFeeUsd: 0.08,
        estimatedSeconds: 2,
        agentAnalysis: {
          safetySummary: 'Invoice decoded. No malicious redirect detected.',
          routeDetails: 'Merchant settlement over a low-latency channel.',
          slippageEst: '0.00%',
          counterpartyTrust: '100%',
        },
      };
      setApprovalRequest(request);
    }, 900);
  };

  const handleApprovePayment = (req: PaymentRequest) => {
    setApprovalRequest(null);
    onExecutePayment(req);
    onClose();
  };

  const isDisabled = !recipientInput.trim() || !amountInput.trim() || isPreparing;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Send payment</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.modeTabs}>
              <TouchableOpacity
                style={[styles.modeTab, activeTab === 'address' && styles.modeTabActive]}
                onPress={() => setActiveTab('address')}
              >
                <Wallet
                  size={16}
                  color={activeTab === 'address' ? colors.text : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.modeTabText,
                    activeTab === 'address' && styles.modeTabTextActive,
                  ]}
                >
                  Address
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeTab, activeTab === 'qr' && styles.modeTabActive]}
                onPress={() => {
                  setActiveTab('qr');
                  setShowScanner(true);
                }}
              >
                <QrCode size={16} color={activeTab === 'qr' ? colors.text : colors.textSecondary} />
                <Text
                  style={[styles.modeTabText, activeTab === 'qr' && styles.modeTabTextActive]}
                >
                  Scan QR
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Recipient</Text>
              <View style={styles.recipientInputCard}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Wallet address, account number or @tag"
                  placeholderTextColor={colors.textMuted}
                  value={recipientInput}
                  onChangeText={setRecipientInput}
                  multiline={false}
                />
                {recipientInput.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setRecipientInput('')}
                    accessibilityLabel="Clear recipient"
                  >
                    <X size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              {recipientInput.trim().length > 0 && (
                <View style={styles.detectedPill}>
                  <Check size={12} color={colors.positive} />
                  <Text style={styles.detectedText}>
                    {detectedInfo.type} · {detectedInfo.network}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.presetsSection}>
              <Text style={styles.sectionLabel}>Saved recipients</Text>
              <View style={styles.presetsGrid}>
                {savedRecipients.map((p) => (
                  <TouchableOpacity
                    key={p.label}
                    style={styles.presetChip}
                    onPress={() => {
                      sounds.playKeyClick();
                      setRecipientInput(p.val);
                      setSelectedCurrency(p.currency);
                      setAmountInput(p.amount);
                    }}
                  >
                    <Text style={styles.presetChipText}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.amountSection}>
              <Text style={styles.sectionLabel}>Amount</Text>
              <View style={styles.amountRow}>
                <TextInput
                  style={styles.amountInput}
                  value={amountInput}
                  onChangeText={setAmountInput}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                />

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.curScroll}
                >
                  {['ETH', 'BTC', 'SOL', 'NAT', 'USDC'].map((cur) => (
                    <TouchableOpacity
                      key={cur}
                      style={[styles.curChip, selectedCurrency === cur && styles.curChipActive]}
                      onPress={() => {
                        sounds.playKeyClick();
                        setSelectedCurrency(cur);
                      }}
                    >
                      <Text
                        style={[
                          styles.curChipText,
                          selectedCurrency === cur && styles.curChipTextActive,
                        ]}
                      >
                        {cur}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.reviewNote}>
              <ShieldCheck size={18} color={colors.textSecondary} />
              <Text style={styles.reviewNoteText}>
                You'll review the recipient, network and fee before anything is sent.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footerArea}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                (!recipientInput.trim() || !amountInput.trim()) && styles.actionBtnDisabled,
              ]}
              onPress={handleStartReview}
              disabled={isDisabled}
              activeOpacity={0.85}
            >
              {isPreparing ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color={colors.onLight} />
                  <Text style={styles.actionBtnText}>Preparing payment…</Text>
                </View>
              ) : (
                <Text style={[styles.actionBtnText, isDisabled && styles.actionBtnTextDisabled]}>
                  Review payment
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <QrScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onQrDetected={handleQrDetected}
      />

      <PaymentApprovalSheet
        visible={!!approvalRequest}
        paymentRequest={approvalRequest}
        onApprove={handleApprovePayment}
        onReject={() => setApprovalRequest(null)}
      />
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
    paddingTop: space.lg,
    paddingHorizontal: space.xl,
    paddingBottom: space.xxl,
    maxHeight: '92%',
    borderTopWidth: 1,
    borderColor: colors.border,
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
  bodyScroll: {
    marginBottom: space.md,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.md,
    padding: 4,
    gap: space.xs,
    marginBottom: space.lg,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    gap: space.sm,
  },
  modeTabActive: {
    backgroundColor: colors.surfaceRaised,
  },
  modeTabText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  inputSection: {
    marginBottom: space.lg,
  },
  sectionLabel: {
    ...type.overline,
    marginBottom: space.sm,
  },
  recipientInputCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
    outlineStyle: 'none' as any,
  },
  detectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginTop: space.sm,
    paddingHorizontal: space.xs,
  },
  detectedText: {
    color: colors.positive,
    fontSize: 12,
    fontWeight: '600',
  },
  presetsSection: {
    marginBottom: space.lg,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  presetChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  amountSection: {
    marginBottom: space.lg,
  },
  amountRow: {
    flexDirection: 'row',
    gap: space.md,
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: colors.border,
    outlineStyle: 'none' as any,
  },
  curScroll: {
    flexDirection: 'row',
    flexGrow: 0,
  },
  curChip: {
    paddingHorizontal: space.md,
    height: 40,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: space.xs,
  },
  curChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  curChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  curChipTextActive: {
    color: colors.accent,
  },
  reviewNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.lg,
  },
  reviewNoteText: {
    ...type.caption,
    flex: 1,
  },
  footerArea: {
    paddingTop: space.sm,
  },
  actionBtn: {
    ...primaryButton,
  },
  actionBtnDisabled: {
    ...disabledButton,
  },
  actionBtnText: {
    ...primaryButtonText,
    fontSize: 15,
  },
  actionBtnTextDisabled: {
    ...disabledButtonText,
    fontSize: 15,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
});
