import type { TextStyle } from 'react-native';

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const typography = {
  display: { fontSize: fontSize.display, lineHeight: 40, fontWeight: fontWeight.bold },
  title: { fontSize: fontSize.xxl, lineHeight: 34, fontWeight: fontWeight.bold },
  heading: { fontSize: fontSize.xl, lineHeight: 28, fontWeight: fontWeight.semibold },
  subheading: { fontSize: fontSize.lg, lineHeight: 24, fontWeight: fontWeight.semibold },
  body: { fontSize: fontSize.md, lineHeight: 24, fontWeight: fontWeight.regular },
  bodyStrong: { fontSize: fontSize.md, lineHeight: 24, fontWeight: fontWeight.semibold },
  caption: { fontSize: fontSize.sm, lineHeight: 20, fontWeight: fontWeight.regular },
  label: { fontSize: fontSize.sm, lineHeight: 20, fontWeight: fontWeight.medium },
} satisfies Record<string, TextStyle>;