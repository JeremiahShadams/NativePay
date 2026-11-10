import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Zap,
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Eye,
  EyeOff,
  ChevronRight,
  RefreshCw,
  ArrowUpDown,
  Bot,
} from 'lucide-react-native';
import { CryptoAsset, TransactionRecord, PaymentRequest } from '../../types';
import { PaymentHubModal } from '../payment/PaymentHubModal';
import { QrScannerModal } from '../payment/QrScannerModal';
import { PaymentApprovalSheet } from '../payment/PaymentApprovalSheet';
import { AgentCopilotModal } from '../agent/AgentCopilotModal';
import { ReceiveQrModal } from './ReceiveQrModal';
import { SwapCryptoModal } from './SwapCryptoModal';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { CardsManagerModal } from './CardsManagerModal';
import { sounds } from '../../utils/soundEffects';

interface MainDashboardProps {
  cryptoAssets: CryptoAsset[];
  transactions: TransactionRecord[];
  onExecutePayment: (payment: PaymentRequest) => void;
  onOpenOnboardingTour: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  cryptoAssets,
  transactions,
  onExecutePayment,
  onOpenOnboardingTour,
}) => {
  const [showPaymentHub, setShowPaymentHub] = useState(false);
  const [showQrDirect, setShowQrDirect] = useState(false);
  const [showReceiveQr, setShowReceiveQr] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showCardsManager, setShowCardsManager] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);

  const [showCardDetails, setShowCardDetails] = useState(false);
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);
  const [qrApprovalRequest, setQrApprovalRequest] = useState<PaymentRequest | null>(null);

  // Total balance computation
  const totalBalanceUsd = cryptoAssets.reduce((sum, a) => sum + a.fiatValue, 0);

  const handleExecutePayment = (req: PaymentRequest) => {
    onExecutePayment(req);
    sounds.playSuccessChime();
  };

  const handleSwap = (
    fromSymbol: string,
    toSymbol: string,
    fromAmount: number,
    toAmount: number
  ) => {
    sounds.playSuccessChime();
    // Simulate swapped payment record
    const swapTx: PaymentRequest = {
      id: `swap-${Date.now()}`,
      destination: {
        type: 'crypto_wallet',
        rawInput: `DEX Swap: ${fromSymbol} → ${toSymbol}`,
        resolvedName: `Native Atomic Swapper`,
        network: 'Native L2 Rollup',
        riskScore: 'low',
        isVerifiedMerchant: true,
      },
      amount: fromAmount,
      currency: fromSymbol,
      fiatEquivalent: fromAmount * (cryptoAssets.find((a) => a.symbol === fromSymbol)?.priceUsd || 1),
      networkFeeUsd: 0.04,
      estimatedSeconds: 1,
      agentAnalysis: {
        safetySummary: '0% slippage atomic swap executed on Native Rollup DEX.',
        routeDetails: `Direct route: ${fromSymbol} -> ${toSymbol}`,
        slippageEst: '0.00%',
        counterpartyTrust: '100%',
      },
    };
    onExecutePayment(swapTx);
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.userProfileRow}>
          <TouchableOpacity
            style={styles.userAvatar}
            onPress={() => setShowCardsManager(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>AS</Text>
          </TouchableOpacity>
          <View>
            <View style={styles.tagBadgeRow}>
              <Text style={styles.handleText}>@alex</Text>
              <View style={styles.metalPill}>
                <Text style={styles.metalPillText}>METAL</Text>
              </View>
            </View>
            <Text style={styles.statusSub}>Verified Resident • US</Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          {/* AI Copilot trigger */}
          <TouchableOpacity
            style={[styles.iconCircle, styles.copilotCircle]}
            onPress={() => {
              sounds.playKeyClick();
              setShowCopilot(true);
            }}
            accessibilityLabel="Open AI Copilot"
          >
            <Bot size={18} color="#60a5fa" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => {
              sounds.playScanBeep();
              setShowQrDirect(true);
            }}
            accessibilityLabel="Scan QR Code"
          >
            <QrCode size={18} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setHideBalances(!hideBalances)}
            accessibilityLabel="Toggle Balance Visibility"
          >
            {hideBalances ? (
              <EyeOff size={18} color="#94a3b8" />
            ) : (
              <Eye size={18} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Net Worth</Text>
          <View style={styles.balanceAmountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.balanceMainAmount}>
              {hideBalances
                ? '••••••••'
                : totalBalanceUsd.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </Text>
          </View>

          {/* 24h P&L Pill */}
          <View style={styles.pnlRow}>
            <View style={styles.pnlBadge}>
              <TrendingUp size={12} color="#10b981" />
              <Text style={styles.pnlText}>+$2,410.50 (+5.18%) 24h</Text>
            </View>
            <TouchableOpacity
              style={styles.agentStatusPill}
              onPress={() => setShowCopilot(true)}
            >
              <Zap size={11} color="#60a5fa" />
              <Text style={styles.agentStatusText}>AI Copilot Active</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Bar */}
        <View style={styles.quickActionsBar}>
          {/* Main AI Payment Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.aiActionButton]}
            onPress={() => {
              sounds.playKeyClick();
              setShowPaymentHub(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconWrapperAi}>
              <Zap size={22} color="#ffffff" />
            </View>
            <Text style={[styles.actionButtonLabel, { color: '#60a5fa', fontWeight: '700' }]}>
              Pay with AI
            </Text>
          </TouchableOpacity>

          {/* Scan QR */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              sounds.playScanBeep();
              setShowQrDirect(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconWrapper}>
              <QrCode size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionButtonLabel}>Scan QR</Text>
          </TouchableOpacity>

          {/* Receive */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              sounds.playKeyClick();
              setShowReceiveQr(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconWrapper}>
              <ArrowDownLeft size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionButtonLabel}>Receive</Text>
          </TouchableOpacity>

          {/* Swap */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              sounds.playKeyClick();
              setShowSwapModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconWrapper}>
              <ArrowUpDown size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionButtonLabel}>Swap</Text>
          </TouchableOpacity>

          {/* Cards */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              sounds.playKeyClick();
              setShowCardsManager(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconWrapper}>
              <CreditCard size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionButtonLabel}>Cards</Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Native Metal Card Banner */}
        <TouchableOpacity
          style={styles.metalCardPreview}
          onPress={() => {
            sounds.playKeyClick();
            setShowCardsManager(true);
          }}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardBrandText}>Native</Text>
            <View style={styles.cardChipRow}>
              <Text style={styles.cardContactless}>))))</Text>
              <View style={styles.cardChipGold} />
            </View>
          </View>

          <View style={styles.cardMid}>
            <Text style={styles.cardNumberText}>••••  ••••  ••••  8824</Text>
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardHolderLabel}>CARDHOLDER</Text>
              <Text style={styles.cardHolderName}>ALEX SMITH</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardHolderLabel}>TIER</Text>
              <Text style={styles.cardTierHighlight}>SOLID TITANIUM</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* AI Agent Capability Callout Banner */}
        <TouchableOpacity
          style={styles.agentBanner}
          onPress={() => setShowCopilot(true)}
          activeOpacity={0.85}
        >
          <View style={styles.agentBannerIcon}>
            <Bot size={22} color="#60a5fa" />
          </View>
          <View style={styles.agentBannerContent}>
            <Text style={styles.agentBannerTitle}>Native Autonomous Copilot</Text>
            <Text style={styles.agentBannerSub}>
              Tell the agent who to pay or scan a QR code. It calculates optimal gas and asks for your biometric approval.
            </Text>
          </View>
          <ChevronRight size={18} color="#94a3b8" />
        </TouchableOpacity>

        {/* Crypto Assets List */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Crypto Assets</Text>
            <TouchableOpacity
              onPress={() => {
                sounds.playKeyClick();
                setShowSwapModal(true);
              }}
            >
              <Text style={styles.sectionAction}>+ Swap DEX</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cryptoList}>
            {cryptoAssets.map((asset) => (
              <TouchableOpacity
                key={asset.id}
                style={styles.cryptoRow}
                onPress={() => {
                  sounds.playKeyClick();
                  setShowSwapModal(true);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.cryptoIconCol}>
                  <View style={[styles.cryptoIconCircle, { borderColor: asset.color }]}>
                    <Text style={[styles.cryptoIconSymbol, { color: asset.color }]}>
                      {asset.icon}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <Text style={styles.assetNetwork}>{asset.network}</Text>
                  </View>
                </View>

                <View style={styles.cryptoValCol}>
                  <Text style={styles.assetFiatVal}>
                    {hideBalances
                      ? '••••'
                      : `$${asset.fiatValue.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                  </Text>
                  <View style={styles.assetSubRow}>
                    <Text style={styles.assetCryptoBal}>
                      {asset.balance} {asset.symbol}
                    </Text>
                    <Text
                      style={[
                        styles.changeText,
                        { color: asset.change24h >= 0 ? '#10b981' : '#ef4444' },
                      ]}
                    >
                      {asset.change24h >= 0 ? '+' : ''}
                      {asset.change24h}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions List */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Text style={styles.sectionSubCount}>{transactions.length} total</Text>
          </View>

          <View style={styles.txList}>
            {transactions.map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={styles.txRow}
                onPress={() => {
                  sounds.playKeyClick();
                  setSelectedTx(tx);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.txIconWrapper}>
                  <Text style={styles.txIconText}>{tx.icon}</Text>
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txSub}>{tx.subtitle}</Text>
                  <Text style={styles.txTime}>{tx.timestamp}</Text>
                </View>
                <View style={styles.txAmountCol}>
                  <Text
                    style={[
                      styles.txAmountText,
                      { color: tx.type === 'received' ? '#10b981' : '#ffffff' },
                    ]}
                  >
                    {tx.type === 'received' ? '+' : '-'}
                    {tx.amount} {tx.currency}
                  </Text>
                  <Text style={styles.txFiatText}>${tx.fiatAmount.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Replay Onboarding Flow Button */}
        <TouchableOpacity
          style={styles.replayFlowButton}
          onPress={onOpenOnboardingTour}
          activeOpacity={0.8}
        >
          <RefreshCw size={15} color="#94a3b8" />
          <Text style={styles.replayFlowText}>
            Tour Revolut-Inspired Onboarding Experience (All 24 Screens)
          </Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Payment Hub Modal */}
      <PaymentHubModal
        visible={showPaymentHub}
        onClose={() => setShowPaymentHub(false)}
        cryptoAssets={cryptoAssets}
        onExecutePayment={handleExecutePayment}
      />

      {/* Direct QR Scanner */}
      <QrScannerModal
        visible={showQrDirect}
        onClose={() => setShowQrDirect(false)}
        onQrDetected={(dest, amt, cur) => {
          setShowQrDirect(false);
          const parsedAmt = amt || 0.15;
          const currency = cur || 'ETH';
          const asset = cryptoAssets.find((a) => a.symbol === currency);
          const fiatVal = parsedAmt * (asset ? asset.priceUsd : 1);

          setQrApprovalRequest({
            id: `pay-${Date.now()}`,
            destination: dest,
            amount: parsedAmt,
            currency,
            fiatEquivalent: fiatVal,
            networkFeeUsd: 0.12,
            estimatedSeconds: 2,
            agentAnalysis: {
              safetySummary: 'Counterparty verified. Zero fraudulent activity identified.',
              routeDetails: 'Instant Layer-2 atomic settlement.',
              slippageEst: '0.00%',
              counterpartyTrust: '100%',
            },
          });
        }}
      />

      {/* Receive QR Modal */}
      <ReceiveQrModal
        visible={showReceiveQr}
        onClose={() => setShowReceiveQr(false)}
        userHandle="@alex"
      />

      {/* Swap Modal */}
      <SwapCryptoModal
        visible={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        cryptoAssets={cryptoAssets}
        onExecuteSwap={handleSwap}
      />

      {/* Cards Manager Modal */}
      <CardsManagerModal
        visible={showCardsManager}
        onClose={() => setShowCardsManager(false)}
        userHandle="Alex Smith"
      />

      {/* AI Agent Copilot Conversational Console */}
      <AgentCopilotModal
        visible={showCopilot}
        onClose={() => setShowCopilot(false)}
        cryptoAssets={cryptoAssets}
        onRequestApproval={(req) => setQrApprovalRequest(req)}
      />

      {/* Transaction Details Sheet */}
      <TransactionDetailsModal
        visible={!!selectedTx}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onRepeatPayment={(tx) => {
          sounds.playKeyClick();
          setShowPaymentHub(true);
        }}
      />

      {/* Quick Approval Sheet when scanning directly or via Copilot */}
      <PaymentApprovalSheet
        visible={!!qrApprovalRequest}
        paymentRequest={qrApprovalRequest}
        onApprove={(req) => {
          setQrApprovalRequest(null);
          handleExecutePayment(req);
        }}
        onReject={() => setQrApprovalRequest(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080a10',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#3b82f6',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  tagBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  handleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  metalPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  metalPillText: {
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusSub: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '500',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  copilotCircle: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
  },
  scrollBody: {
    flex: 1,
    paddingHorizontal: 16,
  },
  balanceContainer: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  currencySymbol: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
    marginRight: 2,
  },
  balanceMainAmount: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  pnlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  pnlText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  agentStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  agentStatusText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '700',
  },
  quickActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 18,
    paddingHorizontal: 2,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  actionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  aiActionButton: {},
  actionIconWrapperAi: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  actionButtonLabel: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '600',
  },
  metalCardPreview: {
    width: '100%',
    height: 170,
    borderRadius: 22,
    backgroundColor: '#0c0f18',
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.35)',
    padding: 18,
    justifyContent: 'space-between',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    marginBottom: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrandText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  cardChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardContactless: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 16,
    transform: [{ rotate: '90deg' }],
  },
  cardChipGold: {
    width: 32,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#d97706',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  cardMid: {
    marginVertical: 4,
  },
  cardNumberText: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolderLabel: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardHolderName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  cardTierHighlight: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  agentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.25)',
    marginBottom: 20,
  },
  agentBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentBannerContent: {
    flex: 1,
  },
  agentBannerTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  agentBannerSub: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionAction: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionSubCount: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },
  cryptoList: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cryptoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  cryptoIconCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cryptoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  cryptoIconSymbol: {
    fontSize: 18,
    fontWeight: '800',
  },
  assetName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  assetNetwork: {
    color: '#64748b',
    fontSize: 11,
  },
  cryptoValCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  assetFiatVal: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  assetSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assetCryptoBal: {
    color: '#94a3b8',
    fontSize: 12,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  txList: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    gap: 12,
  },
  txIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txIconText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  txSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  txTime: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 1,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmountText: {
    fontSize: 13,
    fontWeight: '700',
  },
  txFiatText: {
    color: '#64748b',
    fontSize: 11,
  },
  replayFlowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  replayFlowText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
});
