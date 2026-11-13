import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  TrendingUp,
  CreditCard,
  Home,
  LayoutGrid,
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
import { colors, radius, space, type } from '../../theme';

interface MainDashboardProps {
  cryptoAssets: CryptoAsset[];
  transactions: TransactionRecord[];
  onExecutePayment: (payment: PaymentRequest) => void;
  onOpenOnboardingTour: () => void;
}

const formatUsd = (value: number) =>
  `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const MainDashboard: React.FC<MainDashboardProps> = ({
  cryptoAssets,
  transactions,
  onExecutePayment,
  onOpenOnboardingTour,
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'cards' | 'crypto' | 'vaults'>('accounts');
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'crypto'>('home');
  const [showPaymentHub, setShowPaymentHub] = useState(false);
  const [showQrDirect, setShowQrDirect] = useState(false);
  const [showReceiveQr, setShowReceiveQr] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showCardsManager, setShowCardsManager] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  const [hideBalances, setHideBalances] = useState(false);
  const [qrApprovalRequest, setQrApprovalRequest] = useState<PaymentRequest | null>(null);

  const totalBalanceUsd = cryptoAssets.reduce((sum, a) => sum + a.fiatValue, 0);

  const handleExecutePayment = (req: PaymentRequest) => {
    onExecutePayment(req);
    sounds.playSuccessChime();
  };

  const handleSwap = (
    fromSymbol: string,
    toSymbol: string,
    fromAmount: number,
    _toAmount: number
  ) => {
    sounds.playSuccessChime();
    const swapTx: PaymentRequest = {
      id: `swap-${Date.now()}`,
      destination: {
        type: 'crypto_wallet',
        rawInput: `Exchange: ${fromSymbol} → ${toSymbol}`,
        resolvedName: 'Native Exchange',
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
        safetySummary: 'Exchange executed through the Native liquidity pool.',
        routeDetails: `Direct route: ${fromSymbol} → ${toSymbol}`,
        slippageEst: '0.00%',
        counterpartyTrust: '100%',
      },
    };
    onExecutePayment(swapTx);
  };

  const goHome = () => {
    sounds.playKeyClick();
    setActiveNavTab('home');
    setActiveTab('accounts');
  };

  const goCrypto = () => {
    sounds.playKeyClick();
    setActiveNavTab('crypto');
    setActiveTab('crypto');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.userProfileBtn} onPress={onOpenOnboardingTour} activeOpacity={0.8}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>AS</Text>
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.userHandle}>@alex</Text>
            <View style={styles.tierPill}>
              <Text style={styles.tierPillText}>Metal</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              sounds.playScanBeep();
              setShowQrDirect(true);
            }}
            accessibilityLabel="Scan QR code"
            activeOpacity={0.7}
          >
            <QrCode size={19} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setHideBalances(!hideBalances)}
            accessibilityLabel={hideBalances ? 'Show balances' : 'Hide balances'}
            activeOpacity={0.7}
          >
            {hideBalances ? (
              <EyeOff size={19} color={colors.textSecondary} />
            ) : (
              <Eye size={19} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceSection}>
          <TouchableOpacity style={styles.accountDropdown} activeOpacity={0.7}>
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyBadgeText}>US</Text>
            </View>
            <Text style={styles.accountDropdownText}>USD · Personal</Text>
            <ChevronDown size={14} color={colors.textMuted} />
          </TouchableOpacity>

          <Text style={styles.balanceMainText}>
            {hideBalances ? '••••••' : formatUsd(totalBalanceUsd)}
          </Text>

          {!hideBalances && (
            <View style={styles.pnlRow}>
              <TrendingUp size={13} color={colors.positive} />
              <Text style={styles.pnlText}>+$2,410.50 (5.2%) this month</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.actionItem}>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => {
                sounds.playKeyClick();
                setShowReceiveQr(true);
              }}
              activeOpacity={0.8}
            >
              <Plus size={22} color={colors.text} strokeWidth={2.2} />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Add money</Text>
          </View>

          <View style={styles.actionItem}>
            <TouchableOpacity
              style={[styles.actionCircle, styles.actionCircleActive]}
              onPress={() => {
                sounds.playKeyClick();
                setShowPaymentHub(true);
              }}
              activeOpacity={0.8}
            >
              <ArrowUpRight size={22} color={colors.white} strokeWidth={2.4} />
            </TouchableOpacity>
            <Text style={[styles.actionLabel, styles.actionLabelActive]}>Transfer</Text>
          </View>

          <View style={styles.actionItem}>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => {
                sounds.playKeyClick();
                setShowSwapModal(true);
              }}
              activeOpacity={0.8}
            >
              <RefreshCw size={20} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Exchange</Text>
          </View>

          <View style={styles.actionItem}>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => {
                sounds.playKeyClick();
                setShowCardsManager(true);
              }}
              activeOpacity={0.8}
            >
              <CreditCard size={20} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Cards</Text>
          </View>
        </View>

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
              <Text style={[styles.segmentText, activeTab === tab && styles.segmentTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'cards' && (
          <TouchableOpacity
            style={styles.cardPreviewBanner}
            onPress={() => setShowCardsManager(true)}
            activeOpacity={0.85}
          >
            <View style={styles.cardPreviewHeader}>
              <Text style={styles.cardPreviewBrand}>Native</Text>
              <Text style={styles.cardPreviewTier}>Titanium Metal</Text>
            </View>
            <Text style={styles.cardPreviewMask}>••••  ••••  ••••  8824</Text>
            <View style={styles.cardPreviewFooter}>
              <Text style={styles.cardPreviewHolder}>Alex Smith</Text>
              <Text style={styles.cardPreviewHolder}>12/28</Text>
            </View>
          </TouchableOpacity>
        )}

        {(activeTab === 'accounts' || activeTab === 'crypto') && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Holdings</Text>
              <TouchableOpacity onPress={goCrypto} activeOpacity={0.7}>
                <Text style={styles.sectionActionText}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.assetList}>
              {cryptoAssets.map((asset, index) => (
                <TouchableOpacity
                  key={asset.id}
                  style={[
                    styles.assetRow,
                    index === cryptoAssets.length - 1 && styles.rowLast,
                  ]}
                  onPress={() => {
                    sounds.playKeyClick();
                    setShowPaymentHub(true);
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.assetIconCircle,
                      { backgroundColor: `${asset.color}24` },
                    ]}
                  >
                    <Text style={[styles.assetSymbol, { color: asset.color }]}>
                      {asset.symbol.slice(0, 1)}
                    </Text>
                  </View>

                  <View style={styles.assetDetails}>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <Text style={styles.assetSub}>
                      {formatUsd(asset.priceUsd)} ·{' '}
                      <Text
                        style={{
                          color: asset.change24h >= 0 ? colors.positive : colors.negative,
                        }}
                      >
                        {asset.change24h >= 0 ? '+' : ''}
                        {asset.change24h}%
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.assetBalanceCol}>
                    <Text style={styles.assetFiat}>
                      {hideBalances ? '••••' : formatUsd(asset.fiatValue)}
                    </Text>
                    <Text style={styles.assetAmount}>
                      {hideBalances ? '••••' : `${asset.balance} ${asset.symbol}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'vaults' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No vaults yet</Text>
            <Text style={styles.emptyBody}>
              Set money aside in a vault and earn interest on your idle balance.
            </Text>
            <TouchableOpacity
              style={styles.emptyAction}
              onPress={() => sounds.playKeyClick()}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyActionText}>Create a vault</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Transactions</Text>
          </View>

          <View style={styles.txList}>
            {transactions.map((tx, index) => {
              const isReceived = tx.type === 'received';
              const isSwap = tx.type === 'swapped';
              const TxIcon = isSwap ? ArrowLeftRight : isReceived ? ArrowDownLeft : ArrowUpRight;

              return (
                <TouchableOpacity
                  key={tx.id}
                  style={[styles.txRow, index === transactions.length - 1 && styles.rowLast]}
                  onPress={() => {
                    sounds.playKeyClick();
                    setSelectedTx(tx);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.txIconCircle}>
                    <TxIcon
                      size={17}
                      color={isReceived ? colors.positive : isSwap ? colors.accent : colors.textSecondary}
                      strokeWidth={2}
                    />
                  </View>

                  <View style={styles.txInfoCol}>
                    <Text style={styles.txTitle} numberOfLines={1}>
                      {tx.title}
                    </Text>
                    <Text style={styles.txSubtitle} numberOfLines={1}>
                      {tx.timestamp} · {tx.subtitle}
                    </Text>
                  </View>

                  <View style={styles.txAmountCol}>
                    <Text
                      style={[
                        styles.txAmountText,
                        { color: isReceived ? colors.positive : colors.text },
                      ]}
                    >
                      {isReceived ? '+' : '-'}
                      {formatUsd(tx.fiatAmount)}
                    </Text>
                    <Text style={styles.txCurrencySub}>
                      {tx.amount} {tx.currency}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <PaymentHubModal
        visible={showPaymentHub}
        onClose={() => setShowPaymentHub(false)}
        onExecutePayment={handleExecutePayment}
        cryptoAssets={cryptoAssets}
      />

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
              safetySummary: 'Verified merchant. Direct low-fee route.',
              routeDetails: `${currency} on ${destination.network || 'Native L2'}`,
              slippageEst: '0.00%',
              counterpartyTrust: '99.9%',
            },
          };
          setQrApprovalRequest(req);
        }}
      />

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

      <ReceiveQrModal
        visible={showReceiveQr}
        onClose={() => setShowReceiveQr(false)}
        userHandle="@alex"
      />

      <SwapCryptoModal
        visible={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        cryptoAssets={cryptoAssets}
        onExecuteSwap={handleSwap}
      />

      <CardsManagerModal
        visible={showCardsManager}
        onClose={() => setShowCardsManager(false)}
        userHandle="@alex"
      />

      <TransactionDetailsModal
        visible={!!selectedTx}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onRepeatPayment={() => {
          setSelectedTx(null);
          setShowPaymentHub(true);
        }}
      />

      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={goHome} activeOpacity={0.7}>
          <Home size={22} color={activeNavTab === 'home' ? colors.text : colors.textMuted} />
          <Text style={[styles.tabItemText, activeNavTab === 'home' && styles.tabItemTextActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            sounds.playKeyClick();
            setShowSwapModal(true);
          }}
          activeOpacity={0.7}
        >
          <TrendingUp size={22} color={colors.textMuted} />
          <Text style={styles.tabItemText}>Invest</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            sounds.playKeyClick();
            setShowPaymentHub(true);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.transferCenterPill}>
            <ArrowLeftRight size={18} color={colors.onLight} strokeWidth={2.4} />
          </View>
          <Text style={styles.tabItemText}>Transfer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            sounds.playKeyClick();
            setShowCardsManager(true);
          }}
          activeOpacity={0.7}
        >
          <CreditCard size={22} color={colors.textMuted} />
          <Text style={styles.tabItemText}>Cards</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={goCrypto} activeOpacity={0.7}>
          <LayoutGrid size={22} color={activeNavTab === 'crypto' ? colors.text : colors.textMuted} />
          <Text style={[styles.tabItemText, activeNavTab === 'crypto' && styles.tabItemTextActive]}>
            Crypto
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.md,
  },
  userProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm + 2,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 3,
  },
  userHandle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  tierPill: {
    backgroundColor: colors.metalSoft,
    borderWidth: 1,
    borderColor: colors.metalBorder,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: radius.xs,
  },
  tierPillText: {
    color: colors.metal,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    flex: 1,
    paddingHorizontal: space.lg,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: space.lg,
  },
  accountDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    marginBottom: space.md,
  },
  currencyBadge: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyBadgeText: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  accountDropdownText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  balanceMainText: {
    ...type.display,
    fontSize: 42,
    marginBottom: 6,
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.positiveSoft,
    borderWidth: 1,
    borderColor: colors.positiveBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  pnlText: {
    color: colors.positive,
    fontSize: 13,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: space.md,
    marginBottom: space.sm,
  },
  actionItem: {
    alignItems: 'center',
    gap: space.sm,
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCircleActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  actionLabelActive: {
    color: colors.text,
    fontWeight: '700',
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 3,
    marginBottom: space.xl,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  segmentBtnActive: {
    backgroundColor: colors.surfaceRaised,
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: colors.text,
  },
  cardPreviewBanner: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.xl,
    marginBottom: space.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: space.xxl,
  },
  cardPreviewBrand: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  cardPreviewTier: {
    ...type.overline,
    fontSize: 10,
  },
  cardPreviewMask: {
    color: colors.text,
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: space.xl,
  },
  cardPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewHolder: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionBlock: {
    marginBottom: space.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.md,
  },
  sectionTitle: type.sectionTitle,
  sectionActionText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  assetList: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: space.lg,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  assetIconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: space.md,
  },
  assetSymbol: {
    fontSize: 17,
    fontWeight: '800',
  },
  assetDetails: {
    flex: 1,
  },
  assetName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  assetSub: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  assetBalanceCol: {
    alignItems: 'flex-end',
  },
  assetFiat: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  assetAmount: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  txList: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: space.lg,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  txIconCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: space.md,
  },
  txInfoCol: {
    flex: 1,
  },
  txTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  txSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  txAmountCol: {
    alignItems: 'flex-end',
    paddingLeft: space.sm,
  },
  txAmountText: {
    fontSize: 15,
    fontWeight: '700',
  },
  txCurrencySub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.xl,
    marginBottom: space.xl,
    alignItems: 'flex-start',
    gap: space.sm,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyBody: {
    ...type.caption,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyAction: {
    marginTop: space.xs,
    paddingHorizontal: space.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
  },
  emptyActionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  bottomTabBar: {
    height: Platform.OS === 'ios' ? 84 : 72,
    backgroundColor: colors.surfaceSunken,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: space.sm,
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
  },
  transferCenterPill: {
    width: 44,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabItemText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  tabItemTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
});
