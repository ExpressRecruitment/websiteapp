/**
 * Express Recruitment brand theme.
 *
 * Brand colors: teal (#008080), red (#FF0000), white, on Montserrat.
 * The app intentionally uses a single fixed light theme (no dark mode)
 * to keep the brand look consistent across devices.
 */

export const colors = {
  teal: '#008080',
  tealDark: '#00595A',
  tealLight: '#E5F2F2',
  red: '#FF0000',
  redDark: '#CC0000',
  white: '#FFFFFF',
  black: '#141414',

  // Semantic aliases used throughout the app.
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F7F7',
  border: '#E1E8E8',
  text: '#141414',
  textMuted: '#5B6A6A',
  textOnPrimary: '#FFFFFF',
  primary: '#008080',
  primaryPressed: '#00595A',
  danger: '#FF0000',
  dangerPressed: '#CC0000',
  success: '#1E8E5A',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

/**
 * Font families. Loaded via @expo-google-fonts/montserrat in app/_layout.tsx.
 * Falls back to the system font until the fonts are ready.
 */
export const fonts = {
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semiBold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
