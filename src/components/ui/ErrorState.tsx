import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

import { Button } from './Button';
import { IconBadge } from './IconBadge';

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = 'Não foi possível carregar',
  message = 'Verifique sua conexão e tente novamente.',
  onRetry,
  retryLabel = 'Tentar novamente',
}: ErrorStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <IconBadge
        icon="cloud-offline-outline"
        color={colors.error}
        background={colors.errorSoft}
        size={64}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button
          title={retryLabel}
          onPress={onRetry}
          icon="refresh"
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
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  message: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  action: { marginTop: spacing.md },
});
