import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';

interface StorySlidesProps {
  onCreateAccount: () => void;
  onLogIn: () => void;
}

export const StorySlides: React.FC<StorySlidesProps> = ({ onCreateAccount, onLogIn }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 0,
      title: 'READY TO CHANGE\nTHE WAY YOU MONEY?',
      subtitle: 'Native accounts • Instant crypto transfers • Zero hidden fees',
      type: 'coin',
    },
    {
      id: 1,
      title: 'EASY TO PAY AT\nHOME AND AWAY',
      subtitle: 'Obsidian metal cards available on Native plans with 0% FX fees worldwide.',
      type: 'cards',
    },
    {
      id: 2,
      title: 'INVEST YOUR WAY,\nFROM $1',
      subtitle: 'Zero-commission crypto exchange & autonomous AI routing across 10+ chains.',
      type: 'invest',
    },
  ];

  // Auto advance stories every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    sounds.playKeyClick();
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    sounds.playKeyClick();
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <View style={styles.container}>
      {/* Story Progress Indicators at Top */}
      <View style={styles.progressRow}>
        {slides.map((s, i) => (
          <TouchableOpacity
            key={s.id}
            style={styles.progressBarWrapper}
            onPress={() => setActiveSlide(i)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: i === activeSlide ? '100%' : i < activeSlide ? '100%' : '0%',
                  opacity: i === activeSlide ? 1 : i < activeSlide ? 0.6 : 0.2,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Header Tag */}
      <View style={styles.headerRow}>
        <View style={styles.logoPill}>
          <Text style={styles.logoLetter}>N</Text>
        </View>
        <Text style={styles.headerText}>Welcome to Native</Text>
      </View>

      {/* Interactive Story Content Area */}
      <View style={styles.contentArea}>
        {/* Tap targets for prev/next slide */}
        <TouchableOpacity style={styles.leftTapTarget} onPress={handlePrev} />
        <TouchableOpacity style={styles.rightTapTarget} onPress={handleNext} />

        {/* Dynamic Graphic Visual Based on Slide */}
        <View style={styles.graphicContainer}>
          {activeSlide === 0 && (
            <View style={styles.slide0Visual}>
              {/* Speedlines effect */}
              <View style={styles.speedline1} />
              <View style={styles.speedline2} />
              <View style={styles.speedline3} />
              {/* 3D Native Coin */}
              <View style={styles.coinOuter}>
                <View style={styles.coinEdge}>
                  <View style={styles.coinFace}>
                    <Text style={styles.coinSymbol}>N</Text>
                  </View>
                </View>
              </View>
              <View style={styles.coinGlow} />
            </View>
          )}

          {activeSlide === 1 && (
            <View style={styles.slide1Visual}>
              {/* Card 1: Rose Gold Metal */}
              <View style={[styles.cardItem, styles.cardBack]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardBrand}>Native</Text>
                  <Text style={styles.cardType}>METAL</Text>
                </View>
                <View style={styles.cardChip} />
              </View>

              {/* Card 2: Obsidian Cyber Card */}
              <View style={[styles.cardItem, styles.cardFront]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardBrand}>Native</Text>
                  <Zap size={18} color="#60a5fa" />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardChipGold} />
                  <Text style={styles.contactlessIcon}>))))</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardNumber}>•••• 8824</Text>
                  <Text style={styles.cardTier}>FOUNDER EDITION</Text>
                </View>
              </View>
            </View>
          )}

          {activeSlide === 2 && (
            <View style={styles.slide2Visual}>
              <View style={styles.tokenPillRow}>
                <View style={[styles.tokenBadge, { borderColor: '#F7931A' }]}>
                  <Text style={{ fontSize: 18 }}>₿</Text>
                  <Text style={styles.tokenBadgeText}>BTC $95,000</Text>
                </View>
                <View style={[styles.tokenBadge, { borderColor: '#627EEA' }]}>
                  <Text style={{ fontSize: 18 }}>Ξ</Text>
                  <Text style={styles.tokenBadgeText}>ETH $3,300</Text>
                </View>
              </View>

              <View style={styles.centerTokenCircle}>
                <Text style={styles.centerTokenIcon}>✦</Text>
                <Text style={styles.centerTokenLabel}>NATIVE AI L2</Text>
              </View>

              <View style={styles.tokenPillRow}>
                <View style={[styles.tokenBadge, { borderColor: '#14F195' }]}>
                  <Text style={{ fontSize: 18 }}>◎</Text>
                  <Text style={styles.tokenBadgeText}>SOL $190</Text>
                </View>
                <View style={[styles.tokenBadge, { borderColor: '#2775CA' }]}>
                  <Text style={{ fontSize: 18 }}>$</Text>
                  <Text style={styles.tokenBadgeText}>USDC $1.00</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Title and Subtitle */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{slides[activeSlide].title}</Text>
          <Text style={styles.subtitleText}>{slides[activeSlide].subtitle}</Text>
        </View>
      </View>

      {/* Bottom CTA Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            sounds.playKeyClick();
            onCreateAccount();
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Create account</Text>
          <ArrowRight size={18} color="#000000" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            sounds.playKeyClick();
            onLogIn();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080a10',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
    paddingTop: 4,
    marginBottom: 12,
  },
  progressBarWrapper: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  logoPill: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  leftTapTarget: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    zIndex: 10,
  },
  rightTapTarget: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    zIndex: 10,
  },
  graphicContainer: {
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  slide0Visual: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 220,
    height: 220,
  },
  speedline1: {
    position: 'absolute',
    width: 280,
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.4)',
    transform: [{ rotate: '-35deg' }],
  },
  speedline2: {
    position: 'absolute',
    width: 260,
    height: 1,
    backgroundColor: 'rgba(96, 165, 250, 0.3)',
    transform: [{ rotate: '45deg' }],
  },
  speedline3: {
    position: 'absolute',
    width: 240,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ rotate: '15deg' }],
  },
  coinOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#1e293b',
    borderWidth: 5,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
  },
  coinEdge: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinFace: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#1e2640',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  coinSymbol: {
    color: '#ffffff',
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -2,
    textShadowColor: 'rgba(59, 130, 246, 0.9)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  coinGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    zIndex: -1,
  },
  slide1Visual: {
    width: 260,
    height: 220,
    position: 'relative',
    alignItems: 'center',
  },
  cardItem: {
    width: 230,
    height: 140,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'space-between',
    position: 'absolute',
    borderWidth: 1,
  },
  cardBack: {
    top: 10,
    backgroundColor: 'linear-gradient(135deg, #475569, #1e293b)' as unknown as string,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ translateY: -15 }, { scale: 0.92 }],
    opacity: 0.7,
  },
  cardFront: {
    top: 50,
    backgroundColor: '#0f172a',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cardType: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardChip: {
    width: 32,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardChipGold: {
    width: 34,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#d97706',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactlessIcon: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 16,
    letterSpacing: -2,
    transform: [{ rotate: '90deg' }],
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardNumber: {
    color: '#cbd5e1',
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
  cardTier: {
    color: '#60a5fa',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  slide2Visual: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  tokenPillRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
  },
  tokenBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  centerTokenCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#60a5fa',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 18,
  },
  centerTokenIcon: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
  },
  centerTokenLabel: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  textContainer: {
    marginTop: 18,
    alignItems: 'flex-start',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitleText: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  buttonContainer: {
    gap: 10,
    marginTop: 16,
  },
  primaryButton: {
    height: 54,
    backgroundColor: '#ffffff',
    borderRadius: 27,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

