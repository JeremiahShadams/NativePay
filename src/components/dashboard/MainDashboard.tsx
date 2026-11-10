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
} from 'lucide-react';
import { CryptoAsset, TransactionRecord, PaymentRequest } from '../../types';
import { PaymentHubModal } from '../payment/PaymentHubModal';
import { QrScannerModal } from '../payment/QrScannerModal';
import { PaymentApprovalSheet } from '../payment/PaymentApprovalSheet';
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

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.userProfileRow}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
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
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => {
              sounds.playScanBeep();
              setShowQrDirect(true);
            }}
            title="Scan QR Code"
          >
            <QrCode size={18} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setHideBalances(!hideBalances)}
            title="Toggle Balance Visibility"
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
            <View style={styles.agentStatusPill}>
              <Zap size={11} color="#60a5fa" />
              <Text style={styles.agentStatusText}>AI Agent Guard Active</Text>
            </View>
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
              setShowPaymentHub(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconWrapper}>
              <ArrowDownLeft size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionButtonLabel}>Receive</Text>
          </TouchableOpacity>

          {/* Cards */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              sounds.playKeyClick();
              setShowCardDetails(!showCardDetails);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconWrapper}>
              <CreditCard size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionButtonLabel}>Cards</Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Native Metal Card Section */}
        {showCardDetails && (
          <View style={styles.metalCardContainer}>
            <View
              style={[
                styles.nativeMetalCard,
                isCardFrozen && styles.nativeMetalCardFrozen,
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardBrandText}>Native</Text>
                <View style={styles.cardChipRow}>
                  <Text style={styles.cardContactless}>))))</Text>
                  <View style={styles.cardChipGold} />
                </View>
              </View>

              <View style={styles.cardMid}>
                <Text style={styles.cardNumberText}>
                  {isCardFrozen ? 'CARD FROZEN' : '4921  8820  1034  8824'}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardHolderLabel}>CARDHOLDER</Text>
                  <Text style={styles.cardHolderName}>ALEX SMITH</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.cardHolderLabel}>EXPIRES</Text>
                  <Text style={styles.cardHolderName}>11/29</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardControlsRow}>
              <TouchableOpacity
                style={styles.cardControlBtn}
                onPress={() => setIsCardFrozen(!isCardFrozen)}
              >
                <ShieldCheck size={14} color={isCardFrozen ? '#ef4444' : '#60a5fa'} />
                <Text style={styles.cardControlText}>
                  {isCardFrozen ? 'Unfreeze Card' : 'Freeze Card'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardControlBtn}
                onPress={() => setShowCardDetails(false)}
              >
                <Text style={styles.cardControlText}>Hide Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* AI Agent Capability Callout Banner */}
        <TouchableOpacity
          style={styles.agentBanner}
          onPress={() => setShowPaymentHub(true)}
          activeOpacity={0.85}
        >
          <View style={styles.agentBannerIcon}>
            <Sparkles size={20} color="#60a5fa" />
          </View>
          <View style={styles.agentBannerContent}>
            <Text style={styles.agentBannerTitle}>Native Autonomous Payment Agent</Text>
            <Text style={styles.agentBannerSub}>
              Scan any QR invoice or paste an address. The agent prepares the optimal gas route and asks for your approval before signing.
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
                setShowPaymentHub(true);
              }}
            >
              <Text style={styles.sectionAction}>+ Trade</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cryptoList}>
            {cryptoAssets.map((asset) => (
              <TouchableOpacity
                key={asset.id}
                style={styles.cryptoRow}
                onPress={() => {
                  sounds.playKeyClick();
                  setShowPaymentHub(true);
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
              <View key={tx.id} style={styles.txRow}>
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
                  <Text style={styles.txFiatText}>
                    ${tx.fiatAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
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

      {/* Quick Approval Sheet when scanning directly */}
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
    paddingHorizontal: 4,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  actionIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  aiActionButton: {},
  actionIconWrapperAi: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
  },
  actionButtonLabel: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
  metalCardContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  nativeMetalCard: {
    width: '100%',
    height: 190,
    borderRadius: 22,
    backgroundColor: '#0c0f18',
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  nativeMetalCardFrozen: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    opacity: 0.75,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrandText: {
    color: '#ffffff',
    fontSize: 22,
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
    width: 36,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#d97706',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  cardMid: {
    marginVertical: 10,
  },
  cardNumberText: {
    color: '#cbd5e1',
    fontSize: 16,
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
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  cardControlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cardControlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardControlText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
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
    width: 38,
    height: 38,
    borderRadius: 12,
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

