import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Sparkles, Check, Zap, Shield, Globe, Award } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';

interface PlanSelectionStepProps {
  onBack: () => void;
  onSelectPlan: (plan: 'standard' | 'premium' | 'metal') => void;
}

export const PlanSelectionStep: React.FC<PlanSelectionStepProps> = ({
  onBack,
  onSelectPlan,
}) => {
  const [selectedTab, setSelectedTab] = useState<'metal' | 'premium'>('premium');

  const partnerPerks = [
    { name: 'NordVPN', desc: 'Standard VPN', icon: '🛡️' },
    { name: 'Tinder Plus', desc: 'Subscription', icon: '🔥' },
    { name: 'Freeletics', desc: 'Coach sub', icon: '⚡' },
    { name: 'Picsart Pro', desc: 'Subscription', icon: '🎨' },
    { name: 'Sleep Cycle', desc: 'Premium', icon: '🌙' },
  ];

  const handleFinish = () => {
    sounds.playSuccessChime();
    onSelectPlan(selectedTab);
  };

  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => {
            sounds.playKeyClick();
            onBack();
          }}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFinish}>
          <Text style={styles.notNowText}>Not now</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Select plan</Text>

        {/* Tab Switcher: Metal / Premium */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabPill, selectedTab === 'metal' && styles.tabPillActive]}
            onPress={() => {
              sounds.playKeyClick();
              setSelectedTab('metal');
            }}
          >
            <Text style={[styles.tabText, selectedTab === 'metal' && styles.tabTextActive]}>
              Metal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabPill, selectedTab === 'premium' && styles.tabPillActive]}
            onPress={() => {
              sounds.playKeyClick();
              setSelectedTab('premium');
            }}
          >
            <Text style={[styles.tabText, selectedTab === 'premium' && styles.tabTextActive]}>
              Premium
            </Text>
          </TouchableOpacity>
        </View>

        {/* Plan Card Banner */}
        <View
          style={[
            styles.planBanner,
            selectedTab === 'metal' ? styles.bannerMetal : styles.bannerPremium,
          ]}
        >
          <View style={styles.bannerHeader}>
            <Text style={styles.bannerTierName}>
              {selectedTab === 'metal' ? 'Metal' : 'Premium'}
            </Text>
            <View style={styles.specialBadge}>
              <Sparkles size={11} color="#ffffff" />
              <Text style={styles.specialBadgeText}>Special Offer</Text>
            </View>
          </View>

          <Text style={styles.pricingText}>
            1 month free then {selectedTab === 'metal' ? '$16.99' : '$9.99'}/month
          </Text>
          <Text style={styles.bannerTagline}>Ticket to a global lifestyle</Text>

          {/* Card Mockup Graphic */}
          <View style={styles.cardGraphicPreview}>
            <View style={styles.previewCardEdge}>
              <Text style={styles.previewCardBrand}>Native</Text>
              <Text style={styles.previewCardEdition}>
                {selectedTab === 'metal' ? 'SOLID TITANIUM' : 'CHROME OBSIDIAN'}
              </Text>
            </View>
          </View>
        </View>

        {/* Included with Plan Partners */}
        <Text style={styles.sectionTitle}>
          Included with {selectedTab === 'metal' ? 'Metal' : 'Premium'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.perksRow}>
          {partnerPerks.map((p, idx) => (
            <View key={idx} style={styles.perkCard}>
              <Text style={styles.perkEmoji}>{p.icon}</Text>
              <Text style={styles.perkName}>{p.name}</Text>
              <Text style={styles.perkSub}>{p.desc}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Top Features */}
        <Text style={styles.sectionTitle}>Top features</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Zap size={18} color="#60a5fa" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Autonomous AI Payment Agent</Text>
              <Text style={styles.featureDesc}>
                Scan QR codes, paste wallet/account numbers with verified zero-fraud routing.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Globe size={18} color="#10b981" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Zero-Fee Currency & Crypto Exchange</Text>
              <Text style={styles.featureDesc}>
                No additional exchange fees up to $15,000 monthly allowance.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Award size={18} color="#f59e0b" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>1.0% Crypto Cashback</Text>
              <Text style={styles.featureDesc}>
                Earn cashback in BTC, ETH, SOL, or NAT on all card spending.
              </Text>
            </View>
          </View>
        </View>

        {/* Legal text */}
        <Text style={styles.disclaimerText}>
          This is a 12 month plan charged in monthly instalments. By proceeding you have read and agree to the Promotion Terms and Plan Terms.
        </Text>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footerArea}>
        <TouchableOpacity
          style={styles.startTrialBtn}
          onPress={handleFinish}
          activeOpacity={0.85}
        >
          <Text style={styles.startTrialBtnText}>Start free trial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080a10',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topNav: {
    paddingTop: 4,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notNowText: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabPillActive: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  planBanner: {
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 24,
  },
  bannerPremium: {
    backgroundColor: '#131b2e',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  bannerMetal: {
    backgroundColor: '#1c1f2e',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerTierName: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  specialBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  pricingText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  bannerTagline: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 16,
  },
  cardGraphicPreview: {
    alignItems: 'flex-end',
    marginTop: -10,
  },
  previewCardEdge: {
    width: 140,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#0a0d14',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    justifyContent: 'space-between',
  },
  previewCardBrand: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  previewCardEdition: {
    color: '#60a5fa',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  perksRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  perkCard: {
    width: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  perkEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  perkName: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  perkSub: {
    color: '#64748b',
    fontSize: 9,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  featureIcon: {
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  featureDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 17,
  },
  disclaimerText: {
    color: '#64748b',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  footerArea: {
    paddingTop: 12,
  },
  startTrialBtn: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startTrialBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});

