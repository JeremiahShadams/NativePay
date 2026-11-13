import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';
import { NumericKeypad } from '../common/NumericKeypad';
import { CountryPickerModal } from './CountryPickerModal';
import { PhoneConfirmModal } from './PhoneConfirmModal';
import { COUNTRIES, Country } from '../../data/countries';
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

interface PhoneInputStepProps {
  onBack: () => void;
  onContinue: (fullPhone: string) => void;
  onLogIn: () => void;
}

export const PhoneInputStep: React.FC<PhoneInputStepProps> = ({
  onBack,
  onContinue,
  onLogIn,
}) => {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [rawDigits, setRawDigits] = useState('6502137390');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatPhoneNumber = (digits: string) => {
    if (country.code === 'US' || country.code === 'CA') {
      if (digits.length === 0) return '';
      if (digits.length <= 3) return `(${digits}`;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    return digits.replace(/(\d{3})(?=\d)/g, '$1 ');
  };

  const handleDigitPress = (digit: string) => {
    if (rawDigits.length < 12) {
      setRawDigits((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setRawDigits((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    sounds.playKeyClick();
    setRawDigits('');
  };

  const handleSubmit = () => {
    if (rawDigits.length >= 7) {
      sounds.playKeyClick();
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowConfirmModal(true);
      }, 500);
    }
  };

  const handleConfirmed = () => {
    setShowConfirmModal(false);
    onContinue(`${country.dialCode} ${formatPhoneNumber(rawDigits)}`);
  };

  const formatted = formatPhoneNumber(rawDigits);
  const isValid = rawDigits.length >= 7;

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
        <Text style={styles.title}>Let's get started</Text>
        <Text style={styles.subtitle}>
          Enter your phone number and we'll send you a confirmation code.
        </Text>

        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.countryPill}
            onPress={() => {
              sounds.playKeyClick();
              setShowCountryModal(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.flagIcon}>{country.flag}</Text>
            <Text style={styles.dialCodeText}>{country.dialCode}</Text>
          </TouchableOpacity>

          <View style={styles.phoneBox}>
            <Text style={[styles.phoneText, !formatted && styles.placeholderText]}>
              {formatted || 'Enter your phone'}
            </Text>
            {rawDigits.length > 0 && (
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearBtn}
                accessibilityLabel="Clear phone number"
              >
                <X size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            sounds.playKeyClick();
            onLogIn();
          }}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid || isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.onLight} />
          ) : (
            <Text style={[styles.submitButtonText, !isValid && styles.submitButtonTextDisabled]}>
              Create account
            </Text>
          )}
        </TouchableOpacity>

        <NumericKeypad
          onDigitPress={handleDigitPress}
          onBackspace={handleBackspace}
          showExtraSymbols
        />
      </View>

      <CountryPickerModal
        visible={showCountryModal}
        selectedCountry={country}
        onSelectCountry={(c) => setCountry(c)}
        onClose={() => setShowCountryModal(false)}
      />

      <PhoneConfirmModal
        visible={showConfirmModal}
        flag={country.flag}
        formattedPhoneNumber={`${country.dialCode} ${formatted}`}
        onConfirm={handleConfirmed}
        onGoBack={() => setShowConfirmModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  topNav: {
    paddingHorizontal: space.lg,
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
    paddingHorizontal: space.xl,
    paddingTop: space.sm,
  },
  title: {
    ...type.screenTitle,
    marginBottom: space.xs,
  },
  subtitle: {
    ...type.body,
    marginBottom: space.xl,
  },
  inputRow: {
    flexDirection: 'row',
    gap: space.sm,
    alignItems: 'center',
  },
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    gap: space.sm,
  },
  flagIcon: {
    fontSize: 20,
  },
  dialCodeText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  phoneBox: {
    flex: 1,
    height: 54,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  phoneText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  clearBtn: {
    padding: space.xs,
  },
  loginLink: {
    marginTop: space.lg,
  },
  loginLinkText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomArea: {
    paddingHorizontal: space.lg,
    paddingBottom: space.xs,
    gap: space.md,
  },
  submitButton: {
    ...primaryButton,
  },
  submitButtonDisabled: {
    ...disabledButton,
  },
  submitButtonText: {
    ...primaryButtonText,
  },
  submitButtonTextDisabled: {
    ...disabledButtonText,
  },
});
