import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
  style?: ViewStyle;
};

const variantStyles: Record<
  ButtonVariant,
  { background: string; border: string; text: string; spinner: string }
> = {
  primary: {
    background: colors.primary,
    border: colors.primary,
    text: colors.primaryContrast,
    spinner: colors.primaryContrast,
  },
  secondary: {
    background: colors.accent,
    border: colors.accent,
    text: colors.text,
    spinner: colors.text,
  },
  outline: {
    background: 'transparent',
    border: colors.primary,
    text: colors.primary,
    spinner: colors.primary,
  },
  danger: {
    background: colors.error,
    border: colors.error,
    text: colors.primaryContrast,
    spinner: colors.primaryContrast,
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
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
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.spinner} />
      ) : (
        <Text style={[styles.label, { color: v.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { ...typography.bodyStrong, fontWeight: '700' },
});