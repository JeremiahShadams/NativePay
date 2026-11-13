import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  ArrowLeft,
  ArrowLeftRight,
  BedDouble,
  Bitcoin,
  Briefcase,
  CalendarClock,
  CreditCard,
  Gem,
  Globe,
  GraduationCap,
  LayoutGrid,
  Percent,
  Plane,
  ShoppingBag,
  TrendingUp,
  Wallet,
  RefreshCw,
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

interface PurposeTagsStepProps {
  onBack: () => void;
  onContinue: (selectedTags: string[]) => void;
}

interface TagItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}

export const PurposeTagsStep: React.FC<PurposeTagsStepProps> = ({ onBack, onContinue }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'transfers',
    'foreign_exchange',
    'lounge',
  ]);

  const everydayNeeds: TagItem[] = [
    { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
    { id: 'scheduling', label: 'Scheduling payments', icon: CalendarClock },
    { id: 'freelancer', label: 'Freelancer account', icon: Briefcase },
    { id: 'metal_card', label: 'Metal card', icon: CreditCard },
    { id: 'cashback', label: 'Cashback', icon: Percent },
    { id: 'budgeting', label: 'Budgeting', icon: Wallet },
    { id: 'view_accounts', label: 'All accounts in one place', icon: LayoutGrid },
    { id: 'shopping', label: 'Shopping deals', icon: ShoppingBag },
    { id: 'kids', label: 'Kids account', icon: GraduationCap },
  ];

  const globalSpending: TagItem[] = [
    { id: 'overseas', label: 'Overseas transfers', icon: Globe },
    { id: 'foreign_exchange', label: 'Foreign exchange', icon: RefreshCw },
    { id: 'spending_abroad', label: 'Spending abroad', icon: CreditCard },
    { id: 'lounge', label: 'Airport lounge access', icon: Plane },
    { id: 'hotels', label: 'Hotel bookings', icon: BedDouble },
  ];

  const wealthCrypto: TagItem[] = [
    { id: 'stocks', label: 'Stocks', icon: TrendingUp },
    { id: 'crypto', label: 'Crypto', icon: Bitcoin },
    { id: 'gold', label: 'Gold & silver', icon: Gem },
  ];

  const toggleTag = (id: string) => {
    sounds.playKeyClick();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderTag = (tag: TagItem) => {
    const isSelected = selectedIds.includes(tag.id);
    const Icon = tag.icon;
    return (
      <TouchableOpacity
        key={tag.id}
        style={[styles.tagPill, isSelected && styles.tagPillSelected]}
        onPress={() => toggleTag(tag.id)}
        activeOpacity={0.7}
      >
        <Icon
          size={16}
          color={isSelected ? colors.accent : colors.textSecondary}
          strokeWidth={2}
        />
        <Text style={[styles.tagLabel, isSelected && styles.tagLabelSelected]}>
          {tag.label}
        </Text>
      </TouchableOpacity>
    );
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
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What do you want to use Native for?</Text>
        <Text style={styles.subtitle}>
          Select everything that applies. This helps us tailor your account.
        </Text>

        <Text style={styles.sectionHeader}>Everyday needs</Text>
        <View style={styles.tagsWrap}>{everydayNeeds.map(renderTag)}</View>

        <Text style={styles.sectionHeader}>Global spending</Text>
        <View style={styles.tagsWrap}>{globalSpending.map(renderTag)}</View>

        <Text style={styles.sectionHeader}>Wealth & crypto</Text>
        <View style={styles.tagsWrap}>{wealthCrypto.map(renderTag)}</View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.footerArea}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            sounds.playKeyClick();
            onContinue(selectedIds);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
    justifyContent: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -space.sm,
  },
  scrollView: {
    flex: 1,
    paddingTop: space.sm,
  },
  title: {
    ...type.screenTitle,
    marginBottom: space.sm,
  },
  subtitle: {
    ...type.body,
    marginBottom: space.lg,
  },
  sectionHeader: {
    ...type.sectionTitle,
    marginTop: space.lg,
    marginBottom: space.md,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
    gap: space.sm,
  },
  tagPillSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  tagLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  tagLabelSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: space.xl,
  },
  footerArea: {
    paddingTop: space.md,
  },
  continueButton: {
    ...primaryButton,
  },
  continueButtonText: {
    ...primaryButtonText,
  },
});
