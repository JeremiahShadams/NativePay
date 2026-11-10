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
import {
  X,
  QrCode,
  Wallet,
  Building,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertTriangle,
} from 'lucide-react-native';
import { PaymentDestination, PaymentRequest, CryptoAsset } from '../../types';
import { QrScannerModal } from './QrScannerModal';
import { PaymentApprovalSheet } from './PaymentApprovalSheet';
import { sounds } from '../../utils/soundEffects';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [approvalRequest, setApprovalRequest] = useState<PaymentRequest | null>(null);

  // Quick preset test addresses
  const quickTestAddresses = [
    {
      label: 'vitalik.eth (Ethereum L2)',
      val: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      currency: 'ETH',
      amount: '0.25',
    },
    {
      label: 'Solana Treasury Vault',
      val: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      currency: 'SOL',
      amount: '2.5',
    },
    {
      label: 'Bank Account (ACH / Wire)',
      val: 'US64SVBK0123456789',
      currency: 'USDC',
      amount: '500',
    },
    {
      label: 'Native Merchant (@coffee)',
      val: '@coffee_roasters',
      currency: 'NAT',
      amount: '45',
    },
  ];

  // Helper to detect recipient type
  const detectRecipientType = (input: string) => {
    const trimmed = input.trim();
    if (trimmed.startsWith('0x') && trimmed.length === 42) {
      return { type: 'EVM Address', network: 'Arbitrum One (L2)', resolvedName: 'vitalik.eth' };
    }
    if (trimmed.startsWith('@')) {
      return { type: 'Nativetag', network: 'Native Internal Instant', resolvedName: trimmed };
    }
    if (trimmed.length > 30 && !trimmed.startsWith('0x')) {
      return { type: 'Solana Address', network: 'Solana High-Speed', resolvedName: 'Solana Payee' };
    }
    if (trimmed.startsWith('US') || trimmed.startsWith('GB') || trimmed.length === 10) {
      return { type: 'Bank Account Number', network: 'FedNow / ACH Instant', resolvedName: 'Silicon Valley Bank' };
    }
    return { type: 'Wallet / Account', network: 'Universal Multi-Chain', resolvedName: trimmed || 'Custom Recipient' };
  };

  const detectedInfo = detectRecipientType(recipientInput);

  const handleStartAgent = () => {
    if (!recipientInput.trim() || !amountInput.trim()) return;

    sounds.playKeyClick();
    setIsAnalyzing(true);

    // Simulate Agent Deep Inspection
    setTimeout(() => {
      setIsAnalyzing(false);
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
          isVerifiedMerchant: recipientInput.includes('coffee') || recipientInput.includes('vitalik'),
        },
        amount: parsedAmount,
        currency: selectedCurrency,
        fiatEquivalent: fiatEquiv,
        networkFeeUsd: 0.14,
        estimatedSeconds: 2,
        agentAnalysis: {
          safetySummary: 'Counterparty verified. 0 reported exploits. Optimal L2 gas routing applied.',
          routeDetails: 'Direct RPC atomic swap with anti-frontrunning protection.',
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

    // Auto-trigger agent
    sounds.playScanBeep();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
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
          safetySummary: 'QR payment invoice decoded. Zero malicious redirect detected.',
          routeDetails: 'Merchant verified settlement via low-latency channel.',
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

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.agentSparkleIcon}>
                <Zap size={16} color="#60a5fa" />
              </View>
              <Text style={styles.headerTitle}>Pay with Native AI Agent</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll} keyboardShouldPersistTaps="handled">
            {/* Mode Selector: Paste Address vs Scan QR */}
            <View style={styles.modeTabs}>
              <TouchableOpacity
                style={[styles.modeTab, activeTab === 'address' && styles.modeTabActive]}
                onPress={() => setActiveTab('address')}
              >
                <Wallet size={16} color={activeTab === 'address' ? '#ffffff' : '#94a3b8'} />
                <Text
                  style={[
                    styles.modeTabText,
                    activeTab === 'address' && styles.modeTabTextActive,
                  ]}
                >
                  Paste Wallet / Account
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeTab, activeTab === 'qr' && styles.modeTabActive]}
                onPress={() => {
                  setActiveTab('qr');
                  setShowScanner(true);
                }}
              >
                <QrCode size={16} color={activeTab === 'qr' ? '#ffffff' : '#94a3b8'} />
                <Text
                  style={[
                    styles.modeTabText,
                    activeTab === 'qr' && styles.modeTabTextActive,
                  ]}
                >
                  Scan QR Code
                </Text>
              </TouchableOpacity>
            </View>

            {/* Recipient Input Card */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Recipient (Wallet Address / Account # / Nativetag)</Text>
              <View style={styles.recipientInputCard}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Paste 0x..., Solana, IBAN, or @tag"
                  placeholderTextColor="#64748b"
                  value={recipientInput}
                  onChangeText={setRecipientInput}
                  multiline={false}
                />
                {recipientInput.length > 0 && (
                  <TouchableOpacity onPress={() => setRecipientInput('')}>
                    <X size={16} color="#94a3b8" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Detected Type Pill */}
              {recipientInput.trim().length > 0 && (
                <View style={styles.detectedPill}>
                  <Check size={12} color="#10b981" />
                  <Text style={styles.detectedText}>
                    {detectedInfo.type} • {detectedInfo.network}
                  </Text>
                </View>
              )}
            </View>

            {/* Quick Test Presets */}
            <View style={styles.presetsSection}>
              <Text style={styles.presetsLabel}>Quick Test Presets (Tap to fill):</Text>
              <View style={styles.presetsGrid}>
                {quickTestAddresses.map((p, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.presetChip}
                    onPress={() => {
                      sounds.playKeyClick();
                      setRecipientInput(p.val);
                      setSelectedCurrency(p.currency);
                      setAmountInput(p.amount);
                    }}
                  >
                    <Sparkles size={11} color="#60a5fa" />
                    <Text style={styles.presetChipText}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amount & Currency Section */}
            <View style={styles.amountSection}>
              <Text style={styles.sectionLabel}>Amount to Send</Text>
              <View style={styles.amountRow}>
                <TextInput
                  style={styles.amountInput}
                  value={amountInput}
                  onChangeText={setAmountInput}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#64748b"
                />

                {/* Currency selector chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.curScroll}>
                  {['ETH', 'BTC', 'SOL', 'NAT', 'USDC'].map((cur) => (
                    <TouchableOpacity
                      key={cur}
                      style={[
                        styles.curChip,
                        selectedCurrency === cur && styles.curChipActive,
                      ]}
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

            {/* Agent Explainer Callout */}
            <View style={styles.agentExplainer}>
              <Zap size={18} color="#60a5fa" />
              <View style={styles.agentExplainerText}>
                <Text style={styles.agentExplainerTitle}>Autonomous Payment Guard</Text>
                <Text style={styles.agentExplainerDesc}>
                  The Agent simulates the transaction, finds the lowest gas path, verifies against fraud, and{' '}
                  <Text style={{ color: '#ffffff', fontWeight: '700' }}>
                    always asks for your explicit approval
                  </Text>{' '}
                  before broadcasting.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Action Button */}
          <View style={styles.footerArea}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                (!recipientInput.trim() || !amountInput.trim() || isAnalyzing) &&
                  styles.actionBtnDisabled,
              ]}
              onPress={handleStartAgent}
              disabled={!recipientInput.trim() || !amountInput.trim() || isAnalyzing}
              activeOpacity={0.85}
            >
              {isAnalyzing ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#000000" />
                  <Text style={styles.actionBtnText}>Agent Inspecting Recipient & Gas...</Text>
                </View>
              ) : (
                <View style={styles.btnRow}>
                  <Sparkles size={18} color="#000000" />
                  <Text style={styles.actionBtnText}>
                    Ask Agent to Prepare & Review
                  </Text>
                  <ArrowRight size={18} color="#000000" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* QR Scanner Viewfinder Modal */}
      <QrScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onQrDetected={handleQrDetected}
      />

      {/* THE APPROVAL SHEET REQUIRED BY USER */}
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0e121d',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 28,
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  agentSparkleIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 17,
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
  bodyScroll: {
    marginBottom: 12,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 4,
    gap: 6,
    marginBottom: 18,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  modeTabActive: {
    backgroundColor: '#2563eb',
  },
  modeTabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  inputSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recipientInputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  textInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    outlineStyle: 'none' as any,
  },
  detectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 8,
  },
  detectedText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  presetsSection: {
    marginBottom: 18,
  },
  presetsLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  presetChipText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '600',
  },
  amountSection: {
    marginBottom: 18,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    outlineStyle: 'none' as any,
  },
  curScroll: {
    flexDirection: 'row',
    flexGrow: 0,
  },
  curChip: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginRight: 6,
  },
  curChipActive: {
    backgroundColor: '#2563eb',
  },
  curChipText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  curChipTextActive: {
    color: '#ffffff',
  },
  agentExplainer: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.25)',
    marginBottom: 16,
  },
  agentExplainerText: {
    flex: 1,
    gap: 2,
  },
  agentExplainerTitle: {
    color: '#60a5fa',
    fontSize: 13,
    fontWeight: '700',
  },
  agentExplainerDesc: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 16,
  },
  footerArea: {
    paddingTop: 8,
  },
  actionBtn: {
    height: 54,
    backgroundColor: '#ffffff',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

