import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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
      subtitle: '',
      isDark: true,
    },
    {
      id: 1,
      title: 'EASY TO PAY AT\nHOME AND AWAY',
      subtitle: 'Some cards available on paid plans or in certain countries only.',
      isDark: false, // Pure white background from Revolut iOS 2.png
    },
    {
      id: 2,
      title: 'INVEST YOUR WAY,\nFROM $1',
      subtitle: 'Capital at risk. Fees may apply.',
      isDark: true,
    },
  ];

  // Auto-advance stories every 5 seconds
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

  const current = slides[activeSlide];

  return (
    <View style={[styles.container, { backgroundColor: current.isDark ? '#000000' : '#ffffff' }]}>
      {/* Top Segmented Story Bars (Revolut iOS 1, 2, 3) */}
      <View style={styles.topProgressWrapper}>
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
                    backgroundColor: current.isDark ? '#ffffff' : '#000000',
                    width: i === activeSlide ? '100%' : i < activeSlide ? '100%' : '0%',
                    opacity: i === activeSlide ? 1 : i < activeSlide ? 0.6 : 0.2,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Header Tag: Welcome to Native */}
        <View style={styles.headerRow}>
          <View style={[styles.logoPill, { backgroundColor: current.isDark ? '#ffffff' : '#000000' }]}>
            <Text style={[styles.logoLetter, { color: current.isDark ? '#000000' : '#ffffff' }]}>N</Text>
          </View>
          <Text style={[styles.headerText, { color: current.isDark ? '#ffffff' : '#000000' }]}>
            Welcome to Native
          </Text>
        </View>
      </View>

      {/* Main Content Area with tap gestures */}
      <View style={styles.contentArea}>
        <TouchableOpacity style={styles.leftTapTarget} onPress={handlePrev} activeOpacity={1} />
        <TouchableOpacity style={styles.rightTapTarget} onPress={handleNext} activeOpacity={1} />

        {/* Headline & Subtitle */}
        <View style={styles.headerTextBlock}>
          <Text style={[styles.mainHeadline, { color: current.isDark ? '#ffffff' : '#000000' }]}>
            {current.title}
          </Text>
          {current.subtitle ? (
            <Text style={[styles.subtitleText, { color: current.isDark ? '#8e8e93' : '#666666' }]}>
              {current.subtitle}
            </Text>
          ) : null}
        </View>

        {/* Graphic Area */}
        <View style={styles.graphicStage}>
          {/* SLIDE 0: 3D Perspective Metallic Coin in Hyperspace (Revolut iOS 1.png) */}
          {activeSlide === 0 && (
            <View style={styles.coinStage}>
              {/* Radial Hyperspace Speedlines */}
              <View style={[styles.speedline, { transform: [{ rotate: '-45deg' }] }]} />
              <View style={[styles.speedline, { transform: [{ rotate: '-25deg' }] }]} />
              <View style={[styles.speedline, { transform: [{ rotate: '0deg' }] }]} />
              <View style={[styles.speedline, { transform: [{ rotate: '25deg' }] }]} />
              <View style={[styles.speedline, { transform: [{ rotate: '45deg' }] }]} />
              <View style={[styles.speedline, { transform: [{ rotate: '70deg' }] }]} />
              <View style={[styles.speedline, { transform: [{ rotate: '-70deg' }] }]} />

              {/* 3D Perspective Platinum Coin */}
              <View style={styles.coinPerspectiveWrapper}>
                <View style={styles.coinEdge3D}>
                  <View style={styles.coinFace3D}>
                    <Text style={styles.coinLetter3D}>N</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* SLIDE 1: Stacked Physical Cards (Revolut iOS 2.png) */}
          {activeSlide === 1 && (
            <View style={styles.cardsStackStage}>
              {/* Card 1 (Back): Rose Gold Metal */}
              <View style={[styles.cardCommon, styles.roseGoldCard]}>
                <Text style={styles.cardBrandWhite}>Native</Text>
                <View style={styles.cardSimChip} />
              </View>

              {/* Card 2 (Middle): Vibrant Rainbow Horizon */}
              <View style={[styles.cardCommon, styles.rainbowCard]}>
                <Text style={styles.cardBrandWhite}>Native</Text>
                <View style={styles.cardSimChipRight} />
              </View>

              {/* Card 3 (Bottom Peeking): Obsidian Inverted Card with Numbers */}
              <View style={[styles.cardCommon, styles.invertedPeekingCard]}>
                <View style={styles.peekingRow}>
                  <Text style={styles.contactlessSymbol}>))))</Text>
                  <Text style={styles.peekingNumbers}>5273 4620 7703 5008</Text>
                  <Text style={styles.peekingMeta}>EXP 11/25  CVC 142</Text>
                </View>
              </View>
            </View>
          )}

          {/* SLIDE 2: 3D Stacked Discs / Assets (Revolut iOS 3.png) */}
          {activeSlide === 2 && (
            <View style={styles.discsStage}>
              {/* Disc 1: Dark Titanium (Google / Bitcoin) */}
              <View style={[styles.discItem, styles.discTitanium]}>
                <View style={styles.discInner}>
                  <Text style={styles.discEmboss}>G</Text>
                </View>
              </View>

              {/* Disc 2: Copper (Spotify) */}
              <View style={[styles.discItem, styles.discCopper]}>
                <View style={styles.discInner}>
                  <Text style={styles.discEmbossSmall}>≋</Text>
                </View>
              </View>

              {/* Disc 3: Silver Platinum (Apple) */}
              <View style={[styles.discItem, styles.discSilver]}>
                <View style={styles.discInner}>
                  <Text style={styles.discEmbossSmall}></Text>
                </View>
              </View>

              {/* Disc 4: Bronze (IBM) */}
              <View style={[styles.discItem, styles.discBronze]}>
                <View style={styles.discInner}>
                  <Text style={styles.discEmbossSmall}>IBM</Text>
                </View>
              </View>

              {/* Disc 5: Blue Steel (Microsoft) */}
              <View style={[styles.discItem, styles.discBlueSteel]}>
                <View style={styles.discInner}>
                  <Text style={styles.discEmbossSmall}>⊞</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Bottom CTA Pill Buttons (Revolut iOS 1, 2, 3) */}
      <View style={styles.bottomButtonsWrapper}>
        {/* Create account button */}
        <TouchableOpacity
          style={[
            styles.ctaButton,
            current.isDark
              ? styles.whitePillButton
              : styles.lightPillButton,
          ]}
          onPress={() => {
            sounds.playKeyClick();
            onCreateAccount();
          }}
          activeOpacity={0.88}
        >
          <Text
            style={[
              styles.ctaButtonText,
              { color: '#000000' },
            ]}
          >
            Create account
          </Text>
        </TouchableOpacity>

        {/* Log in button */}
        <TouchableOpacity
          style={[
            styles.ctaButton,
            current.isDark
              ? styles.translucentDarkPillButton
              : styles.blackPillButton,
          ]}
          onPress={() => {
            sounds.playKeyClick();
            onLogIn();
          }}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.ctaButtonText,
              { color: '#ffffff' },
            ]}
          >
            Log in
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomCuratedTag}>
          <Text style={[styles.curatedSmallText, { color: current.isDark ? '#666666' : '#999999' }]}>
            Native • curated by Mobbin
          </Text>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topProgressWrapper: {
    width: '100%',
    paddingTop: 8,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  progressBarWrapper: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(128, 128, 128, 0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoPill: {
    width: 22,
    height: 22,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    fontSize: 13,
    fontWeight: '900',
  },
  headerText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  contentArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  leftTapTarget: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '35%',
    zIndex: 10,
  },
  rightTapTarget: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '35%',
    zIndex: 10,
  },
  headerTextBlock: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  mainHeadline: {
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    marginTop: 10,
  },
  graphicStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },

  // SLIDE 0: 3D Coin & Speedlines
  coinStage: {
    width: 320,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  speedline: {
    position: 'absolute',
    width: 2,
    height: 300,
    backgroundColor: 'rgba(59, 130, 246, 0.35)',
  },
  coinPerspectiveWrapper: {
    width: 220,
    height: 120,
    transform: [{ rotateX: '55deg' }, { rotateZ: '-12deg' }],
  },
  coinEdge3D: {
    width: 220,
    height: 120,
    borderRadius: 110,
    backgroundColor: '#71717a',
    borderWidth: 4,
    borderColor: '#d4d4d8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 20,
  },
  coinFace3D: {
    width: 206,
    height: 106,
    borderRadius: 103,
    backgroundColor: '#e4e4e7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f4f4f5',
  },
  coinLetter3D: {
    fontSize: 72,
    fontWeight: '900',
    color: '#a1a1aa',
    letterSpacing: -2,
    transform: [{ scaleY: 1.1 }],
  },

  // SLIDE 1: Stacked Cards (Rose Gold, Rainbow, Peeking Obsidian)
  cardsStackStage: {
    width: 290,
    height: 270,
    position: 'relative',
    alignItems: 'center',
  },
  cardCommon: {
    width: 270,
    height: 150,
    borderRadius: 16,
    padding: 16,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  roseGoldCard: {
    top: 0,
    backgroundColor: '#e0a899',
    zIndex: 1,
  },
  rainbowCard: {
    top: 55,
    backgroundColor: '#ff5e3a',
    zIndex: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  invertedPeekingCard: {
    top: 130,
    backgroundColor: '#27272a',
    zIndex: 0,
  },
  cardBrandWhite: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cardSimChip: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 32,
    height: 24,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cardSimChipRight: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 32,
    height: 24,
    backgroundColor: '#fef08a',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ca8a04',
  },
  peekingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 80,
  },
  contactlessSymbol: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: '700',
  },
  peekingNumbers: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  peekingMeta: {
    color: '#a1a1aa',
    fontSize: 9,
    fontWeight: '600',
  },

  // SLIDE 2: Stacked Discs (Revolut iOS 3.png)
  discsStage: {
    width: 220,
    height: 270,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  discItem: {
    width: 170,
    height: 52,
    borderRadius: 85,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  discTitanium: {
    top: 10,
    backgroundColor: '#27272a',
    borderWidth: 2,
    borderColor: '#3f3f46',
    zIndex: 5,
  },
  discCopper: {
    top: 60,
    backgroundColor: '#9a3412',
    borderWidth: 2,
    borderColor: '#c2410c',
    zIndex: 4,
  },
  discSilver: {
    top: 110,
    backgroundColor: '#e4e4e7',
    borderWidth: 2,
    borderColor: '#ffffff',
    zIndex: 3,
  },
  discBronze: {
    top: 160,
    backgroundColor: '#78350f',
    borderWidth: 2,
    borderColor: '#92400e',
    zIndex: 2,
  },
  discBlueSteel: {
    top: 210,
    backgroundColor: '#1e3a8a',
    borderWidth: 2,
    borderColor: '#2563eb',
    zIndex: 1,
  },
  discInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  discEmboss: {
    fontSize: 26,
    fontWeight: '900',
    color: '#a1a1aa',
  },
  discEmbossSmall: {
    fontSize: 20,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.85)',
  },

  // BOTTOM CTA PILL BUTTONS (Revolut iOS 1, 2, 3)
  bottomButtonsWrapper: {
    width: '100%',
    gap: 12,
    paddingTop: 10,
  },
  ctaButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whitePillButton: {
    backgroundColor: '#ffffff',
  },
  lightPillButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  translucentDarkPillButton: {
    backgroundColor: '#1c1c1e',
  },
  blackPillButton: {
    backgroundColor: '#000000',
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  bottomCuratedTag: {
    alignItems: 'center',
    marginTop: 4,
  },
  curatedSmallText: {
    fontSize: 12,
  },
});
