import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
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

interface ProfileTagStepProps {
  onBack: () => void;
  onContinue: (tag: string) => void;
}

export const ProfileTagStep: React.FC<ProfileTagStepProps> = ({ onBack, onContinue }) => {
  const [handle, setHandle] = useState('alexnative');

  const cleanHandle = handle.replace(/^@/, '').toLowerCase().trim();
  const isValid = cleanHandle.length >= 3 && cleanHandle.length <= 32;
  const suggestions = ['alexnative', 'alex_crypto', 'alex_native'];
  const initials = (cleanHandle.slice(0, 2) || 'NT').toUpperCase();

  const handleSubmit = () => {
    if (isValid) {
      sounds.playSuccessChime();
      onContinue(`@${cleanHandle}`);
    }
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
        <TouchableOpacity
          onPress={() => {
            sounds.playKeyClick();
            onContinue('@alex');
          }}
        >
          <Text style={styles.notNowText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleArea}>
            <Text style={styles.title}>Your profile</Text>
            <Text style={styles.subtitle}>
              Choose a Nativetag so friends can pay you by name.
            </Text>
          </View>

          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Nativetag</Text>
          <View style={styles.tagInputRow}>
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              style={styles.textInput}
              value={cleanHandle}
              onChangeText={(t) => setHandle(t.replace(/[^a-zA-Z0-9_]/g, ''))}
              placeholder="yourname"
              placeholderTextColor={colors.textMuted}
              maxLength={32}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.statusRow}>
          {isValid ? (
            <View style={styles.availableRow}>
              <Check size={14} color={colors.positive} />
              <Text style={styles.availableText}>Nativetag available</Text>
            </View>
          ) : (
            <Text style={styles.errorText}>Must be at least 3 characters</Text>
          )}
          <Text style={styles.counterText}>{cleanHandle.length}/32</Text>
        </View>

        <View style={styles.suggestionsRow}>
          {suggestions.map((sug) => {
            const isSelected = cleanHandle === sug;
            return (
              <TouchableOpacity
                key={sug}
                style={[styles.suggestionPill, isSelected && styles.suggestionPillSelected]}
                onPress={() => {
                  sounds.playKeyClick();
                  setHandle(sug);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.suggestionPillText,
                    isSelected && styles.suggestionPillTextSelected,
                  ]}
                >
                  @{sug}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footerArea}>
        <TouchableOpacity
          style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
          activeOpacity={0.85}
        >
          <Text style={[styles.continueButtonText, !isValid && styles.continueButtonTextDisabled]}>
            Continue
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
  content: {
    flex: 1,
    paddingTop: space.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: space.xxl,
  },
  titleArea: {
    flex: 1,
    paddingRight: space.lg,
  },
  title: {
    ...type.screenTitle,
    marginBottom: space.xs,
  },
  subtitle: {
    ...type.body,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputLabel: {
    ...type.caption,
    marginBottom: space.xs,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  atSymbol: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginRight: space.xs,
  },
  textInput: {
    flex: 1,
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    outlineStyle: 'none' as any,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space.xs,
    marginTop: space.md,
  },
  availableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  availableText: {
    color: colors.positive,
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: colors.negative,
    fontSize: 13,
  },
  counterText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: space.lg,
  },
  suggestionPill: {
    height: 38,
    paddingHorizontal: space.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionPillSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  suggestionPillText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionPillTextSelected: {
    color: colors.accent,
  },
  footerArea: {
    paddingTop: space.lg,
  },
  continueButton: {
    ...primaryButton,
  },
  continueButtonDisabled: {
    ...disabledButton,
  },
  continueButtonText: {
    ...primaryButtonText,
  },
  continueButtonTextDisabled: {
    ...disabledButtonText,
  },
});
