import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { CountryPickerModal } from './CountryPickerModal';
import { COUNTRIES, Country } from '../../data/countries';
import { sounds } from '../../utils/soundEffects';
import {
  colors,
  radius,
  space,
  type,
  primaryButton,
  primaryButtonText,
} from '../../theme';

interface CountryResidenceStepProps {
  onBack: () => void;
  onContinue: (country: Country) => void;
}

export const CountryResidenceStep: React.FC<CountryResidenceStepProps> = ({
  onBack,
  onContinue,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [showPicker, setShowPicker] = useState(false);

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
        <Text style={styles.title}>Country of residence</Text>
        <Text style={styles.subtitle}>
          The terms that apply to you depend on where you live.
        </Text>

        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => {
            sounds.playKeyClick();
            setShowPicker(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.countryName}>{selectedCountry.name}</Text>
          <ChevronDown size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.footerArea}>
        <Text style={styles.legalText}>
          By pressing "Accept and continue", you agree to the{' '}
          <Text style={styles.legalLink}>Native Privacy Policy</Text>,{' '}
          <Text style={styles.legalLink}>Lead Bank Terms</Text> and the{' '}
          <Text style={styles.legalLink}>E-sign Consent</Text>.
        </Text>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => {
            sounds.playKeyClick();
            onContinue(selectedCountry);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.acceptButtonText}>Accept and continue</Text>
        </TouchableOpacity>
      </View>

      <CountryPickerModal
        visible={showPicker}
        selectedCountry={selectedCountry}
        onSelectCountry={(c) => setSelectedCountry(c)}
        onClose={() => setShowPicker(false)}
      />
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
  selectBox: {
    height: 58,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countryName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  footerArea: {
    gap: space.lg,
  },
  legalText: {
    ...type.caption,
    textAlign: 'center',
  },
  legalLink: {
    color: colors.accent,
    fontWeight: '500',
  },
  acceptButton: {
    ...primaryButton,
  },
  acceptButtonText: {
    ...primaryButtonText,
  },
});
