import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';
import {
  colors,
  radius,
  space,
  type,
  primaryButton,
  primaryButtonText,
  secondaryButton,
  secondaryButtonText,
} from '../../theme';

interface InstantNotificationsStepProps {
  onBack: () => void;
  onContinue: () => void;
}

export const InstantNotificationsStep: React.FC<InstantNotificationsStepProps> = ({
  onBack,
  onContinue,
}) => {
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
        <View style={styles.illustration}>
          <Bell size={36} color={colors.text} strokeWidth={1.75} />
        </View>

        <Text style={styles.title}>Stay in the loop</Text>
        <Text style={styles.subtitle}>
          Get a notification the moment a payment clears, so your balance is always up to date.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.enableBtn}
          onPress={() => {
            sounds.playSuccessChime();
            onContinue();
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.enableBtnText}>Enable notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.notNowBtn}
          onPress={() => {
            sounds.playKeyClick();
            onContinue();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.notNowBtnText}>Not now</Text>
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
    paddingHorizontal: space.sm,
  },
  illustration: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xxl,
  },
  title: {
    ...type.screenTitle,
    textAlign: 'center',
    marginBottom: space.sm,
  },
  subtitle: {
    ...type.body,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: space.sm,
  },
  enableBtn: {
    ...primaryButton,
  },
  enableBtnText: {
    ...primaryButtonText,
  },
  notNowBtn: {
    ...secondaryButton,
  },
  notNowBtnText: {
    ...secondaryButtonText,
  },
});
