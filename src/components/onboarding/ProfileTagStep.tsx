import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ArrowLeft, Check, Camera, Sparkles } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';

interface ProfileTagStepProps {
  onBack: () => void;
  onContinue: (tag: string) => void;
}

export const ProfileTagStep: React.FC<ProfileTagStepProps> = ({ onBack, onContinue }) => {
  const [handle, setHandle] = useState('alexnative'); // preset
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);

  const cleanHandle = handle.replace(/^@/, '').toLowerCase().trim();
  const isValid = cleanHandle.length >= 3 && cleanHandle.length <= 32;

  const suggestions = ['alex_crypto', 'alex.eth', 'alex_native'];

  const handleSubmit = () => {
    if (isValid) {
      sounds.playSuccessChime();
      onContinue(`@${cleanHandle}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Nav */}
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
        <TouchableOpacity
          onPress={() => {
            sounds.playKeyClick();
            onContinue('@alex');
          }}
        >
          <Text style={styles.notNowText}>Not now</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleArea}>
            <Text style={styles.title}>Your profile</Text>
            <Text style={styles.subtitle}>
              Set your Nativetag and profile pic to get easily paid by your friends
            </Text>
          </View>

          {/* Profile Picture Circle with Edit Pencil */}
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => {
              sounds.playKeyClick();
              setHasCustomAvatar(!hasCustomAvatar);
            }}
            activeOpacity={0.8}
          >
            {hasCustomAvatar ? (
              <View style={styles.avatarImgMock}>
                <Text style={{ fontSize: 28 }}>👨‍💻</Text>
              </View>
            ) : (
              <Text style={styles.avatarInitials}>NT</Text>
            )}
            <View style={styles.editPencilBadge}>
              <Camera size={11} color="#000000" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Nativetag Input Box */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Nativetag</Text>
          <View style={styles.tagInputRow}>
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              style={styles.textInput}
              value={cleanHandle}
              onChangeText={(t) => setHandle(t.replace(/[^a-zA-Z0-9_]/g, ''))}
              placeholder="yourname"
              placeholderTextColor="#64748b"
              maxLength={32}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Status Line */}
        <View style={styles.statusRow}>
          {isValid ? (
            <View style={styles.availableRow}>
              <Check size={14} color="#10b981" />
              <Text style={styles.availableText}>Nativetag available</Text>
            </View>
          ) : (
            <Text style={styles.errorText}>Must be at least 3 characters</Text>
          )}
          <Text style={styles.counterText}>{cleanHandle.length}/32</Text>
        </View>

        {/* Suggestion Chips */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>Suggestions:</Text>
          <View style={styles.suggestionRow}>
            {suggestions.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.suggestionChip}
                onPress={() => {
                  sounds.playKeyClick();
                  setHandle(s);
                }}
              >
                <Sparkles size={11} color="#60a5fa" />
                <Text style={styles.suggestionChipText}>@{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Continue CTA */}
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
    backgroundColor: '#080a10',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topNav: {
    paddingTop: 4,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notNowText: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleArea: {
    flex: 1,
    paddingRight: 16,
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
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  avatarInitials: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  avatarImgMock: {
    width: '100%',
    height: '100%',
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  editPencilBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#080a10',
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  atSymbol: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    outlineStyle: 'none' as unknown as string,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 10,
  },
  availableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  availableText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
  },
  counterText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginTop: 24,
    gap: 8,
  },
  suggestionTitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    gap: 6,
  },
  suggestionChipText: {
    color: '#60a5fa',
    fontSize: 13,
    fontWeight: '600',
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

