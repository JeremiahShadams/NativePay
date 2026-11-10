import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';
import { NumericKeypad } from '../common/NumericKeypad';
import { CountryPickerModal } from './CountryPickerModal';
import { PhoneConfirmModal } from './PhoneConfirmModal';
import { COUNTRIES, Country } from '../../data/countries';
import { sounds } from '../../utils/soundEffects';

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
  const [country, setCountry] = useState<Country>(COUNTRIES[0]); // default US +1
  const [rawDigits, setRawDigits] = useState('6502137390'); // preset with example from screenshot
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Format as (XXX) XXX-XXXX for US, or generic spaced
  const formatPhoneNumber = (digits: string) => {
    if (country.code === 'US' || country.code === 'CA') {
      if (digits.length === 0) return '';
      if (digits.length <= 3) return `(${digits}`;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    // Generic format
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
      {/* Top Bar with Back Arrow */}
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

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Let's get started!</Text>
        <Text style={styles.subtitle}>
          Enter your phone number. We will send you a confirmation code there
        </Text>

        {/* Input Row */}
        <View style={styles.inputRow}>
          {/* Country Selector Pill */}
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

          {/* Phone Display Box */}
          <View style={styles.phoneBox}>
            <Text
              style={[
                styles.phoneText,
                !formatted && styles.placeholderText,
              ]}
            >
              {formatted || 'Enter your phone'}
            </Text>
            {rawDigits.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                <X size={16} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Log In Link */}
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

      {/* Action Button & Keypad */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isValid && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isValid || isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text
              style={[
                styles.submitButtonText,
                !isValid && styles.submitButtonTextDisabled,
              ]}
            >
              Create account
            </Text>
          )}
        </TouchableOpacity>

        {/* Numeric Keypad */}
        <NumericKeypad
          onDigitPress={handleDigitPress}
          onBackspace={handleBackspace}
          showExtraSymbols={true}
        />
      </View>

      {/* Modals */}
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
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  topNav: {
    paddingHorizontal: 16,
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
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 8,
  },
  flagIcon: {
    fontSize: 20,
  },
  dialCodeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneBox: {
    flex: 1,
    height: 54,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  phoneText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  placeholderText: {
    color: '#64748b',
  },
  clearBtn: {
    padding: 4,
  },
  loginLink: {
    marginTop: 16,
  },
  loginLinkText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    gap: 12,
  },
  submitButton: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#3a3a3c',
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: '#8e8e93',
  },
});

