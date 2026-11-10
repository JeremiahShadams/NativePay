import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import {
  X,
  CreditCard,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Zap,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

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
  const [contactlessEnabled, setContactlessEnabled] = useState(true);

  const toggleFreeze = () => {
    sounds.playKeyClick();
    setIsFrozen(!isFrozen);
  };

  const toggleSensitive = () => {
    sounds.playKeyClick();
    setShowSensitive(!showSensitive);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Card Management</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Card Type Selector */}
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
                  Physical Metal
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
                  Disposable Virtual
                </Text>
              </TouchableOpacity>
            </View>

            {/* 3D Card Graphic */}
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
                    {selectedCardType === 'metal' ? 'TITANIUM METAL' : 'DISPOSABLE CYBER'}
                  </Text>
                </View>
              </View>

              <View style={styles.cardMidRow}>
                <View style={styles.chipGraphic} />
                <Text style={styles.contactlessSymbol}>))))</Text>
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
                  <Text style={styles.cardHolderName}>{userHandle.toUpperCase()}</Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.cardSmallLabel}>EXPIRES</Text>
                  <Text style={styles.cardSmallVal}>
                    {showSensitive ? '11/29' : '••/••'}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.cardSmallLabel}>CVV</Text>
                  <Text style={styles.cardSmallVal}>
                    {showSensitive ? (selectedCardType === 'metal' ? '842' : '917') : '•••'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Reveal / Hide Details Button */}
            <TouchableOpacity style={styles.revealBtn} onPress={toggleSensitive}>
              {showSensitive ? (
                <>
                  <EyeOff size={16} color="#94a3b8" />
                  <Text style={styles.revealBtnText}>Hide Card Numbers & CVV</Text>
                </>
              ) : (
                <>
                  <Eye size={16} color="#60a5fa" />
                  <Text style={[styles.revealBtnText, { color: '#60a5fa' }]}>
                    Reveal Numbers, PIN & CVV
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Quick Card Controls */}
            <View style={styles.controlsSection}>
              <Text style={styles.sectionHeader}>Security & Limits</Text>

              {/* Freeze Toggle */}
              <TouchableOpacity style={styles.controlRow} onPress={toggleFreeze}>
                <View style={styles.controlIconWrap}>
                  {isFrozen ? <Unlock size={18} color="#ef4444" /> : <Lock size={18} color="#60a5fa" />}
                </View>
                <View style={styles.controlInfo}>
                  <Text style={styles.controlTitle}>
                    {isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
                  </Text>
                  <Text style={styles.controlSub}>
                    {isFrozen ? 'Card is locked against charges' : 'Lock card instantly anytime'}
                  </Text>
                </View>
                <View style={[styles.statusToggle, isFrozen && styles.statusToggleRed]}>
                  <Text style={styles.statusToggleText}>{isFrozen ? 'LOCKED' : 'ACTIVE'}</Text>
                </View>
              </TouchableOpacity>

              {/* Monthly Spending Allowance */}
              <View style={styles.controlRow}>
                <View style={styles.controlIconWrap}>
                  <Zap size={18} color="#10b981" />
                </View>
                <View style={styles.controlInfo}>
                  <Text style={styles.controlTitle}>Monthly Spend Limit</Text>
                  <Text style={styles.controlSub}>$1,240 of $5,000 allowance used (24.8%)</Text>
                  <View style={styles.limitBarTrack}>
                    <View style={styles.limitBarFill} />
                  </View>
                </View>
              </View>

              {/* Apple Pay Simulator */}
              <TouchableOpacity
                style={styles.controlRow}
                onPress={() => sounds.playSuccessChime()}
              >
                <View style={styles.controlIconWrap}>
                  <Smartphone size={18} color="#ffffff" />
                </View>
                <View style={styles.controlInfo}>
                  <Text style={styles.controlTitle}>Apple Pay & Google Wallet</Text>
                  <Text style={styles.controlSub}>Ready for contactless payment</Text>
                </View>
                <Text style={styles.applePayBadge}>ADDED ✓</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
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
  scrollBody: {
    marginBottom: 8,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 4,
    gap: 6,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#2563eb',
  },
  tabBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  cardChassis: {
    width: '100%',
    height: 200,
    borderRadius: 22,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  cardChassisMetal: {
    backgroundColor: '#0b0e17',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    shadowColor: '#2563eb',
  },
  cardChassisVirtual: {
    backgroundColor: '#111827',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    shadowColor: '#8b5cf6',
  },
  cardFrozen: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    opacity: 0.7,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  cardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardBadgeText: {
    color: '#e2e8f0',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardMidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chipGraphic: {
    width: 36,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#d97706',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  contactlessSymbol: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 16,
    transform: [{ rotate: '90deg' }],
  },
  cardNumberArea: {
    marginVertical: 4,
  },
  cardNumberText: {
    color: '#cbd5e1',
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
  cardSmallVal: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 20,
  },
  revealBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  controlsSection: {
    gap: 12,
  },
  sectionHeader: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
  },
  controlIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlInfo: {
    flex: 1,
  },
  controlTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  controlSub: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  statusToggle: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusToggleRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusToggleText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  limitBarTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  limitBarFill: {
    width: '24.8%',
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  applePayBadge: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
  },
});
