import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type LoaderProps = {
  message?: string;
  fullScreen?: boolean;
};

export function Loader({ message, fullScreen = false }: LoaderProps) {
  return (
    <View
      style={[styles.container, fullScreen && styles.fullScreen]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={message ?? 'Carregando'}
    >
      <ActivityIndicator size="large" color={fullScreen ? colors.accent : colors.primary} />
      {message ? (
        <Text style={[styles.message, fullScreen && styles.messageOnInk]}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  fullScreen: { flex: 1, backgroundColor: colors.ink },
  message: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  messageOnInk: { color: colors.onInkMuted },
});
