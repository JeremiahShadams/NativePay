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
  ArrowUpDown,
  Sparkles,
  Zap,
  Check,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react-native';
import { CryptoAsset } from '../../types';
import { sounds } from '../../utils/soundEffects';

interface SwapCryptoModalProps {
  visible: boolean;
  onClose: () => void;
  cryptoAssets: CryptoAsset[];
  onExecuteSwap: (fromAsset: string, toAsset: string, fromAmount: number, toAmount: number) => void;
}

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
  const [slippage, setSlippage] = useState('0.1%');

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

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.swapIconBadge}>
                <ArrowUpDown size={16} color="#60a5fa" />
              </View>
              <Text style={styles.headerTitle}>Instant Crypto Swap</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll} keyboardShouldPersistTaps="handled">
            {/* Pay Card */}
            <View style={styles.swapCard}>
              <View style={styles.swapCardHeader}>
                <Text style={styles.swapCardLabel}>You Pay</Text>
                <Text style={styles.balanceHint}>
                  Balance: {fromAsset.balance} {fromAsset.symbol}
                </Text>
              </View>

              <View style={styles.inputAndSelectorRow}>
                <TextInput
                  style={styles.amountInput}
                  value={fromAmount}
                  onChangeText={setFromAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#64748b"
                />

                <View style={styles.assetPill}>
                  <Text style={[styles.assetIcon, { color: fromAsset.color }]}>
                    {fromAsset.icon}
                  </Text>
                  <Text style={styles.assetSymbolText}>{fromAsset.symbol}</Text>
                </View>
              </View>

              <View style={styles.fiatEquivRow}>
                <Text style={styles.fiatEquivText}>
                  ≈ ${fromFiatVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </Text>
                <TouchableOpacity onPress={() => setFromAmount((fromAsset.balance * 0.5).toFixed(4))}>
                  <Text style={styles.quickPercentText}>50%</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFromAmount(fromAsset.balance.toString())}>
                  <Text style={styles.quickPercentText}>MAX</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Invert Button */}
            <View style={styles.invertRow}>
              <View style={styles.invertLine} />
              <TouchableOpacity style={styles.invertBtn} onPress={handleInvert} activeOpacity={0.8}>
                <ArrowUpDown size={18} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.invertLine} />
            </View>

            {/* Receive Card */}
            <View style={styles.swapCard}>
              <View style={styles.swapCardHeader}>
                <Text style={styles.swapCardLabel}>You Receive (Estimated)</Text>
                <Text style={styles.balanceHint}>
                  Balance: {toAsset.balance} {toAsset.symbol}
                </Text>
              </View>

              <View style={styles.inputAndSelectorRow}>
                <Text style={styles.amountDisplayReceive}>{toAmountCalculated}</Text>

                <View style={styles.assetPill}>
                  <Text style={[styles.assetIcon, { color: toAsset.color }]}>{toAsset.icon}</Text>
                  <Text style={styles.assetSymbolText}>{toAsset.symbol}</Text>
                </View>
              </View>

              <View style={styles.fiatEquivRow}>
                <Text style={styles.fiatEquivText}>
                  ≈ ${fromFiatVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </Text>
                <Text style={styles.rateText}>
                  1 {fromAsset.symbol} = {(fromAsset.priceUsd / (toAsset.priceUsd || 1)).toFixed(2)} {toAsset.symbol}
                </Text>
              </View>
            </View>

            {/* AI Routing Intelligence Details */}
            <View style={styles.routeDetailsBox}>
              <View style={styles.routeHeader}>
                <Zap size={14} color="#60a5fa" />
                <Text style={styles.routeTitle}>Autonomous Liquidity Route</Text>
              </View>

              <View style={styles.routeRow}>
                <Text style={styles.routeLabel}>Execution Path</Text>
                <Text style={styles.routeVal}>Native Rollup DEX • Low Gas Pool</Text>
              </View>
              <View style={styles.routeRow}>
                <Text style={styles.routeLabel}>Network Fee</Text>
                <Text style={[styles.routeVal, { color: '#10b981' }]}>$0.04 USD (Free on Metal)</Text>
              </View>
              <View style={styles.routeRow}>
                <Text style={styles.routeLabel}>Max Slippage</Text>
                <Text style={styles.routeVal}>{slippage}</Text>
              </View>
              <View style={styles.routeRow}>
                <Text style={styles.routeLabel}>Price Impact</Text>
                <Text style={[styles.routeVal, { color: '#10b981' }]}>&lt; 0.01% (Zero loss)</Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.footerArea}>
            <TouchableOpacity
              style={[
                styles.swapConfirmBtn,
                (parsedFrom <= 0 || isSwapping) && styles.swapConfirmBtnDisabled,
              ]}
              onPress={handleConfirmSwap}
              disabled={parsedFrom <= 0 || isSwapping}
              activeOpacity={0.85}
            >
              {isSwapping ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#000000" />
                  <Text style={styles.swapConfirmBtnText}>Executing Atomic Swap...</Text>
                </View>
              ) : (
                <View style={styles.btnContentRow}>
                  <Sparkles size={18} color="#000000" />
                  <Text style={styles.swapConfirmBtnText}>
                    Confirm Swap ({parsedFrom} {fromSymbol} → {toAmountCalculated} {toSymbol})
                  </Text>
                </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0c0f18',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 28,
    maxHeight: '90%',
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
  swapIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
  bodyScroll: {
    marginBottom: 12,
  },
  swapCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  swapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  swapCardLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceHint: {
    color: '#64748b',
    fontSize: 12,
  },
  inputAndSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    outlineStyle: 'none' as any,
  },
  amountDisplayReceive: {
    flex: 1,
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
  },
  assetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  assetIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
  assetSymbolText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  fiatEquivRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fiatEquivText: {
    color: '#64748b',
    fontSize: 13,
    flex: 1,
  },
  quickPercentText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  rateText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  invertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  invertLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  invertBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0c0f18',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  routeDetailsBox: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    gap: 8,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  routeTitle: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  routeVal: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  footerArea: {
    paddingTop: 8,
  },
  swapConfirmBtn: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swapConfirmBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  swapConfirmBtnText: {
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

