import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, ChevronRight, FileText, Zap } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';
import { colors, radius, space, type } from '../../theme';

interface IdentityKycStepProps {
  onBack: () => void;
  onSelectMethod: (method: 'fast_id' | 'documents') => void;
}

export const IdentityKycStep: React.FC<IdentityKycStepProps> = ({
  onBack,
  onSelectMethod,
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
        <Text style={styles.title}>Verify your identity</Text>
        <Text style={styles.subtitle}>
          Choose how you'd like to confirm who you are.
        </Text>

        <View style={styles.cardsColumn}>
          <TouchableOpacity
            style={styles.methodCard}
            onPress={() => {
              sounds.playSuccessChime();
              onSelectMethod('fast_id');
            }}
            activeOpacity={0.75}
          >
            <View style={styles.iconCircle}>
              <Zap size={20} color={colors.text} />
            </View>
            <View style={styles.methodTextContainer}>
              <Text style={styles.methodTitle}>Verify with Singpass MyInfo</Text>
              <Text style={styles.methodDesc}>
                Instant verification using the Singpass government database.
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.methodCard}
            onPress={() => {
              sounds.playKeyClick();
              onSelectMethod('documents');
            }}
            activeOpacity={0.75}
          >
            <View style={styles.iconCircle}>
              <FileText size={20} color={colors.text} />
            </View>
            <View style={styles.methodTextContainer}>
              <Text style={styles.methodTitle}>Verify with documents</Text>
              <Text style={styles.methodDesc}>
                Enter your details and upload an NRIC, passport or permit.
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: space.xl,
    paddingBottom: space.xxl,
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
  cardsColumn: {
    gap: space.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodTextContainer: {
    flex: 1,
    gap: space.xs,
  },
  methodTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  methodDesc: {
    ...type.caption,
  },
});
