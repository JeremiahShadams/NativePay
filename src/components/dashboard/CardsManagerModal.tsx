import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import {
  X,
  Check,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Smartphone,
  Wifi,
  Wallet,
} from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';
import { colors, radius, space, type } from '../../theme';

interface CardsManagerModalProps {
  visible: boolean;
  onClose: () => void;
  userHandle: string;
}

export const CardsManagerModal: React.FC<CardsManagerModalProps> = ({
  visible,
  onClose,
  userHandle = 'ALEX SMITH',
}) => {
  const [selectedCardType, setSelectedCardType] = useState<'metal' | 'virtual'>('metal');
  const [showSensitive, setShowSensitive] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  const toggleFreeze = () => {
    sounds.playKeyClick();
    setIsFrozen(!isFrozen);
  };

  const toggleSensitive = () => {
    sounds.playKeyClick();
    setShowSensitive(!showSensitive);
  };

  const cardholder = userHandle.replace(/^@/, '').replace(/[._]/g, ' ').toUpperCase();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Cards</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, selectedCardType === 'metal' && styles.tabBtnActive]}
                onPress={() => {
                  sounds.playKeyClick();
                  setSelectedCardType('metal');
                }}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    selectedCardType === 'metal' && styles.tabBtnTextActive,
                  ]}
                >
                  Physical
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, selectedCardType === 'virtual' && styles.tabBtnActive]}
                onPress={() => {
                  sounds.playKeyClick();
                  setSelectedCardType('virtual');
                }}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    selectedCardType === 'virtual' && styles.tabBtnTextActive,
                  ]}
                >
                  Virtual
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.cardChassis,
                selectedCardType === 'metal' ? styles.cardChassisMetal : styles.cardChassisVirtual,
                isFrozen && styles.cardFrozen,
              ]}
            >
              <View style={styles.cardTopRow}>
                <Text style={styles.cardBrand}>Native</Text>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>
                    {selectedCardType === 'metal' ? 'METAL' : 'VIRTUAL'}
                  </Text>
                </View>
              </View>

              <View style={styles.cardMidRow}>
                <View style={styles.chipGraphic} />
                <Wifi
                  size={20}
                  color={colors.textMuted}
                  style={styles.contactlessSymbol}
                />
              </View>

              <View style={styles.cardNumberArea}>
                <Text style={styles.cardNumberText}>
                  {isFrozen
                    ? 'CARD FROZEN'
                    : showSensitive
                    ? selectedCardType === 'metal'
                      ? '4921  8820  1034  8824'
                      : '5284  7102  9941  3012'
                    : '••••  ••••  ••••  ' + (selectedCardType === 'metal' ? '8824' : '3012')}
                </Text>
              </View>

              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.cardSmallLabel}>CARDHOLDER</Text>
                  <Text style={styles.cardHolderName}>{cardholder}</Text>
                </View>

                <View style={styles.cardMetaCenter}>
                  <Text style={styles.cardSmallLabel}>EXPIRES</Text>
                  <Text style={styles.cardSmallVal}>{showSensitive ? '11/29' : '••/••'}</Text>
                </View>

                <View style={styles.cardMetaRight}>
                  <Text style={styles.cardSmallLabel}>CVV</Text>
                  <Text style={styles.cardSmallVal}>
                    {showSensitive ? (selectedCardType === 'metal' ? '842' : '917') : '•••'}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.revealBtn} onPress={toggleSensitive}>
              {showSensitive ? (
                <>
                  <EyeOff size={16} color={colors.textSecondary} />
                  <Text style={styles.revealBtnText}>Hide card details</Text>
                </>
              ) : (
                <>
                  <Eye size={16} color={colors.text} />
                  <Text style={[styles.revealBtnText, { color: colors.text }]}>
                    Reveal card details
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.controlsSection}>
              <Text style={styles.sectionHeader}>Security & limits</Text>

              <TouchableOpacity style={styles.controlRow} onPress={toggleFreeze}>
                <View style={styles.controlIconWrap}>
                  {isFrozen ? (
                    <Unlock size={18} color={colors.textSecondary} />
                  ) : (
                    <Lock size={18} color={colors.textSecondary} />
                  )}
                </View>
                <View style={styles.controlInfo}>
                  <Text style={styles.controlTitle}>
                    {isFrozen ? 'Unfreeze card' : 'Freeze card'}
                  </Text>
                  <Text style={styles.controlSub}>
                    {isFrozen ? 'Card is locked against charges' : 'Lock the card instantly'}
                  </Text>
                </View>
                <View style={[styles.statusToggle, isFrozen && styles.statusToggleRed]}>
                  <Text
                    style={[styles.statusToggleText, isFrozen && styles.statusToggleTextRed]}
                  >
                    {isFrozen ? 'LOCKED' : 'ACTIVE'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.controlRow}>
                <View style={styles.controlIconWrap}>
                  <Wallet size={18} color={colors.textSecondary} />
                </View>
                <View style={styles.controlInfo}>
                  <Text style={styles.controlTitle}>Monthly spend limit</Text>
                  <Text style={styles.controlSub}>$1,240 of $5,000 used</Text>
                  <View style={styles.limitBarTrack}>
                    <View style={styles.limitBarFill} />
                  </View>
                </View>
              </View>

              <View style={styles.controlRow}>
                <View style={styles.controlIconWrap}>
                  <Smartphone size={18} color={colors.textSecondary} />
                </View>
                <View style={styles.controlInfo}>
                  <Text style={styles.controlTitle}>Apple Pay & Google Wallet</Text>
                  <Text style={styles.controlSub}>Ready for contactless payment</Text>
                </View>
                <View style={styles.addedBadge}>
                  <Check size={12} color={colors.positive} />
                  <Text style={styles.addedBadgeText}>Added</Text>
                </View>
              </View>
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
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
  scrollBody: {
    marginBottom: space.sm,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.md,
    padding: 4,
    gap: space.xs,
    marginBottom: space.lg,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.surfaceRaised,
  },
  tabBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  cardChassis: {
    width: '100%',
    height: 200,
    borderRadius: radius.xl,
    padding: space.xl,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    marginBottom: space.md,
  },
  cardChassisMetal: {
    backgroundColor: colors.cardMetal,
  },
  cardChassisVirtual: {
    backgroundColor: colors.cardVirtual,
  },
  cardFrozen: {
    opacity: 0.6,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cardBadge: {
    backgroundColor: colors.borderStrong,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  cardBadgeText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardMidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  chipGraphic: {
    width: 36,
    height: 26,
    borderRadius: radius.xs,
    backgroundColor: colors.chip,
  },
  contactlessSymbol: {
    transform: [{ rotate: '90deg' }],
  },
  cardNumberArea: {
    marginVertical: space.xs,
  },
  cardNumberText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardSmallLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardHolderName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  cardMetaCenter: {
    alignItems: 'center',
  },
  cardMetaRight: {
    alignItems: 'flex-end',
  },
  cardSmallVal: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    backgroundColor: colors.surface,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.xl,
  },
  revealBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  controlsSection: {
    gap: space.md,
  },
  sectionHeader: {
    ...type.sectionTitle,
    fontSize: 15,
    marginBottom: space.xs,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: space.md,
  },
  controlIconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlInfo: {
    flex: 1,
  },
  controlTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  controlSub: {
    ...type.caption,
    fontSize: 12,
    marginTop: 2,
  },
  statusToggle: {
    backgroundColor: colors.positiveSoft,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.xs,
  },
  statusToggleRed: {
    backgroundColor: colors.negativeSoft,
  },
  statusToggleText: {
    color: colors.positive,
    fontSize: 10,
    fontWeight: '800',
  },
  statusToggleTextRed: {
    color: colors.negative,
  },
  limitBarTrack: {
    height: 4,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.pill,
    marginTop: space.sm,
    overflow: 'hidden',
  },
  limitBarFill: {
    width: '24.8%',
    height: '100%',
    backgroundColor: colors.textSecondary,
    borderRadius: radius.pill,
  },
  addedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  addedBadgeText: {
    color: colors.positive,
    fontSize: 11,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: space.xl,
  },
});
