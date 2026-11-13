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
import { X, ArrowUpDown } from 'lucide-react-native';
import { CryptoAsset } from '../../types';
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

interface SwapCryptoModalProps {
  visible: boolean;
  onClose: () => void;
  cryptoAssets: CryptoAsset[];
  onExecuteSwap: (fromAsset: string, toAsset: string, fromAmount: number, toAmount: number) => void;
}

const AssetBadge: React.FC<{ symbol: string }> = ({ symbol }) => (
  <View style={styles.assetBadge}>
    <Text style={styles.assetBadgeText}>{symbol.slice(0, 1)}</Text>
  </View>
);

export const SwapCryptoModal: React.FC<SwapCryptoModalProps> = ({
  visible,
  onClose,
  cryptoAssets,
  onExecuteSwap,
}) => {
  const [fromSymbol, setFromSymbol] = useState('ETH');
  const [toSymbol, setToSymbol] = useState('NAT');
  const [fromAmount, setFromAmount] = useState('0.5');
  const [isSwapping, setIsSwapping] = useState(false);

  const fromAsset = cryptoAssets.find((a) => a.symbol === fromSymbol) || cryptoAssets[1];
  const toAsset = cryptoAssets.find((a) => a.symbol === toSymbol) || cryptoAssets[3];

  const parsedFrom = parseFloat(fromAmount) || 0;
  const fromFiatVal = parsedFrom * fromAsset.priceUsd;
  const toAmountCalculated = toAsset.priceUsd > 0 ? (fromFiatVal / toAsset.priceUsd).toFixed(4) : '0';

  const handleInvert = () => {
    sounds.playKeyClick();
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
  };

  const handleConfirmSwap = () => {
    if (parsedFrom <= 0 || isSwapping) return;

    sounds.playKeyClick();
    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
      sounds.playSuccessChime();
      onExecuteSwap(fromSymbol, toSymbol, parsedFrom, parseFloat(toAmountCalculated));
      onClose();
    }, 1200);
  };

  const isDisabled = parsedFrom <= 0 || isSwapping;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Swap</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.swapCard}>
              <View style={styles.swapCardHeader}>
                <Text style={styles.swapCardLabel}>You pay</Text>
                <Text style={styles.balanceHint}>
                  Balance {fromAsset.balance} {fromAsset.symbol}
                </Text>
              </View>

              <View style={styles.inputAndSelectorRow}>
                <TextInput
                  style={styles.amountInput}
                  value={fromAmount}
                  onChangeText={setFromAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.assetPill}>
                  <AssetBadge symbol={fromAsset.symbol} />
                  <Text style={styles.assetSymbolText}>{fromAsset.symbol}</Text>
                </View>
              </View>

              <View style={styles.fiatEquivRow}>
                <Text style={styles.fiatEquivText}>
                  ≈ $
                  {fromFiatVal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  USD
                </Text>
                <TouchableOpacity onPress={() => setFromAmount((fromAsset.balance * 0.5).toFixed(4))}>
                  <Text style={styles.quickPercentText}>50%</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFromAmount(fromAsset.balance.toString())}>
                  <Text style={styles.quickPercentText}>Max</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.invertRow}>
              <View style={styles.invertLine} />
              <TouchableOpacity style={styles.invertBtn} onPress={handleInvert} activeOpacity={0.8}>
                <ArrowUpDown size={18} color={colors.text} />
              </TouchableOpacity>
              <View style={styles.invertLine} />
            </View>

            <View style={styles.swapCard}>
              <View style={styles.swapCardHeader}>
                <Text style={styles.swapCardLabel}>You receive</Text>
                <Text style={styles.balanceHint}>
                  Balance {toAsset.balance} {toAsset.symbol}
                </Text>
              </View>

              <View style={styles.inputAndSelectorRow}>
                <Text style={styles.amountDisplayReceive}>{toAmountCalculated}</Text>

                <View style={styles.assetPill}>
                  <AssetBadge symbol={toAsset.symbol} />
                  <Text style={styles.assetSymbolText}>{toAsset.symbol}</Text>
                </View>
              </View>

              <View style={styles.fiatEquivRow}>
                <Text style={styles.fiatEquivText}>
                  ≈ $
                  {fromFiatVal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  USD
                </Text>
                <Text style={styles.rateText}>
                  1 {fromAsset.symbol} = {(fromAsset.priceUsd / (toAsset.priceUsd || 1)).toFixed(2)}{' '}
                  {toAsset.symbol}
                </Text>
              </View>
            </View>

            <View style={styles.detailsBox}>
              <Text style={styles.detailsTitle}>Swap details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Route</Text>
                <Text style={styles.detailValue}>Native Rollup DEX</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Network fee</Text>
                <Text style={styles.detailValue}>$0.04 USD</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Max slippage</Text>
                <Text style={styles.detailValue}>0.1%</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Price impact</Text>
                <Text style={styles.detailValue}>&lt; 0.01%</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footerArea}>
            <TouchableOpacity
              style={[styles.swapConfirmBtn, isDisabled && styles.swapConfirmBtnDisabled]}
              onPress={handleConfirmSwap}
              disabled={isDisabled}
              activeOpacity={0.85}
            >
              {isSwapping ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color={colors.onLight} />
                  <Text style={styles.swapConfirmBtnText}>Swapping…</Text>
                </View>
              ) : (
                <Text style={[styles.swapConfirmBtnText, isDisabled && styles.swapConfirmBtnTextDisabled]}>
                  Confirm swap
                </Text>
              )}
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
  container: {
    backgroundColor: colors.sheet,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: space.lg,
    paddingHorizontal: space.xl,
    paddingBottom: space.xxl,
    maxHeight: '90%',
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
  swapCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  swapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.md,
  },
  swapCardLabel: {
    ...type.overline,
  },
  balanceHint: {
    ...type.caption,
    fontSize: 12,
  },
  inputAndSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.sm,
  },
  amountInput: {
    flex: 1,
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    outlineStyle: 'none' as any,
  },
  amountDisplayReceive: {
    flex: 1,
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  assetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    gap: space.sm,
  },
  assetBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSunken,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetBadgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
  },
  assetSymbolText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  fiatEquivRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  fiatEquivText: {
    ...type.caption,
    flex: 1,
  },
  quickPercentText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: space.xs,
  },
  rateText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  invertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: space.md,
  },
  invertLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  invertBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: space.md,
  },
  detailsBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: space.sm,
  },
  detailsTitle: {
    ...type.overline,
    marginBottom: space.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  detailValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  footerArea: {
    paddingTop: space.sm,
  },
  swapConfirmBtn: {
    ...primaryButton,
  },
  swapConfirmBtnDisabled: {
    ...disabledButton,
  },
  swapConfirmBtnText: {
    ...primaryButtonText,
    fontSize: 16,
  },
  swapConfirmBtnTextDisabled: {
    ...disabledButtonText,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
});
