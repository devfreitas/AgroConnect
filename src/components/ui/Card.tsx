import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

type CardVariant = 'default' | 'raised' | 'dark' | 'tinted';

type CardProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
  /** Faixa de cor na lateral esquerda (ex.: severidade de um alerta). */
  accentColor?: string;
  /** Remove o espaçamento interno (para conteúdo que vai até a borda). */
  flush?: boolean;
};

/** Cartão base. `raised` ganha sombra, `dark` é a superfície escura da marca, `tinted` é discreto. */
export function Card({
  style,
  children,
  variant = 'default',
  accentColor,
  flush,
  ...rest
}: CardProps) {
  return (
    <View style={[styles.card, variantStyles[variant], flush && styles.flush, style]} {...rest}>
      {accentColor ? <View style={[styles.accent, { backgroundColor: accentColor }]} /> : null}
      {children}
    </View>
  );
}

const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  raised: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  dark: {
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: colors.inkRaised,
    ...shadows.lg,
  },
  tinted: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    padding: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  flush: { padding: 0 },
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
});
