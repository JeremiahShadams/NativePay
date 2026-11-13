import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
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

interface LegalNameStepProps {
  onBack: () => void;
  onContinue: (nameData: { firstName: string; lastName: string; alias?: string }) => void;
}

export const LegalNameStep: React.FC<LegalNameStepProps> = ({ onBack, onContinue }) => {
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Smith');
  const [alias, setAlias] = useState('');

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleSubmit = () => {
    if (isValid) {
      sounds.playKeyClick();
      onContinue({ firstName, lastName, alias });
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
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Your legal name</Text>
        <Text style={styles.subtitle}>
          Enter your name exactly as it appears on your ID.
        </Text>

        <View style={styles.formArea}>
          <View style={styles.inputGroup}>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.textInput}
                placeholder="First name"
                placeholderTextColor={colors.textMuted}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <Text style={styles.hintText}>Use your full name, e.g. Daniel rather than Dan.</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.textInput}
                placeholder="Last name"
                placeholderTextColor={colors.textMuted}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.textInput}
                placeholder="Alias (optional)"
                placeholderTextColor={colors.textMuted}
                value={alias}
                onChangeText={setAlias}
              />
            </View>
          </View>
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
  content: {
    flex: 1,
    paddingTop: space.md,
  },
  title: {
    ...type.screenTitle,
    marginBottom: space.sm,
  },
  subtitle: {
    ...type.body,
    marginBottom: space.xxl,
  },
  formArea: {
    gap: space.lg,
  },
  inputGroup: {
    gap: space.xs,
  },
  inputCard: {
    height: 56,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    outlineStyle: 'none' as any,
  },
  hintText: {
    ...type.caption,
    paddingHorizontal: space.xs,
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
