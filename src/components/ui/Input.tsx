import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

import type { IconName } from './icons';

type InputRef = ComponentRef<typeof TextInput>;

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
  /** Ícone decorativo à esquerda. */
  icon?: IconName;
  /** `soft`: campo preenchido, sem contorno (usado nas telas de acesso). */
  tone?: 'default' | 'soft';
};

export const Input = forwardRef<InputRef, InputProps>(function Input(
  { label, error, helperText, icon, tone = 'default', secureTextEntry, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const isPassword = Boolean(secureTextEntry);
  const multiline = Boolean(rest.multiline);

  const soft = tone === 'soft';
  const borderColor = error
    ? colors.error
    : focused
      ? colors.primary
      : soft
        ? 'transparent'
        : colors.border;
  const iconColor = error ? colors.error : focused ? colors.primary : colors.secondary;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.field,
          multiline && styles.fieldMultiline,
          soft && styles.fieldSoft,
          focused && !soft && styles.fieldFocused,
          { borderColor },
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={iconColor}
            style={multiline ? styles.iconTop : undefined}
          />
        ) : null}

        <TextInput
          ref={ref}
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor={colors.secondary}
          secureTextEntry={isPassword && hidden}
          accessibilityLabel={label}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setHidden((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
            hitSlop={8}
            style={styles.toggle}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'stretch', gap: spacing.xs + 2 },
  label: { ...typography.label, color: colors.text, fontWeight: '700' },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    minHeight: 54,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderRadius: radius.md + 2,
    backgroundColor: colors.surface,
  },
  fieldSoft: { backgroundColor: colors.canvas },
  fieldFocused: { backgroundColor: colors.primarySoft + '55' },
  fieldMultiline: { alignItems: 'flex-start', minHeight: 104 },
  iconTop: { marginTop: spacing.md - 2 },
  input: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.text,
  },
  inputMultiline: { minHeight: 104, textAlignVertical: 'top' },
  toggle: { minHeight: 44, minWidth: 32, alignItems: 'center', justifyContent: 'center' },
  messageRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  error: { ...typography.caption, color: colors.error, flex: 1 },
  helper: { ...typography.caption, color: colors.textMuted },
});
