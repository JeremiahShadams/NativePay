import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';

interface PurposeTagsStepProps {
  onBack: () => void;
  onContinue: (selectedTags: string[]) => void;
}

interface TagItem {
  id: string;
  label: string;
  emoji: string;
}

export const PurposeTagsStep: React.FC<PurposeTagsStepProps> = ({ onBack, onContinue }) => {
  // Preset with tags from Revolut screenshot 19
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'transfers',
    'crypto',
    'foreign_exchange',
    'ai_agent',
  ]);

  const everydayNeeds: TagItem[] = [
    { id: 'transfers', label: 'Transfers', emoji: '💵' },
    { id: 'scheduling', label: 'Scheduling payments', emoji: '📝' },
    { id: 'freelancer', label: 'Freelancer account', emoji: '💼' },
    { id: 'metal_card', label: 'Metal card', emoji: '💳' },
    { id: 'cashback', label: 'Cashback', emoji: '🤑' },
    { id: 'budgeting', label: 'Budgeting', emoji: '📊' },
    { id: 'view_accounts', label: 'View accounts in one place', emoji: '📈' },
    { id: 'shopping', label: 'Shopping deals', emoji: '🎁' },
    { id: 'kids', label: 'Kids account', emoji: '🎒' },
  ];

  const globalSpending: TagItem[] = [
    { id: 'overseas', label: 'Overseas transfers', emoji: '🌍' },
    { id: 'foreign_exchange', label: 'Foreign exchange', emoji: '💱' },
    { id: 'spending_abroad', label: 'Spending abroad', emoji: '🛍️' },
    { id: 'lounge', label: 'Airport lounge access', emoji: '✈️' },
    { id: 'hotels', label: 'Hotel bookings', emoji: '🏨' },
  ];

  const wealthCrypto: TagItem[] = [
    { id: 'ai_agent', label: 'Autonomous AI Agent', emoji: '🤖' },
    { id: 'crypto', label: 'Crypto', emoji: '🔐' },
    { id: 'stocks', label: 'Stocks', emoji: '📈' },
    { id: 'gold', label: 'Invest in gold & silver', emoji: '💍' },
  ];

  const toggleTag = (id: string) => {
    sounds.playKeyClick();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderTag = (tag: TagItem) => {
    const isSelected = selectedIds.includes(tag.id);
    return (
      <TouchableOpacity
        key={tag.id}
        style={[styles.tagPill, isSelected && styles.tagPillSelected]}
        onPress={() => toggleTag(tag.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.tagEmoji}>{tag.emoji}</Text>
        <Text style={[styles.tagLabel, isSelected && styles.tagLabelSelected]}>
          {tag.label}
        </Text>
      </TouchableOpacity>
    );
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
      </View>

      {/* Main Scrollable Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What do you want to use Native for?</Text>
        <Text style={styles.subtitle}>
          We need to know this for regulatory reasons. And also, we're curious!
        </Text>

        {/* Everyday Needs Section */}
        <Text style={styles.sectionHeader}>Everyday needs</Text>
        <View style={styles.tagsWrap}>{everydayNeeds.map(renderTag)}</View>

        {/* Global Spending Section */}
        <Text style={styles.sectionHeader}>Global spending</Text>
        <View style={styles.tagsWrap}>{globalSpending.map(renderTag)}</View>

        {/* Crypto & Wealth Section */}
        <Text style={styles.sectionHeader}>Wealth & Crypto</Text>
        <View style={styles.tagsWrap}>{wealthCrypto.map(renderTag)}</View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Continue CTA */}
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
    backgroundColor: '#000000',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topNav: {
    paddingTop: 4,
    height: 40,
    justifyContent: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 10,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 8,
  },
  tagPillSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    borderColor: '#3b82f6',
  },
  tagEmoji: {
    fontSize: 16,
  },
  tagLabel: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '500',
  },
  tagLabelSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  footerArea: {
    paddingTop: 12,
  },
  continueButton: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});

