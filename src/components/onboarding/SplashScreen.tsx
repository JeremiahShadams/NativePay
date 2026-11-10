import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={onFinish}
    >
      <View style={styles.centerContainer}>
        {/* Revolut iOS 0.png Style: Clean, bold minimalist wordmark centered on pure white */}
        <Text style={styles.brandWordmark}>Native</Text>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.curatedRow}>
          <Text style={styles.brandSmall}>Native</Text>
          <Text style={styles.curatedText}>curated by </Text>
          <Text style={styles.mobbinText}>Mobbin</Text>
        </View>
        <View style={styles.homeIndicator} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandWordmark: {
    fontSize: 54,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -1.5,
  },
  bottomBar: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 12,
  },
  curatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  brandSmall: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
    marginRight: 20,
  },
  curatedText: {
    fontSize: 12,
    color: '#8e8e93',
  },
  mobbinText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  homeIndicator: {
    width: 140,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
});
