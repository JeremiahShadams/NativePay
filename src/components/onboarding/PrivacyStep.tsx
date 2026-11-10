import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';

interface PrivacyStepProps {
  onBack: () => void;
  onContinue: () => void;
}

export const PrivacyStep: React.FC<PrivacyStepProps> = ({ onBack, onContinue }) => {
  const [isEnabled, setIsEnabled] = useState(true);

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
      </View>

      {/* Main Graphic & Text */}
      <View style={styles.content}>
        {/* Toggle Graphic (Screenshot 22) */}
        <TouchableOpacity
          style={styles.toggleGraphicWrapper}
          onPress={() => {
            sounds.playKeyClick();
            setIsEnabled(!isEnabled);
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.toggleTrack, isEnabled && styles.toggleTrackActive]}>
            <View style={[styles.toggleThumb, isEnabled && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>INTELLIGENT AI & RELEVANT OFFERS</Text>
        <Text style={styles.subtitle}>
          Native uses localized machine learning and zero-knowledge intelligence to optimize your crypto swap routes, detect phishing contracts, and bring you customized cashback rates.
        </Text>

        <TouchableOpacity
          style={styles.learnMoreLink}
          onPress={() => sounds.playKeyClick()}
        >
          <Text style={styles.learnMoreText}>Learn more</Text>
        </TouchableOpacity>
      </View>

      {/* Continue CTA */}
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
    backgroundColor: '#080a10',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  toggleGraphicWrapper: {
    marginBottom: 36,
  },
  toggleTrack: {
    width: 100,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e293b',
    padding: 6,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleTrackActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  toggleThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    transform: [{ translateX: 0 }],
  },
  toggleThumbActive: {
    transform: [{ translateX: 44 }],
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 20,
  },
  learnMoreLink: {
    padding: 6,
  },
  learnMoreText: {
    color: '#3b82f6',
    fontSize: 14,
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
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});

