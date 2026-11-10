import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Bell, Zap, Shield } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

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

      {/* Main Illustration */}
      <View style={styles.content}>
        <View style={styles.bannerVisual}>
          <View style={styles.notifCard}>
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>N</Text>
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifBarTop} />
              <View style={styles.notifBarBottom} />
            </View>
          </View>
          <View style={styles.glowAura} />
        </View>

        <Text style={styles.title}>INSTANT NOTIFICATIONS</Text>
        <Text style={styles.subtitle}>
          Get instant payment notifications as you spend with your card and know your balance is always up to date
        </Text>

        <View style={styles.perksList}>
          <View style={styles.perkItem}>
            <Zap size={18} color="#60a5fa" />
            <Text style={styles.perkText}>Real-time AI payment execution alerts</Text>
          </View>
          <View style={styles.perkItem}>
            <Shield size={18} color="#10b981" />
            <Text style={styles.perkText}>Instant biometric transaction approvals</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.enableBtn}
          onPress={() => {
            sounds.playSuccessChime();
            onContinue();
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.enableBtnText}>Enable push notifications</Text>
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
    paddingHorizontal: 8,
  },
  bannerVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    position: 'relative',
  },
  notifCard: {
    width: 220,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  notifBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadgeText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  notifContent: {
    flex: 1,
    gap: 6,
  },
  notifBarTop: {
    width: '70%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  notifBarBottom: {
    width: '45%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
  },
  glowAura: {
    position: 'absolute',
    width: 260,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    zIndex: -1,
  },
  title: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  perksList: {
    gap: 10,
    width: '100%',
    maxWidth: 320,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  perkText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 10,
  },
  enableBtn: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enableBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  notNowBtn: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notNowBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});

