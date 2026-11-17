import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

import { Button } from './Button';
import { IconBadge } from './IconBadge';
import type { IconName } from './icons';

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Ícone do Ionicons. Tem prioridade sobre `icon`. */
  iconName?: IconName;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  iconName = 'leaf-outline',
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon ?? <IconBadge icon={iconName} size={64} />}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          fullWidth={false}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  description: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  action: { marginTop: spacing.md },
});
