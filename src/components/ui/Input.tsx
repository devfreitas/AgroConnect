import { forwardRef, useState, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

type InputRef = ComponentRef<typeof TextInput>;

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
};

export const Input = forwardRef<InputRef, InputProps>(function Input(
  { label, error, helperText, secureTextEntry, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const isPassword = Boolean(secureTextEntry);
  const borderColor = error ? colors.error : focused ? colors.primary : colors.border;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.field, { borderColor }]}>
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={colors.textMuted}
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
            <Text style={styles.toggleText}>{hidden ? 'Mostrar' : 'Ocultar'}</Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'stretch', gap: spacing.xs },
  label: { ...typography.label, color: colors.text },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  toggle: { paddingLeft: spacing.sm, minHeight: 44, justifyContent: 'center' },
  toggleText: { ...typography.label, color: colors.primary },
  error: { ...typography.caption, color: colors.error },
  helper: { ...typography.caption, color: colors.textMuted },
});