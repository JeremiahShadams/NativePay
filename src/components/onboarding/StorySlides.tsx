import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wifi } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';
import { colors, radius, space } from '../../theme';

interface StorySlidesProps {
  onCreateAccount: () => void;
  onLogIn: () => void;
}

export const StorySlides: React.FC<StorySlidesProps> = ({ onCreateAccount, onLogIn }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 0,
      title: 'READY TO CHANGE\nTHE WAY YOU MOVE MONEY?',
      subtitle: '',
      isDark: true,
    },
    {
      id: 1,
      title: 'EASY TO PAY AT\nHOME AND AWAY',
      subtitle: 'Some cards are available on paid plans or in certain countries only.',
      isDark: false,
    },
    {
      id: 2,
      title: 'INVEST YOUR WAY,\nFROM $1',
      subtitle: 'Capital at risk. Fees may apply.',
      isDark: true,
    },
  ];

  // Auto-advance, restarting the timer whenever the slide changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeSlide, slides.length]);

  const handleNext = () => {
    sounds.playKeyClick();
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    sounds.playKeyClick();
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[activeSlide];
  const fg = current.isDark ? colors.text : colors.onLight;
  const muted = current.isDark ? colors.textSecondary : '#5F6470';

  return (
    <View style={[styles.container, { backgroundColor: current.isDark ? colors.background : colors.white }]}>
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
                    backgroundColor: fg,
                    opacity: i === activeSlide ? 1 : i < activeSlide ? 0.55 : 0.2,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.headerRow}>
          <View style={[styles.logoPill, { backgroundColor: fg }]}>
            <Text style={[styles.logoLetter, { color: current.isDark ? colors.onLight : colors.white }]}>
              N
            </Text>
          </View>
          <Text style={[styles.headerText, { color: fg }]}>Welcome to Native</Text>
        </View>
      </View>

      <View style={styles.contentArea}>
        <TouchableOpacity style={styles.leftTapTarget} onPress={handlePrev} activeOpacity={1} />
        <TouchableOpacity style={styles.rightTapTarget} onPress={handleNext} activeOpacity={1} />

        <View style={styles.headerTextBlock}>
          <Text style={[styles.mainHeadline, { color: fg }]}>{current.title}</Text>
          {current.subtitle ? (
            <Text style={[styles.subtitleText, { color: muted }]}>{current.subtitle}</Text>
          ) : null}
        </View>

        <View style={styles.graphicStage}>
          {activeSlide === 0 && (
            <View style={styles.coinStage}>
              <View style={[styles.speedline, { transform: [{ rotate: '-45deg' }] }]} />
              <View style={[styles.speedline, { transform: [{ rotate: '-22deg' }] }]} />
              <View style={[styles.speedline, { transform: [{ rotate: '0deg' }] }]} />
              <View style={[styles.speedline, { transform: [{ rotate: '22deg' }] }]} />
              <View style={[styles.speedline, { transform: [{ rotate: '45deg' }] }]} />

              <View style={styles.coinPerspectiveWrapper}>
                <View style={styles.coinEdge3D}>
                  <View style={styles.coinFace3D}>
                    <Text style={styles.coinLetter3D}>N</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeSlide === 1 && (
            <View style={styles.cardsStackStage}>
              <View style={[styles.cardCommon, styles.roseGoldCard]}>
                <Text style={styles.cardBrandWhite}>Native</Text>
                <View style={styles.cardSimChip} />
              </View>

              <View style={[styles.cardCommon, styles.rainbowCard]}>
                <Text style={styles.cardBrandWhite}>Native</Text>
                <View style={styles.cardSimChipRight} />
              </View>

              <View style={[styles.cardCommon, styles.invertedPeekingCard]}>
                <View style={styles.peekingRow}>
                  <Wifi size={14} color="#A1A1AA" style={styles.contactlessIcon} />
                  <Text style={styles.peekingNumbers}>5273 4620 7703 5008</Text>
                  <Text style={styles.peekingMeta}>EXP 11/25  CVC 142</Text>
                </View>
              </View>
            </View>
          )}

          {activeSlide === 2 && (
            <View style={styles.discsStage}>
              <View style={[styles.discItem, styles.discTitanium]}>
                <View style={styles.discInner}>
                  <Text style={styles.discEmboss}>G</Text>
                </View>
              </View>

              <View style={[styles.discItem, styles.discCopper]}>
                <View style={styles.discInner}>
                  <Text style={styles.discEmbossSmall}>S</Text>
                </View>
              </View>

              <View style={[styles.discItem, styles.discSilver]}>
                <View style={styles.discInner}>
                  <Text style={[styles.discEmbossSmall, { color: '#3F3F46' }]}>A</Text>
                </View>
              </View>

              <View style={[styles.discItem, styles.discBronze]}>
                <View style={styles.discInner}>
                  <Text style={styles.discEmbossSmall}>IBM</Text>
                </View>
              </View>

              <View style={[styles.discItem, styles.discBlueSteel]}>
                <View style={styles.discInner}>
                  <Text style={styles.discEmbossSmall}>M</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomButtonsWrapper}>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            current.isDark ? styles.primaryOnDark : styles.primaryOnLight,
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
              { color: current.isDark ? colors.onLight : colors.white },
            ]}
          >
            Create account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.ctaButton,
            current.isDark ? styles.secondaryOnDark : styles.secondaryOnLight,
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
              { color: current.isDark ? colors.text : colors.onLight },
            ]}
          >
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space.xl,
  },
  topProgressWrapper: {
    width: '100%',
    paddingTop: space.sm,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: space.lg,
  },
  progressBarWrapper: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(128, 128, 128, 0.25)',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    borderRadius: radius.pill,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  logoPill: {
    width: 22,
    height: 22,
    borderRadius: radius.xs,
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
    paddingVertical: space.md,
  },
  leftTapTarget: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '34%',
    zIndex: 10,
  },
  rightTapTarget: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '34%',
    zIndex: 10,
  },
  headerTextBlock: {
    paddingTop: space.sm,
    paddingHorizontal: 4,
  },
  mainHeadline: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    marginTop: space.sm,
  },
  graphicStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: space.sm,
  },

  // Slide 0 — metallic coin
  coinStage: {
    width: 300,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  speedline: {
    position: 'absolute',
    width: 1,
    height: 280,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
  },
  coinPerspectiveWrapper: {
    width: 210,
    height: 116,
    transform: [{ rotateX: '55deg' }, { rotateZ: '-12deg' }],
  },
  coinEdge3D: {
    width: 210,
    height: 116,
    borderRadius: 105,
    backgroundColor: '#63666D',
    borderWidth: 3,
    borderColor: '#C9CBD1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinFace3D: {
    width: 200,
    height: 106,
    borderRadius: 100,
    backgroundColor: '#E8E9EC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F6F6F7',
  },
  coinLetter3D: {
    fontSize: 68,
    fontWeight: '900',
    color: '#A6A8AE',
    letterSpacing: -2,
    transform: [{ scaleY: 1.1 }],
  },

  // Slide 1 — stacked cards
  cardsStackStage: {
    width: 290,
    height: 262,
    position: 'relative',
    alignItems: 'center',
  },
  cardCommon: {
    width: 268,
    height: 148,
    borderRadius: radius.lg,
    padding: space.lg,
    position: 'absolute',
  },
  roseGoldCard: {
    top: 0,
    backgroundColor: '#DBA697',
    zIndex: 1,
  },
  rainbowCard: {
    top: 56,
    backgroundColor: '#E45533',
    zIndex: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  invertedPeekingCard: {
    top: 128,
    backgroundColor: '#26272B',
    zIndex: 0,
  },
  cardBrandWhite: {
    color: colors.white,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cardSimChip: {
    position: 'absolute',
    right: space.xl,
    bottom: space.xl,
    width: 32,
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: radius.xs,
  },
  cardSimChipRight: {
    position: 'absolute',
    right: space.xl,
    bottom: space.xl,
    width: 32,
    height: 24,
    backgroundColor: '#F2D98B',
    borderRadius: radius.xs,
  },
  peekingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 78,
  },
  contactlessIcon: {
    transform: [{ rotate: '90deg' }],
  },
  peekingNumbers: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
  },
  peekingMeta: {
    color: '#A1A1AA',
    fontSize: 9,
    fontWeight: '600',
  },

  // Slide 2 — stacked discs
  discsStage: {
    width: 220,
    height: 264,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  discItem: {
    width: 168,
    height: 50,
    borderRadius: radius.pill,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discTitanium: {
    top: 10,
    backgroundColor: '#26272B',
    borderWidth: 2,
    borderColor: '#3F4046',
    zIndex: 5,
  },
  discCopper: {
    top: 58,
    backgroundColor: '#8F3512',
    borderWidth: 2,
    borderColor: '#B74A20',
    zIndex: 4,
  },
  discSilver: {
    top: 106,
    backgroundColor: '#E4E5E8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 3,
  },
  discBronze: {
    top: 154,
    backgroundColor: '#6E3010',
    borderWidth: 2,
    borderColor: '#8A3D15',
    zIndex: 2,
  },
  discBlueSteel: {
    top: 202,
    backgroundColor: '#1C356E',
    borderWidth: 2,
    borderColor: '#2B4FA0',
    zIndex: 1,
  },
  discInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  discEmboss: {
    fontSize: 24,
    fontWeight: '900',
    color: '#A1A1AA',
  },
  discEmbossSmall: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.88)',
  },

  bottomButtonsWrapper: {
    width: '100%',
    gap: space.md,
    paddingTop: space.sm,
  },
  ctaButton: {
    width: '100%',
    height: 54,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryOnDark: {
    backgroundColor: colors.white,
  },
  primaryOnLight: {
    backgroundColor: colors.onLight,
  },
  secondaryOnDark: {
    backgroundColor: colors.surface,
  },
  secondaryOnLight: {
    backgroundColor: '#F1F2F4',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
