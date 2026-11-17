import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type TextLinkProps = {
  label: string;
  onPress: () => void;
  /** Texto comum antes do link (ex.: "Não tem conta?"). */
  prefix?: string;
  /** `onInk` para usar sobre áreas escuras. */
  tone?: 'default' | 'onInk';
};

export function TextLink({ label, onPress, prefix, tone = 'default' }: TextLinkProps) {
  const onInk = tone === 'onInk';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={prefix ? `${prefix} ${label}` : label}
      style={styles.container}
    >
      <Text style={[styles.text, onInk && styles.textOnInk]}>
        {prefix ? `${prefix} ` : ''}
        <Text style={[styles.link, onInk && styles.linkOnInk]}>{label}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  text: { ...typography.body, color: colors.text, textAlign: 'center' },
  textOnInk: { color: colors.onInkMuted },
  link: { ...typography.bodyStrong, color: colors.primaryDark, textDecorationLine: 'underline' },
  linkOnInk: { color: colors.accent },
});
