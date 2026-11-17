import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/theme';

import type { IconName } from './icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Ícone à esquerda do texto. */
  icon?: IconName;
  accessibilityHint?: string;
  style?: ViewStyle;
};

const variantStyles: Record<
  ButtonVariant,
  { background: string; border: string; text: string; spinner: string; shadow: boolean }
> = {
  primary: {
    background: colors.primary,
    border: colors.primary,
    text: colors.primaryContrast,
    spinner: colors.primaryContrast,
    shadow: true,
  },
  secondary: {
    background: colors.accent,
    border: colors.accent,
    text: colors.ink,
    spinner: colors.ink,
    shadow: false,
  },
  outline: {
    background: 'transparent',
    border: colors.primary,
    text: colors.primaryDark,
    spinner: colors.primary,
    shadow: false,
  },
  danger: {
    background: colors.errorSoft,
    border: colors.errorSoft,
    text: colors.error,
    spinner: colors.error,
    shadow: false,
  },
  ghost: {
    background: 'transparent',
    border: 'transparent',
    text: colors.primaryDark,
    spinner: colors.primary,
    shadow: false,
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  accessibilityHint,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const v = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.background, borderColor: v.border },
        v.shadow && !isDisabled && shadows.md,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.spinner} />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={20} color={v.text} /> : null}
          <Text style={[styles.label, { color: v.text }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.5 },
  label: { ...typography.bodyStrong, fontWeight: '700', letterSpacing: 0.2 },
});
