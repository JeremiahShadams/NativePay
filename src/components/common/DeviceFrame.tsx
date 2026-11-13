import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, SafeAreaView } from 'react-native';
import { Monitor, Smartphone } from 'lucide-react-native';
import { colors, radius, space, type } from '../../theme';

const ANDROID_STATUS_BAR =
  Platform.OS === 'android'
    ? (StatusBar.currentHeight && StatusBar.currentHeight > 0 ? StatusBar.currentHeight : 32)
    : 0;

interface DeviceFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onJumpToDashboard?: () => void;
  onResetOnboarding?: () => void;
  isDashboardActive?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  isMobileFrame,
  onToggleFrame,
  onJumpToDashboard,
  onResetOnboarding,
  isDashboardActive = false,
}) => {
  // On a real device (Expo Go on iOS or Android) render native full screen with safe area clearance.
  if (Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.nativeContainer}>
        <StatusBar barStyle="light-content" {...({ backgroundColor: colors.black, translucent: true } as any)} />
        <View style={styles.nativeScreenInner}>{children}</View>
      </SafeAreaView>
    );
  }

  // On the web, render the interactive chassis with demo controls.
  return (
    <View style={styles.outerWrapper}>
      <View style={styles.topControlBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandLogoText}>N</Text>
          </View>
          <Text style={styles.brandTitle}>Native</Text>
        </View>

        <View style={styles.actionsRow}>
          {onResetOnboarding && onJumpToDashboard && (
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                onPress={onResetOnboarding}
                style={[styles.segment, !isDashboardActive && styles.segmentActive]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentText,
                    !isDashboardActive && styles.segmentTextActive,
                  ]}
                >
                  Onboarding
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onJumpToDashboard}
                style={[styles.segment, isDashboardActive && styles.segmentActive]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isDashboardActive && styles.segmentTextActive,
                  ]}
                >
                  App
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={onToggleFrame}
            style={styles.iconBtn}
            accessibilityLabel={isMobileFrame ? 'Switch to fullscreen' : 'Switch to mobile frame'}
          >
            {isMobileFrame ? (
              <Monitor size={18} color={colors.textSecondary} />
            ) : (
              <Smartphone size={18} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainCanvas}>
        {isMobileFrame ? (
          <View style={styles.phoneChassis}>
            <View style={styles.dynamicIslandContainer}>
              <View style={styles.dynamicIsland} />
            </View>

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

            <View style={styles.screenInner}>{children}</View>

            <View style={styles.homeIndicatorWrapper}>
              <View style={styles.homeIndicator} />
            </View>
          </View>
        ) : (
          <View style={styles.fullscreenContent}>{children}</View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: colors.black,
    paddingTop: ANDROID_STATUS_BAR,
  },
  nativeScreenInner: {
    flex: 1,
    backgroundColor: colors.background,
  },
  outerWrapper: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.lg,
    paddingHorizontal: space.lg,
  },
  topControlBar: {
    width: '100%',
    maxWidth: 1100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: space.sm,
    paddingLeft: space.lg,
    paddingRight: space.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  brandBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogoText: {
    color: colors.onLight,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.pill,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  segmentActive: {
    backgroundColor: colors.surfaceRaised,
  },
  segmentText: {
    ...type.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.text,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSunken,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
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
    maxHeight: '100%',
    backgroundColor: colors.background,
    borderRadius: 46,
    borderWidth: 7,
    borderColor: colors.cardMetal,
    overflow: 'hidden',
    position: 'relative',
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
    width: 116,
    height: 30,
    backgroundColor: colors.black,
    borderRadius: radius.pill,
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
    color: colors.text,
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
    backgroundColor: colors.text,
    borderRadius: 1,
  },
  statusNet: {
    color: colors.text,
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
    backgroundColor: colors.text,
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
    backgroundColor: colors.background,
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
    width: 132,
    height: 4.5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: radius.pill,
  },
  fullscreenContent: {
    width: '100%',
    maxWidth: 600,
    minHeight: 780,
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    paddingTop: 16,
    paddingBottom: 24,
  },
});
