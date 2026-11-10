import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, StatusBar } from 'react-native';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  activeScreenTitle: string;
  onJumpToDashboard?: () => void;
  onResetOnboarding?: () => void;
  isDashboardActive?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  isMobileFrame,
  onToggleFrame,
  activeScreenTitle,
  onJumpToDashboard,
  onResetOnboarding,
  isDashboardActive = false,
}) => {
  // On real native mobile devices (Expo Go on iOS or Android), render native full screen!
  if (Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.nativeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#080a10" />
        <View style={styles.nativeScreenInner}>{children}</View>
      </SafeAreaView>
    );
  }

  // On Web browser, render interactive chassis with desktop controls
  return (
    <View style={styles.outerWrapper}>
      {/* Top Quick Control Bar */}
      <View style={styles.topControlBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandLogoText}>N</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>NATIVE</Text>
            <Text style={styles.brandSubtitle}>Intelligent Crypto & Banking</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {/* Quick jump buttons */}
          {onResetOnboarding && (
            <TouchableOpacity
              onPress={onResetOnboarding}
              style={[
                styles.pillBtn,
                !isDashboardActive && styles.pillBtnActive
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.pillBtnText,
                !isDashboardActive && styles.pillBtnTextActive
              ]}>
                Onboarding Flow (24 Screens)
              </Text>
            </TouchableOpacity>
          )}

          {onJumpToDashboard && (
            <TouchableOpacity
              onPress={onJumpToDashboard}
              style={[
                styles.pillBtn,
                isDashboardActive && styles.pillBtnActive,
                styles.aiPillBtn
              ]}
              activeOpacity={0.7}
            >
              <Sparkles size={14} color={isDashboardActive ? "#ffffff" : "#60a5fa"} />
              <Text style={[
                styles.pillBtnText,
                isDashboardActive && styles.pillBtnTextActive,
                { marginLeft: 4 }
              ]}>
                App & AI Payment Agent
              </Text>
            </TouchableOpacity>
          )}

          {/* Toggle frame button */}
          <TouchableOpacity
            onPress={onToggleFrame}
            style={styles.iconBtn}
            title={isMobileFrame ? "Switch to Fullscreen" : "Switch to Mobile Frame"}
          >
            {isMobileFrame ? (
              <Monitor size={18} color="#94a3b8" />
            ) : (
              <Smartphone size={18} color="#94a3b8" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Container */}
      <View style={styles.mainCanvas}>
        {isMobileFrame ? (
          <View style={styles.phoneChassis}>
            {/* Dynamic Island / Speaker */}
            <View style={styles.dynamicIslandContainer}>
              <View style={styles.dynamicIsland} />
            </View>

            {/* iOS Status Bar */}
            <View style={styles.statusBar}>
              <Text style={styles.statusTime}>9:41</Text>
              <View style={styles.statusIcons}>
                <View style={styles.signalBars}>
                  <View style={[styles.bar, { height: 4 }]} />
                  <View style={[styles.bar, { height: 6 }]} />
                  <View style={[styles.bar, { height: 8 }]} />
                  <View style={[styles.bar, { height: 10 }]} />
                </View>
                <Text style={styles.statusNet}>5G</Text>
                <View style={styles.batteryOutline}>
                  <View style={styles.batteryLevel} />
                  <View style={styles.batteryNub} />
                </View>
              </View>
            </View>

            {/* App Screen Content */}
            <View style={styles.screenInner}>
              {children}
            </View>

            {/* Home Indicator */}
            <View style={styles.homeIndicatorWrapper}>
              <View style={styles.homeIndicator} />
            </View>
          </View>
        ) : (
          <View style={styles.fullscreenContent}>
            {children}
          </View>
        )}
      </View>

      {/* Footer Info */}
      <View style={styles.footerInfo}>
        <Text style={styles.footerText}>
          Native • Rebuilt from Examples • Built with React Native • Current: <Text style={{ color: '#60a5fa' }}>{activeScreenTitle}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: '#080a10',
  },
  nativeScreenInner: {
    flex: 1,
    backgroundColor: '#080a10',
  },
  outerWrapper: {
    flex: 1,
    backgroundColor: '#05070c',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topControlBar: {
    width: '100%',
    maxWidth: 1100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  brandLogoText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  aiPillBtn: {
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  pillBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  pillBtnTextActive: {
    color: '#ffffff',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  mainCanvas: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneChassis: {
    width: 395,
    height: 844,
    backgroundColor: '#080a10',
    borderRadius: 52,
    borderWidth: 8,
    borderColor: '#1e2433',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  dynamicIslandContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'none',
  },
  dynamicIsland: {
    width: 120,
    height: 32,
    backgroundColor: '#000000',
    borderRadius: 20,
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    paddingHorizontal: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 90,
    pointerEvents: 'none',
  },
  statusTime: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1.5,
    height: 10,
  },
  bar: {
    width: 2.5,
    backgroundColor: '#ffffff',
    borderRadius: 0.8,
  },
  statusNet: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  batteryOutline: {
    width: 22,
    height: 11,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 3.5,
    padding: 1.5,
    justifyContent: 'center',
    position: 'relative',
  },
  batteryLevel: {
    width: '75%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },
  batteryNub: {
    position: 'absolute',
    right: -3,
    width: 1.5,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 1,
  },
  screenInner: {
    flex: 1,
    backgroundColor: '#080a10',
    paddingTop: 46,
    paddingBottom: 24,
  },
  homeIndicatorWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'none',
  },
  homeIndicator: {
    width: 135,
    height: 4.5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 10,
  },
  fullscreenContent: {
    width: '100%',
    maxWidth: 600,
    minHeight: 780,
    backgroundColor: '#080a10',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1e2433',
    overflow: 'hidden',
    paddingTop: 16,
    paddingBottom: 24,
  },
  footerInfo: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },
});
