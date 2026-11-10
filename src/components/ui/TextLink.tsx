import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type TextLinkProps = {
  label: string;
  onPress: () => void;
  /** Texto comum antes do link (ex.: "Não tem conta?"). */
  prefix?: string;
};

export function TextLink({ label, onPress, prefix }: TextLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={prefix ? `${prefix} ${label}` : label}
      style={styles.container}
    >
      <Text style={styles.text}>
        {prefix ? `${prefix} ` : ''}
        <Text style={styles.link}>{label}</Text>
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
  link: { ...typography.bodyStrong, color: colors.primary, textDecorationLine: 'underline' },
});
