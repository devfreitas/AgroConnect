import type { TextStyle } from 'react-native';

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
  metric: 40,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

export const typography = {
  metric: {
    fontSize: fontSize.metric,
    lineHeight: 46,
    fontWeight: fontWeight.heavy,
    letterSpacing: -1,
  },
  display: {
    fontSize: fontSize.display,
    lineHeight: 40,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: fontSize.xxl,
    lineHeight: 34,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.4,
  },
  heading: {
    fontSize: fontSize.xl,
    lineHeight: 28,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.2,
  },
  subheading: { fontSize: fontSize.lg, lineHeight: 24, fontWeight: fontWeight.semibold },
  body: { fontSize: fontSize.md, lineHeight: 24, fontWeight: fontWeight.regular },
  bodyStrong: { fontSize: fontSize.md, lineHeight: 24, fontWeight: fontWeight.semibold },
  caption: { fontSize: fontSize.sm, lineHeight: 20, fontWeight: fontWeight.regular },
  label: { fontSize: fontSize.sm, lineHeight: 20, fontWeight: fontWeight.medium },
  /** Rótulo pequeno em caixa alta, para títulos de seção e métricas. */
  overline: {
    fontSize: fontSize.xs,
    lineHeight: 16,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;
