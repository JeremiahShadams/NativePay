import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  ArrowLeft,
  Flame,
  Globe,
  Moon,
  Palette,
  Shield,
  Zap,
} from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';
import {
  colors,
  radius,
  space,
  type,
  primaryButton,
  primaryButtonText,
} from '../../theme';

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
    { name: 'NordVPN', desc: 'Standard VPN', icon: Shield },
    { name: 'Tinder Plus', desc: 'Subscription', icon: Flame },
    { name: 'Freeletics', desc: 'Coach sub', icon: Zap },
    { name: 'Picsart Pro', desc: 'Subscription', icon: Palette },
    { name: 'Sleep Cycle', desc: 'Premium', icon: Moon },
  ];

  const features = [
    {
      title: 'Currency exchange',
      desc: 'No additional exchange fees up to $15,000 monthly allowance.',
      icon: Zap,
    },
    {
      title: 'Global medical insurance',
      desc: 'Comprehensive international travel and medical coverage.',
      icon: Globe,
    },
    {
      title: 'Everyday protection',
      desc: 'Up to $10,000 purchase and refund protection per year.',
      icon: Shield,
    },
  ];

  const handleFinish = () => {
    sounds.playSuccessChime();
    onSelectPlan(selectedTab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => {
            sounds.playKeyClick();
            onBack();
          }}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFinish}>
          <Text style={styles.notNowText}>Not now</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Select plan</Text>

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

        <View style={styles.planBanner}>
          <View style={styles.bannerHeader}>
            <Text style={styles.bannerTierName}>
              {selectedTab === 'metal' ? 'Metal' : 'Premium'}
            </Text>
            <View style={styles.specialBadge}>
              <Text style={styles.specialBadgeText}>1 month free</Text>
            </View>
          </View>

          <Text style={styles.pricingText}>
            {selectedTab === 'metal' ? '$16.99' : '$9.99'}/month after the trial
          </Text>
          <Text style={styles.bannerTagline}>Ticket to a global lifestyle</Text>

          <View style={styles.cardGraphicPreview}>
            <View
              style={[
                styles.previewCard,
                selectedTab === 'metal' ? styles.previewCardMetal : styles.previewCardPremium,
              ]}
            >
              <Text style={styles.previewCardBrand}>Native</Text>
              <Text style={styles.previewCardEdition}>
                {selectedTab === 'metal' ? 'SOLID TITANIUM' : 'CHROME OBSIDIAN'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Included with {selectedTab === 'metal' ? 'Metal' : 'Premium'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.perksRow}>
          {partnerPerks.map((p) => {
            const Icon = p.icon;
            return (
              <View key={p.name} style={styles.perkCard}>
                <Icon size={22} color={colors.textSecondary} strokeWidth={1.75} />
                <Text style={styles.perkName}>{p.name}</Text>
                <Text style={styles.perkSub}>{p.desc}</Text>
              </View>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Top features</Text>
        <View style={styles.featuresList}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <View key={f.title} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Icon size={18} color={colors.textSecondary} strokeWidth={1.75} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.disclaimerText}>
          This is a 12 month plan charged in monthly instalments. By proceeding you agree
          to the Promotion Terms and Plan Terms.
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>

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
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: space.xl,
    paddingBottom: space.xl,
  },
  topNav: {
    paddingTop: space.xs,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -space.sm,
  },
  notNowText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingTop: space.sm,
  },
  title: {
    ...type.screenTitle,
    marginBottom: space.lg,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: space.sm,
    marginBottom: space.lg,
  },
  tabPill: {
    paddingHorizontal: space.xl,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabPillActive: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.borderStrong,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.text,
  },
  planBanner: {
    borderRadius: radius.xl,
    padding: space.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: space.xxl,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  bannerTierName: {
    ...type.screenTitle,
    letterSpacing: -0.5,
  },
  specialBadge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
  },
  specialBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  pricingText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: space.xs,
  },
  bannerTagline: {
    ...type.caption,
    marginBottom: space.lg,
  },
  cardGraphicPreview: {
    alignItems: 'flex-end',
    marginTop: -space.md,
  },
  previewCard: {
    width: 140,
    height: 80,
    borderRadius: radius.sm,
    padding: space.sm,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  previewCardMetal: {
    backgroundColor: colors.cardMetal,
  },
  previewCardPremium: {
    backgroundColor: colors.black,
  },
  previewCardBrand: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  previewCardEdition: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    ...type.sectionTitle,
    marginBottom: space.md,
  },
  perksRow: {
    flexDirection: 'row',
    marginBottom: space.xxl,
  },
  perkCard: {
    width: 96,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.md,
    alignItems: 'center',
    gap: space.sm,
    marginRight: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  perkName: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  perkSub: {
    color: colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
  },
  featuresList: {
    gap: space.md,
    marginBottom: space.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.md,
    backgroundColor: colors.surface,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  featureDesc: {
    ...type.caption,
  },
  disclaimerText: {
    ...type.caption,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: space.sm,
  },
  bottomSpacer: {
    height: space.xxl,
  },
  footerArea: {
    paddingTop: space.md,
  },
  startTrialBtn: {
    ...primaryButton,
  },
  startTrialBtnText: {
    ...primaryButtonText,
  },
});
