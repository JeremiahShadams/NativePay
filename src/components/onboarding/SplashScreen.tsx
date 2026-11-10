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
    paddingBottom: 24,
  },
  homeIndicator: {
    width: 140,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
});

