import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type SectionHeaderProps = {
  title: string;
  /** Texto do atalho à direita (ex.: "Ver todos"). */
  actionLabel?: string;
  onAction?: () => void;
};

/** Título de seção com atalho opcional. */
export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={8}
          style={styles.action}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  title: { ...typography.subheading, color: colors.text },
  action: { minHeight: 44, justifyContent: 'center' },
  actionText: { ...typography.label, color: colors.primaryDark, fontWeight: '700' },
});
