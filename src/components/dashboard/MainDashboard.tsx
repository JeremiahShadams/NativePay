import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  QrCode,
  ArrowUpRight,
  Plus,
  RefreshCw,
  MoreHorizontal,
  Search,
  Eye,
  EyeOff,
  ChevronDown,
  TrendingUp,
  CreditCard,
  Lock,
  Unlock,
  Check,
} from 'lucide-react-native';
import { CryptoAsset, TransactionRecord, PaymentRequest } from '../../types';
import { PaymentHubModal } from '../payment/PaymentHubModal';
import { QrScannerModal } from '../payment/QrScannerModal';
import { PaymentApprovalSheet } from '../payment/PaymentApprovalSheet';
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
  const [activeTab, setActiveTab] = useState<'accounts' | 'cards' | 'crypto' | 'vaults'>('accounts');
  const [showPaymentHub, setShowPaymentHub] = useState(false);
  const [showQrDirect, setShowQrDirect] = useState(false);
  const [showReceiveQr, setShowReceiveQr] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showCardsManager, setShowCardsManager] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
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
    const swapTx: PaymentRequest = {
      id: `swap-${Date.now()}`,
      destination: {
        type: 'crypto_wallet',
        rawInput: `Exchange: ${fromSymbol} → ${toSymbol}`,
        resolvedName: `Native Instant Exchange`,
        network: 'Native Rollup',
        riskScore: 'low',
        isVerifiedMerchant: true,
      },
      amount: fromAmount,
      currency: fromSymbol,
      fiatEquivalent: fromAmount * (cryptoAssets.find((a) => a.symbol === fromSymbol)?.priceUsd || 1),
      networkFeeUsd: 0.02,
      estimatedSeconds: 1,
      agentAnalysis: {
        safetySummary: 'Instant currency exchange executed via Native liquidity pool.',
        routeDetails: `Direct route: ${fromSymbol} -> ${toSymbol}`,
        slippageEst: '0.00%',
        counterpartyTrust: '100%',
      },
    };
    onExecutePayment(swapTx);
  };

  return (
    <View style={styles.container}>
      {/* Top Revolut V10 Navigation Bar */}
      <View style={styles.topHeader}>
        {/* User Avatar & Tag */}
        <TouchableOpacity
          style={styles.userProfileBtn}
          onPress={onOpenOnboardingTour}
          activeOpacity={0.8}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>AS</Text>
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.userHandle}>@alex</Text>
            <View style={styles.tierPill}>
              <Text style={styles.tierPillText}>METAL</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Right Action Icons: Search, QR Scanner, Visibility */}
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              sounds.playScanBeep();
              setShowQrDirect(true);
            }}
            accessibilityLabel="Scan QR Code"
            activeOpacity={0.7}
          >
            <QrCode size={19} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setHideBalances(!hideBalances)}
            accessibilityLabel="Toggle Balance Visibility"
            activeOpacity={0.7}
          >
            {hideBalances ? (
              <EyeOff size={19} color="#8e8e93" />
            ) : (
              <Eye size={19} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Balance Hero Section */}
        <View style={styles.balanceSection}>
          <TouchableOpacity style={styles.accountDropdown} activeOpacity={0.7}>
            <Text style={styles.accountDropdownText}>🇺🇸 USD • Personal</Text>
            <ChevronDown size={14} color="#8e8e93" />
          </TouchableOpacity>

          <View style={styles.balanceMainRow}>
            <Text style={styles.balanceMainText}>
              {hideBalances
                ? '••••••••'
                : `$${totalBalanceUsd.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </Text>
          </View>

          <View style={styles.pnlRow}>
            <TrendingUp size={13} color="#34c759" />
            <Text style={styles.pnlText}>+$2,410.50 (5.2%) this month</Text>
          </View>
        </View>

        {/* Primary Action Buttons (Revolut 4-Pill Row) */}
        <View style={styles.actionsRow}>
          {/* Add money */}
          <View style={styles.actionItem}>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => {
                sounds.playKeyClick();
                setShowReceiveQr(true);
              }}
              activeOpacity={0.8}
            >
              <Plus size={22} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Add money</Text>
          </View>

          {/* Transfer (Autonomous Payment Agent Entrypoint) */}
          <View style={styles.actionItem}>
            <TouchableOpacity
              style={[styles.actionCircle, styles.actionCircleActive]}
              onPress={() => {
                sounds.playKeyClick();
                setShowPaymentHub(true);
              }}
              activeOpacity={0.8}
            >
              <ArrowUpRight size={22} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={[styles.actionLabel, { color: '#ffffff', fontWeight: '700' }]}>
              Transfer
            </Text>
          </View>

          {/* Exchange */}
          <View style={styles.actionItem}>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => {
                sounds.playKeyClick();
                setShowSwapModal(true);
              }}
              activeOpacity={0.8}
            >
              <RefreshCw size={20} color="#ffffff" strokeWidth={2.2} />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Exchange</Text>
          </View>

          {/* Details / Cards */}
          <View style={styles.actionItem}>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => {
                sounds.playKeyClick();
                setShowCardsManager(true);
              }}
              activeOpacity={0.8}
            >
              <CreditCard size={20} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Cards</Text>
          </View>
        </View>

        {/* Segmented Filter Tabs: Accounts | Cards | Crypto | Vaults */}
        <View style={styles.segmentedRow}>
          {(['accounts', 'cards', 'crypto', 'vaults'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.segmentBtn, activeTab === tab && styles.segmentBtnActive]}
              onPress={() => {
                sounds.playKeyClick();
                setActiveTab(tab);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeTab === tab && styles.segmentTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content: Cards Preview if Cards selected */}
        {activeTab === 'cards' && (
          <TouchableOpacity
            style={styles.cardPreviewBanner}
            onPress={() => setShowCardsManager(true)}
            activeOpacity={0.85}
          >
            <View style={styles.cardPreviewHeader}>
              <Text style={styles.cardPreviewBrand}>Native</Text>
              <Text style={styles.cardPreviewTier}>TITANIUM METAL</Text>
            </View>
            <View style={styles.cardPreviewNumber}>
              <Text style={styles.cardPreviewMask}>••••  ••••  ••••  8824</Text>
            </View>
            <View style={styles.cardPreviewFooter}>
              <Text style={styles.cardPreviewHolder}>ALEX SMITH</Text>
              <Text style={styles.cardPreviewExp}>12/28</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Crypto & Cash Holdings Section */}
        {(activeTab === 'accounts' || activeTab === 'crypto') && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Holdings</Text>
              <TouchableOpacity
                onPress={() => setShowSwapModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionActionText}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.assetList}>
              {cryptoAssets.map((asset) => (
                <TouchableOpacity
                  key={asset.id}
                  style={styles.assetRow}
                  onPress={() => {
                    sounds.playKeyClick();
                    setShowPaymentHub(true);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.assetIconCircle, { backgroundColor: asset.color }]}>
                    <Text style={styles.assetSymbolEmoji}>{asset.icon}</Text>
                  </View>

                  <View style={styles.assetDetails}>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <Text style={styles.assetSub}>
                      ${asset.priceUsd.toLocaleString()} •{' '}
                      <Text
                        style={{
                          color: asset.change24h >= 0 ? '#34c759' : '#ff3b30',
                        }}
                      >
                        {asset.change24h >= 0 ? '+' : ''}
                        {asset.change24h}%
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.assetBalanceCol}>
                    <Text style={styles.assetFiat}>
                      {hideBalances
                        ? '••••'
                        : `$${asset.fiatValue.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                    </Text>
                    <Text style={styles.assetAmount}>
                      {asset.balance} {asset.symbol}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Recent Transactions Feed */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Transactions</Text>
            <Text style={styles.sectionActionText}>All</Text>
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
                <View style={styles.txIconCircle}>
                  <Text style={styles.txArrowIcon}>
                    {tx.type === 'received' ? '↙' : tx.type === 'swapped' ? '⇄' : '↗'}
                  </Text>
                </View>

                <View style={styles.txInfoCol}>
                  <Text style={styles.txTitle} numberOfLines={1}>
                    {tx.title}
                  </Text>
                  <Text style={styles.txSubtitle} numberOfLines={1}>
                    {tx.timestamp} • {tx.subtitle}
                  </Text>
                </View>

                <View style={styles.txAmountCol}>
                  <Text
                    style={[
                      styles.txAmountText,
                      { color: tx.type === 'received' ? '#34c759' : '#ffffff' },
                    ]}
                  >
                    {tx.type === 'received' ? '+' : '-'}${tx.fiatAmount.toFixed(2)}
                  </Text>
                  <Text style={styles.txCurrencySub}>
                    {tx.amount} {tx.currency}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Autonomous Payment Hub Modal (Supports QR Scan, EVM, Solana, BTC, IBAN) */}
      <PaymentHubModal
        visible={showPaymentHub}
        onClose={() => setShowPaymentHub(false)}
        onExecutePayment={handleExecutePayment}
        cryptoAssets={cryptoAssets}
      />

      {/* Direct QR Scanner Camera Simulation */}
      <QrScannerModal
        visible={showQrDirect}
        onClose={() => setShowQrDirect(false)}
        onQrDetected={(destination, amount = 25, currency = 'USDC') => {
          setShowQrDirect(false);
          const req: PaymentRequest = {
            id: `pay-${Date.now()}`,
            destination,
            amount,
            currency,
            fiatEquivalent: amount,
            networkFeeUsd: 0.04,
            estimatedSeconds: 2,
            agentAnalysis: {
              safetySummary: 'Verified merchant counterparty. Direct low-gas L2 route.',
              routeDetails: `${currency} on ${destination.network || 'Native L2'}`,
              slippageEst: '0.00%',
              counterpartyTrust: '99.9%',
            },
          };
          setQrApprovalRequest(req);
        }}
      />

      {/* Autonomous Agent Explicit Approval Sheet */}
      {qrApprovalRequest && (
        <PaymentApprovalSheet
          visible={true}
          paymentRequest={qrApprovalRequest}
          onApprove={() => {
            handleExecutePayment(qrApprovalRequest);
            setQrApprovalRequest(null);
          }}
          onReject={() => setQrApprovalRequest(null)}
        />
      )}

      {/* Receive / Deposit Modal */}
      <ReceiveQrModal
        visible={showReceiveQr}
        onClose={() => setShowReceiveQr(false)}
        userHandle="@alex"
      />

      {/* Instant Swapper */}
      <SwapCryptoModal
        visible={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        cryptoAssets={cryptoAssets}
        onExecuteSwap={handleSwap}
      />

      {/* Cards Manager */}
      <CardsManagerModal
        visible={showCardsManager}
        onClose={() => setShowCardsManager(false)}
        userHandle="@alex"
      />

      {/* Transaction Details Sheet */}
      <TransactionDetailsModal
        visible={!!selectedTx}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onRepeatPayment={(tx) => {
          setSelectedTx(null);
          setShowPaymentHub(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  userProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userHandle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  tierPill: {
    backgroundColor: '#2c2c2e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tierPillText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    flex: 1,
    paddingHorizontal: 18,
  },

  // Balance Hero
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  accountDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    marginBottom: 12,
  },
  accountDropdownText: {
    color: '#8e8e93',
    fontSize: 13,
    fontWeight: '600',
  },
  balanceMainRow: {
    marginBottom: 6,
  },
  balanceMainText: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pnlText: {
    color: '#34c759',
    fontSize: 13,
    fontWeight: '600',
  },

  // Primary 4 Action Buttons
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    marginBottom: 10,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCircleActive: {
    backgroundColor: '#2563eb',
  },
  actionLabel: {
    color: '#8e8e93',
    fontSize: 13,
    fontWeight: '500',
  },

  // Segmented Tabs
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 3,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 17,
  },
  segmentBtnActive: {
    backgroundColor: '#2c2c2e',
  },
  segmentText: {
    color: '#8e8e93',
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#ffffff',
  },

  // Card Preview Banner
  cardPreviewBanner: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  cardPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cardPreviewBrand: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  cardPreviewTier: {
    color: '#8e8e93',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardPreviewNumber: {
    marginBottom: 20,
  },
  cardPreviewMask: {
    color: '#ffffff',
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: '600',
  },
  cardPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewHolder: {
    color: '#8e8e93',
    fontSize: 12,
    fontWeight: '600',
  },
  cardPreviewExp: {
    color: '#8e8e93',
    fontSize: 12,
    fontWeight: '600',
  },

  // Section Blocks
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionActionText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },

  // Asset Holdings List
  assetList: {
    backgroundColor: '#121214',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
  },
  assetIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetSymbolEmoji: {
    fontSize: 20,
  },
  assetDetails: {
    flex: 1,
  },
  assetName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  assetSub: {
    color: '#8e8e93',
    fontSize: 13,
    marginTop: 2,
  },
  assetBalanceCol: {
    alignItems: 'flex-end',
  },
  assetFiat: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  assetAmount: {
    color: '#8e8e93',
    fontSize: 13,
    marginTop: 2,
  },

  // Transactions Feed
  txList: {
    backgroundColor: '#121214',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
  },
  txIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txArrowIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  txInfoCol: {
    flex: 1,
  },
  txTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  txSubtitle: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 2,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  txCurrencySub: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 2,
  },
});
