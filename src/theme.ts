/**
 * Single source of truth for the Native interface.
 *
 * Rules:
 * - One accent colour. No decorative glows, auras or coloured drop shadows.
 * - One neutral surface ramp. Every card/list/sheet uses it.
 * - One radius scale. No ad-hoc 5/6/7/9/17/19/27 values.
 * - Typography is limited to the roles below.
 */

export const colors = {
  /** App canvas */
  background: '#0A0B0D',
  /** Sheets and full-screen modals */
  sheet: '#101114',
  /** Cards, rows, inputs */
  surface: '#16181C',
  /** Pressed / raised surfaces */
  surfaceRaised: '#1E2126',
  /** Inset areas such as the app chrome */
  surfaceSunken: '#0D0E11',

  border: 'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',

  text: '#F7F8FA',
  textSecondary: '#A2A8B4',
  textMuted: '#6C7280',

  accent: '#3D7BFF',
  accentSoft: 'rgba(61, 123, 255, 0.14)',

  positive: '#35C77B',
  positiveSoft: 'rgba(53, 199, 123, 0.12)',
  positiveBorder: 'rgba(53, 199, 123, 0.24)',
  negative: '#F05252',
  negativeSoft: 'rgba(240, 82, 82, 0.12)',
  warning: '#F0B429',

  /** Metal card tier cue. Used only on the Metal badge. */
  metal: '#E5C158',
  metalSoft: 'rgba(212, 175, 55, 0.12)',
  metalBorder: 'rgba(212, 175, 55, 0.35)',

  /** Physical card artwork */
  cardMetal: '#22252B',
  cardVirtual: '#15171C',
  chip: '#B98A3F',

  /** Modal scrim */
  overlay: 'rgba(0, 0, 0, 0.7)',
  /** Hairline on white surfaces */
  onLightHairline: 'rgba(0, 0, 0, 0.08)',

  onLight: '#0A0B0D',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  sheet: 26,
  pill: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

const weight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

export const type = {
  display: {
    color: colors.text,
    fontSize: 38,
    fontWeight: weight.heavy,
    letterSpacing: -1,
  },
  screenTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: weight.bold,
    letterSpacing: -0.6,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: weight.bold,
    letterSpacing: -0.3,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: weight.bold,
    letterSpacing: -0.2,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyStrong: {
    color: colors.text,
    fontSize: 15,
    fontWeight: weight.semibold,
  },
  caption: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  overline: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: weight.semibold,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
} as const;

/** Primary action: white pill button on the dark canvas. */
export const primaryButton = {
  height: 54,
  borderRadius: radius.pill,
  backgroundColor: colors.white,
  alignItems: 'center',
  justifyContent: 'center',
} as const;

export const primaryButtonText = {
  color: colors.onLight,
  fontSize: 16,
  fontWeight: weight.bold,
} as const;

/** Secondary action: quiet surface button. */
export const secondaryButton = {
  height: 52,
  borderRadius: radius.pill,
  backgroundColor: colors.surfaceRaised,
  alignItems: 'center',
  justifyContent: 'center',
} as const;

export const secondaryButtonText = {
  color: colors.text,
  fontSize: 15,
  fontWeight: weight.semibold,
} as const;

export const disabledButton = {
  ...primaryButton,
  backgroundColor: colors.surfaceRaised,
} as const;

export const disabledButtonText = {
  color: colors.textMuted,
  fontSize: 16,
  fontWeight: weight.bold,
} as const;

export const disabledOpacity = 0.4;
