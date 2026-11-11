import { DefaultTheme, type Theme } from '@react-navigation/native';

import { colors } from './colors';

/** Tema do React Navigation com a identidade visual do AgroConnect. */
export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.error,
  },
};
