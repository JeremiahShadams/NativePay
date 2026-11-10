import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';

interface LegalNameStepProps {
  onBack: () => void;
  onContinue: (nameData: { firstName: string; lastName: string; alias?: string }) => void;
}

export const LegalNameStep: React.FC<LegalNameStepProps> = ({ onBack, onContinue }) => {
  const [firstName, setFirstName] = useState('Alex'); // preset with example
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
      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Name as in ID</Text>
        <Text style={styles.subtitle}>Name as in your official documents</Text>

        <View style={styles.formArea}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.textInput}
                placeholder="First name"
                placeholderTextColor="#64748b"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <Text style={styles.hintText}>e.g. Daniel, not "Dan"</Text>
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.textInput}
                placeholder="Last name"
                placeholderTextColor="#64748b"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Alias */}
          <View style={styles.inputGroup}>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.textInput}
                placeholder="Alias"
                placeholderTextColor="#64748b"
                value={alias}
                onChangeText={setAlias}
              />
            </View>
            <Text style={styles.hintText}>Optional</Text>
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.footerArea}>
        <TouchableOpacity
          style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
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
    marginBottom: 28,
  },
  formArea: {
    gap: 18,
  },
  inputGroup: {
    gap: 6,
  },
  inputCard: {
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  textInput: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    outlineStyle: 'none' as any,
  },
  hintText: {
    color: '#64748b',
    fontSize: 12,
    paddingHorizontal: 4,
  },
  footerArea: {
    paddingTop: 16,
  },
  continueButton: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});

