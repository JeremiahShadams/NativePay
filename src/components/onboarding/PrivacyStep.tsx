import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';
import {
  colors,
  radius,
  space,
  type,
  primaryButton,
  primaryButtonText,
} from '../../theme';

interface PrivacyStepProps {
  onBack: () => void;
  onContinue: () => void;
}

export const PrivacyStep: React.FC<PrivacyStepProps> = ({ onBack, onContinue }) => {
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
        <Text style={styles.title}>Personalised ads</Text>
        <Text style={styles.subtitle}>
          We use device activity to show ads that are relevant to you. You can allow or
          deny tracking on the next screen, and change your mind at any time.
        </Text>

        <TouchableOpacity
          style={styles.learnMoreLink}
          onPress={() => sounds.playKeyClick()}
        >
          <Text style={styles.learnMoreText}>Learn more</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerArea}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            sounds.playKeyClick();
            onContinue();
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space.md,
  },
  title: {
    ...type.screenTitle,
    textAlign: 'center',
    marginBottom: space.md,
  },
  subtitle: {
    ...type.body,
    textAlign: 'center',
    marginBottom: space.lg,
  },
  learnMoreLink: {
    padding: space.xs,
  },
  learnMoreText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  footerArea: {
    paddingTop: space.lg,
  },
  continueButton: {
    ...primaryButton,
  },
  continueButtonText: {
    ...primaryButtonText,
  },
});
