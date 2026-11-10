import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { CountryPickerModal } from './CountryPickerModal';
import { COUNTRIES, Country } from '../../data/countries';
import { sounds } from '../../utils/soundEffects';

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
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Country of residence</Text>
        <Text style={styles.subtitle}>
          The terms and services which apply to you, will depend on your country of residence
        </Text>

        {/* Dropdown Selector Box (Revolut iOS 14.png) */}
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => {
            sounds.playKeyClick();
            setShowPicker(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.countryName}>{selectedCountry.name}</Text>
          <ChevronDown size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Footer Legal & CTA */}
      <View style={styles.footerArea}>
        <Text style={styles.legalText}>
          By pressing "Agree and continue", you have read and agreed to the{' '}
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
  content: {
    flex: 1,
    paddingTop: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
  },
  selectBox: {
    height: 58,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagIcon: {
    fontSize: 22,
  },
  countryName: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  footerArea: {
    gap: 18,
  },
  legalText: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  legalLink: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  acceptButton: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});

